<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

class Data {

	// zip化で自動書き換え
	const IS_PRO = false;

	// DB名
	const DB_NAMES = [
		'general'     => 'arkhe_blocks_general',
		'format'      => 'arkhe_blocks_format',
		'block'       => 'arkhe_blocks_block',
		'shortcode'   => 'arkhe_blocks_shortcode',
		'licence_key' => 'arkhe_licence_key', // ライセンスキーはArkheテーマと同じDBレコードを使う
		// 'custom_code' => 'arkhe_blocks_custom_code',
	];

	// データ通信先
	const CDN_URL = 'https://loos-cdn.com/arkhe';

	// 設定ページスラッグ
	const MENU_SLUG        = 'arkhe_blocks_settings';
	const MENU_PAGE_PREFIX = 'arkb_menu_page_';

	const CACHE_KEYS = [
		'licence'           => 'arkhe_licence_data', // ライセンスのキャッシュキーはテーマ側と同じものを使う
		'get_custom_styles' => 'arkb_get_custom_styles',
	];

	// basename
	public static $basename = '';

	// version
	public static $version  = '';
	public static $file_ver = '';

	// 設定データを保持する変数
	protected static $data  = [];
	public static $defaults = [];

	// blocksデータ
	public static $blocks         = [
		'accordion',
		'accordion-item',
		'button',
		'buttons',
		'column',
		'columns',
		'container',
		'faq',
		'faq-item',
		'dl',
		'dl-dt',
		'dl-dd',
		'dl-div',
		'notice',
		'section-heading',
		'step',
		'step-item',
		'tab',
		'tab-body',
		'timeline',
		'timeline-item',
	];
	public static $dynamic_blocks = [
		'section',
		'blog-card',
		'custom-code',
		'toc',
	];

	// memo: block.jsonの"style"にハンドル名を指定する
	public static $blocks_has_style = [
		'accordion',
		'blog-card',
		'box-links',
		'button',
		'columns',
		'container',
		'dl',
		'faq',
		'notice',
		'section',
		'section-heading',
		'slider',
		'step',
		'tab',
		'timeline',
		'toc',
	];

	// メニューの設定タブ
	public static $menu_tabs = [];

	// JSの読み込みを制御する変数
	public static $use = [];

	// スライダーのサムネイル生成に使用する
	public static $slide_images = [];

	// 外部からインスタンス化させない
	private function __construct() {}

	// init()
	public static function init() {

		// ライセンスセット（テーマ本体の @after_setup_theme.1 より後で）
		add_action( 'after_setup_theme', [ '\Arkhe_Blocks\Licence', 'init' ], 5 );

		// 設定データセット
		add_action( 'after_setup_theme', [ '\Arkhe_Blocks', 'data_init' ], 9 );
	}


	/**
	 * デフォルト値をセット
	 */
	private static function set_defaults() {
		// 設定項目をあとから減らしたり名前変更すると show_in_rest -> schema がずれるので注意。（変更したらschemaで手動追加する必要あり）
		self::$defaults = [
			'general'     => [
				'disable_ex_core'     => '',
				'disable_format'      => '',
				'disable_header_link' => '',
				'use_fse_blocks'      => '',
				'use_core_patterns'   => '',
				'use_custom_space'    => '',
				'dynamic_css_to_head' => '',
				'palette_colors'      => [],
			],
			'format'      => [
				'custom_formats'      => [
					[
						'name' => __( 'Custom 01', 'arkhe-blocks' ),
						'slug' => '1',
						'css'  => '',
					],
				],
				'custom_format_css'   => '',
				'marker_color'        => '#ffdc40',
				'marker_style'        => 'fill',
				'marker_start'        => '1em',
				'is_marker_txt_bold'  => '',
			],
			'block'       => [
				'block_styles'       => [],
				'show_spacer_guide'  => '1',
				'btn_default_radius' => '0',
				'btn_default_color'  => '',
				'toc_color'          => '',
				'toc_title'          => __( 'Table of Contents', 'arkhe-blocks' ),
				'toc_target'         => 'h3',
				'toc_threshold'      => '2',
				'toc_script'         => 'php',
			],
			// memo: 任意のショートコードを登録して呼び出せるような機能を作る
			'shortcode'   => [],
			// 'custom_code' => [
			// 	'settings' => [
			// 		'theme' => 'vs-dark',
			// 	],
			// ],
		];
	}


