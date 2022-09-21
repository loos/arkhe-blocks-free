<?php
namespace Arkhe_Blocks;

class Licence {

	// ライセンスキー
	public static $licence_key  = '';
	public static $licence_data = [];

	/**
	 * 取得→セット
	 */
	public static function init() {

		if ( ! \Arkhe_Blocks::IS_PRO ) return;

		// ライセンスデータ
		if ( IS_ARKHE_THEME ) {
			self::$licence_key  = \Arkhe::$licence_key;
			self::$licence_data = \Arkhe::$licence_data;
			return;
		}

		$licence_key = get_option( \Arkhe_Blocks::DB_NAMES['licence_key'] ) ?: '';

		if ( ! $licence_key ) return;

		$licence_data       = self::get_licence_data( $licence_key );
		self::$licence_key  = $licence_key;
		self::$licence_data = $licence_data;
	}


	/**
	 * 有効なライセンスかどうか
	 */
	public static function has_licence() {
		if ( empty( self::$licence_data ) )  return false;
		$status = (int) self::$licence_data['status'] ?? 0;

		// 有効なライセンスキーだった場合
		return ( 1 === $status || 2 === $status );
	}


	/**
	 * アップデート用のパスを取得
	 */
	public static function get_update_path() {
		if ( ! self::has_licence() ) return '';
		return self::$licence_data['path'] ?? '';
	}


	/**
	 * ライセンスステータスを取得( キャッシュがあれば優先 )
	 */
	public static function get_licence_data( $licence_key = '' ) {

		// キャッシュが残っていればそちらを返す
		$data = get_transient( \Arkhe_Blocks::CACHE_KEYS['licence'] );
		if ( $data ) return $data;

		// ライセンスチェック
		$data = self::check_licence( $licence_key );

		// キャッシュ保存して return
		set_transient( \Arkhe_Blocks::CACHE_KEYS['licence'], $data, DAY_IN_SECONDS ); // キャッシュ期間 : １日
		return $data;
	}


	/**
	 * ライセンスチェック
	 */
	public static function check_licence( $licence_key = '' ) {

		$send_data = [
			'type'        => 'get_status',
			'licence_key' => $licence_key,
		];

		// ライセンス用DBに接続
		$response = wp_remote_post(
			\Arkhe_Blocks::CDN_URL . '/licence/check',
			[
				'method'      => 'POST',
				'timeout'     => 15,
				'redirection' => 5,
				'sslverify'   => false,
				'body'        => $send_data,
				// 'httpversion' => '1.0',
				// 'blocking'    => true,
				// 'data_format' => 'body',
				// 'headers'     => array(),
			]
		);

		if ( is_wp_error( $response ) ) {
			return [
				'status'  => 500,
				'error'   => 1,
				'message' => $response->get_error_message(),
			];
		}

		// レスポンスを取得（json なので配列にデコード）
		$get_data = json_decode( $response['body'], true );

		// 配列でない場合や、statusが取得できない時は何かデータがおかしい
		if ( ! is_array( $get_data ) || ! isset( $get_data['status'] ) ) {
			return [
				'status'  => 500,
				'error'   => 1,
				'message' => 'The data format is incorrect.',
			];
		}

		// 正常なデータ
		return $get_data;
	}
}
