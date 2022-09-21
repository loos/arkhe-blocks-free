<?php
namespace Arkhe_Blocks\Api;

defined( 'ABSPATH' ) || exit;

// エンドポイントを追加
add_action( 'rest_api_init', __NAMESPACE__ . '\rest_api_init' );
function rest_api_init() {

	// 設定のエクスポート
	register_rest_route( 'wp/v2', '/arkhe-blocks-settings-export', [
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function( $request ) {
			// リクエストパラメータのチェック
			if ( ! isset( $request['nameKey'] ) || ! isset( $request['key'] ) ) {
				wp_die();
			}

			$name_key = $request['nameKey'];
			$key      = $request['key'];

			if ( ! isset( \Arkhe_Blocks::$defaults[ $name_key ][ $key ] ) ) {
				wp_die();
			}

			// 現在の設定を取得
			$db_data = \Arkhe_Blocks::get_data( $name_key );
			if ( 'custom_formats' === $key ) {
				$db_data = \Arkhe_Blocks::migrate_custom_format( $db_data );
			}

			// エクスポートデータのチェック
			$settings_data = $db_data[ $key ];
			if ( empty( $settings_data ) ) {
				wp_die( esc_html__( 'There is no data to export.', 'arkhe-blocks' ) );
			}

			$response = [
				'nameKey'  => $name_key,
				'key'      => $key,
				'settings' => $settings_data,
			];

			return wp_json_encode( $response );
		},
	] );

	// 設定のインポートチェック
	register_rest_route( 'wp/v2', '/arkhe-blocks-settings-import-check', [
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function( $request ) {
			// リクエストパラメータのチェック
			if ( ! isset( $request['importData'] ) || ! isset( $request['nameKey'] ) || ! isset( $request['key'] ) || ! isset( $request['maxCount'] ) ) {
				wp_die( esc_html__( 'Insufficient request parameters.', 'arkhe-blocks' ) );
			}

			$import_data = $request['importData'] ?? [];
			$name_key    = $request['nameKey'] ?? '';
			$key         = $request['key'] ?? '';
			$max_count   = $request['maxCount'] ?? 10;

			// インポートデータに正しいフィールドが指定されているか
			if ( ! isset( $import_data['nameKey'] ) || ! isset( $import_data['key'] ) || ! isset( $import_data['settings'] ) ) {
				wp_die( esc_html__( 'Incorrect data format.', 'arkhe-blocks' ) );
			}
			if ( ! isset( \Arkhe_Blocks::$defaults[ $import_data['nameKey'] ][ $import_data['key'] ] ) ) {
				wp_die( esc_html__( 'Incorrect data format.', 'arkhe-blocks' ) );
			}

			// インポート先として正しいフィールドが指定されているか
			if ( ! isset( \Arkhe_Blocks::$defaults[ $name_key ][ $key ] ) ) {
				wp_die( esc_html__( 'Incorrect data format.', 'arkhe-blocks' ) );
			}

			// インポートデータで指定されたフィールドと、インポート先として指定されたフィールドが一致するか
			// (「カラーパレットのインポートでカスタム書式のJSONファイルを指定した」場合などの食い違いを防ぐ)
			if ( $import_data['nameKey'] !== $name_key || $import_data['key'] !== $key ) {
				$settings_title = \Arkhe_Blocks::get_settings_title( $import_data['nameKey'], $import_data['key'] );

				if ( $settings_title ) {
					$message = sprintf(
						// translators: %s: Field name
						__( 'The specified file is import data for "%s".', 'arkhe-blocks' ),
						$settings_title
					);
					wp_die( esc_html( $message ) );
				}
				wp_die( esc_html__( 'Incorrect data format.', 'arkhe-blocks' ) );
			}

			// 最大数を超えないようにカット → インポート時の処理で最大値制限はあるのでここでは不要
			// $import_data['settings'] = array_slice( $import_data['settings'], 0, $max_count );

			// 不正データチェック
			$import_settings = [];

			foreach ( $import_data['settings'] as $settings ) {
				if ( ! isset( $settings['slug'] ) || ! isset( $settings['name'] ) ) continue;
				if ( ! $settings['slug'] || ! $settings['name'] ) continue;

				if ( 'palette_colors' === $key ) {
					if ( ! isset( $settings['color'] ) ) continue;
					if ( ! $settings['color'] ) continue;
					if ( ! preg_match( '/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/', $settings['color'] ) ) continue;
				}
				if ( 'block_styles' === $key ) {
					if ( ! isset( $settings['block'] ) ) continue;
					if ( ! $settings['block'] ) continue;
					if ( ! preg_match( '/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/', $settings['block'] ) ) continue;
				}
				$import_settings[] = $settings;
			}

			// インポートデータに有効なデータが1件以上含まれているか
			if ( count( $import_settings ) === 0 ) {
				wp_die( esc_html__( 'There is no data that can be imported.', 'arkhe-blocks' ) );
			}

			// 現在の設定を取得
			$settings_data = \Arkhe_Blocks::get_data( $name_key );
			if ( 'custom_formats' === $key ) {
				$settings_data = \Arkhe_Blocks::migrate_custom_format( $settings_data );
			}
			$settings_data = $settings_data[ $key ];

			// 既存データとインポートデータを比較し、インポートするデータを新規追加・重複データに振り分ける
			$new_settings = arkb_generate_import_data( $settings_data, $import_settings, $key );

			// 既存データに新規追加出来るデータ件数を算出
			$available_count = $max_count - count( $settings_data );

			return wp_json_encode([
				'nameKey'        => $name_key,
				'key'            => $key,
				'settings'       => $new_settings,
				'availableCount' => $available_count,
			]);
		},
	] );

	// 設定のインポート
	register_rest_route( 'wp/v2', '/arkhe-blocks-settings-import', [
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function( $request ) {
			// リクエストパラメータのチェック
			if ( ! isset( $request['settings'] ) || ! isset( $request['nameKey'] ) || ! isset( $request['key'] ) ) {
				wp_die();
			}

			$import_settings = $request['settings'];
			$name_key        = $request['nameKey'];
			$key             = $request['key'];

			// インポートデータチェック
			if ( ! isset( \Arkhe_Blocks::$defaults[ $name_key ][ $key ] ) || ! isset( \Arkhe_Blocks::DB_NAMES[ $name_key ] ) ) {
				wp_die( esc_html__( 'Incorrect data format.', 'arkhe-blocks' ) );
			}
			if ( count( $import_settings ) === 0 ) {
				wp_die( esc_html__( 'There is no data that can be imported.', 'arkhe-blocks' ) );
			}

			// 現在の設定を取得
			$db_data = \Arkhe_Blocks::get_data( $name_key );
			if ( 'custom_formats' === $key ) {
				$db_data = \Arkhe_Blocks::migrate_custom_format( $db_data );
			}

			// 既存データとマージしてアップデート
			$db_data[ $key ] = array_merge( $db_data[ $key ], $import_settings );
			update_option( \Arkhe_Blocks::DB_NAMES[ $name_key ], $db_data );

			return wp_json_encode([
				'name'     => $key,
				'settings' => $db_data[ $key ],
			]);
		},
	] );
}