	/**
	 * 設定データの初期セット
	 */
	public static function data_init() {

		// デフォルト値をセット
		self::set_defaults();

		// 保存済みデータとデフォルト値をマージ
		foreach ( self::DB_NAMES as $key => $db_name ) {
			$db_data = get_option( $db_name ) ?: [];
			// 旧カスタム書式データの変換
			if ( 'arkhe_blocks_format' === $db_name ) {
				$db_data = \Arkhe_Blocks::migrate_custom_format( $db_data );
			}

			// ライセンスデータはデフォルトデータを持たないので除外する
			if ( isset( self::$defaults[ $key ] ) ) {
				self::$data[ $key ] = array_merge( self::$defaults[ $key ], $db_data );
			}
		}

		// 設定メニューのタブをセット
		self::$menu_tabs = [
			'general' => _x( 'General', 'tab', 'arkhe-blocks' ),
			'format'  => _x( 'Format', 'tab', 'arkhe-blocks' ),
			'block'   => _x( 'Block', 'tab', 'arkhe-blocks' ),
		];

		// 環境によって使用できるかが変わるブロック

		// Pro版でのみ利用可
		if ( self::IS_PRO ) {
			self::$blocks = array_merge( self::$blocks, [
				'box-links',
			] );

			self::$dynamic_blocks = array_merge( self::$dynamic_blocks, [
				'box-link',
				'slider',
				'slider-item',
				'restricted-area',
			] );

			// ProかつArkheでのみ利用可能なダイナミックブロック
			if ( IS_ARKHE_THEME ) {
				self::$dynamic_blocks = array_merge( self::$dynamic_blocks, [
					'page-list',
					'post-list',
					'rss',
				] );
			}
		}

		// データの強制セットが必要な場合
		if ( ! IS_ARKHE_THEME ) {
			self::set_data( 'block', 'toc_script', 'php' );
		}
	}


	/**
	 * 設定データのデフォルト値を取得
	 *   キーが指定されていればそれを、指定がなければ全てを返す。
	 */
	public static function get_default_data( $name_key = '', $key = '' ) {

		// DBのID名の指定なければ全部返す
		if ( '' === $name_key ) return self::$defaults;

		// DBのID名が存在しない時
		if ( ! isset( self::$defaults[ $name_key ] ) ) return null;

		// ID指定のみでキーの指定がない時
		if ( '' === $key ) return self::$defaults[ $name_key ];

		// 指定されたIDのデータの中に指定されたキーが存在しない時
		if ( ! isset( self::$defaults[ $name_key ][ $key ] ) ) return '';

		// id, key がちゃんとある時
		return self::$defaults[ $name_key ][ $key ];
	}


	/**
	 * 設定データ取得
	 */
	public static function get_data( $name_key = '', $key = '' ) {

		// DBのID名の指定なければ全部返す
		if ( '' === $name_key ) return self::$data;

		// DBのID名が存在しない時
		if ( ! isset( self::$data[ $name_key ] ) ) return null;

		// ID指定のみでキーの指定がない時
		if ( '' === $key ) return self::$data[ $name_key ];

		// 指定されたIDのデータの中に指定されたキーが存在しない時
		if ( ! isset( self::$data[ $name_key ][ $key ] ) ) return '';

		// id, key がちゃんとある時
		return self::$data[ $name_key ][ $key ];
	}


	/**
	 * 設定データを強制セット
	 */
	public static function set_data( $name_key = '', $key = '', $val = '' ) {
		if ( '' === $name_key || '' === $key ) return;
		if ( ! isset( self::$data[ $name_key ] ) ) return;
		self::$data[ $name_key ][ $key ] = $val;
	}


	/**
	 * 設定データをリセット
	 */
	// public static function reset_data( $id = '' ) {
	// 	if ( $id ) {
	// 		// 指定されたものだけ削除
	// 		delete_option( \Arkhe_Blocks::DB_NAMES[ $id ] );
	// 	} else {
	// 		// カスタマイザー以外全削除
	// 		foreach ( \Arkhe_Blocks::DB_NAMES as $key => $db_name ) {
	// 			delete_option( $db_name );
	// 		}
	// 	}
	// }
}