/**
 * 既存データとインポートデータを比較し、インポートするデータを新規追加・重複データに振り分ける
 */
function arkb_generate_import_data( $settings_data, $import_data, $key ) {
	$insert_data    = [];
	$duplicate_data = [];
	$settings_slug  = array_column( $settings_data, 'slug' );

	foreach ( $import_data as $data ) {
		// カラーパレット設定、カスタム書式はクラス名・スラッグのみで重複チェック
		if ( 'palette_colors' === $key || 'custom_formats' === $key ) {
			if ( in_array( $data['slug'], $settings_slug, true ) ) {
				$duplicate_data[] = $data;
			} else {
				$insert_data[] = $data;
			}
			continue;
		}
		// カスタムブロックスタイルはブロック・表示名・クラス名で重複チェック
		if ( 'block_styles' === $key ) {
			$filtered_data = array_filter(
				$settings_data,
				function( $setting ) use ( $data ) {
					return $setting['block'] === $data['block'] && $setting['name'] === $data['name'] && $setting['slug'] === $data['slug'];
				}
			);
			if ( count( $filtered_data ) > 0 ) {
				$duplicate_data[] = $data;
			} else {
				$insert_data[] = $data;
			}
			continue;
		}
	}

	return [
		'insert'    => $insert_data,
		'duplicate' => $duplicate_data,
	];
}
