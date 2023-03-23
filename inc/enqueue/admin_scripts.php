<?php
namespace Arkhe_Blocks\Enqueue;

defined( 'ABSPATH' ) || exit;


/**
 * 管理画面で読み込むファイル
 */
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\hook_admin_enqueue_scripts', 21 );
function hook_admin_enqueue_scripts( $hook_suffix ) {

	$is_arkb_page = strpos( $hook_suffix, \Arkhe_Blocks::MENU_SLUG ) !== false;

	// Arkhe Blocks設定ページのみ
	if ( $is_arkb_page ) {
		// 現在のタブを取得
		$now_tab = (string) filter_input( INPUT_GET, 'tab' ) ?: 'general';

		// 設定画面用CSS
		wp_enqueue_style( 'arkhe-blocks-menu', ARKHE_BLOCKS_URL . 'dist/css/menu.css', [ 'wp-components' ], \Arkhe_Blocks::$file_ver );

		// ライセンス認証ページはこれ以上読み込まない
		if ( 'licence' === $now_tab ) return;

		// カラー設定等をメニューでも反映させる
		if ( class_exists( '\Arkhe_Theme\Style' ) ) {
			new \Arkhe_Theme\Style( 'front' );
			wp_add_inline_style( 'arkhe-blocks-menu', ':root{' . \Arkhe_Theme\Style::$root_styles['all'] . '}' );
		}

		// 設定画面用JS
		$asset = include ARKHE_BLOCKS_PATH . 'dist/menu/index.asset.php';
		wp_enqueue_script( 'arkhe-blocks-menu', ARKHE_BLOCKS_URL . 'dist/menu/index.js', $asset['dependencies'], $asset['version'], true );

		// JS用翻訳ファイルの読み込み
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( 'arkhe-blocks-menu', 'arkhe-blocks', ARKHE_BLOCKS_PATH . 'languages' );
		}

		// codemirror
		// see: https://codemirror.net/doc/manual.html#config
		$codemirror = [
			'tabSize'           => 4,
			'indentUnit'        => 4,
			'indentWithTabs'    => true,
			'inputStyle'        => 'contenteditable',
			'lineNumbers'       => true,
			'smartIndent'       => true,
			'lineWrapping'      => true, // 横長のコードを折り返すかどうか
			'autoCloseBrackets' => true,
			'styleActiveLine'   => true,
			'continueComments'  => true,
			// 'extraKeys'         => [],
		];

		$settings = wp_enqueue_code_editor( [
			'type'       => 'text/css',
			'codemirror' => $codemirror,
		] );

		wp_localize_script( 'wp-theme-plugin-editor', 'codeEditorSettings', $settings );
		wp_enqueue_script( 'wp-theme-plugin-editor' );
		wp_enqueue_style( 'wp-codemirror' );

		// 設定画面に投げるグローバル変数
		wp_localize_script( 'arkhe-blocks-menu', 'arkbMenuVars', [
			'isArkhe'          => IS_ARKHE_THEME,
			'isPro'            => \Arkhe_Blocks::IS_PRO,
			'defaultData'      => \Arkhe_Blocks::$defaults,
			'data'             => \Arkhe_Blocks::get_data(),
			'ajaxUrl'          => admin_url( 'admin-ajax.php' ),
			'ajaxNonce'        => wp_create_nonce( 'arkb-nonce' ),
			'searchableBlocks' => 'block' === $now_tab ? arkb_get_searchable_blocks() : [],
		] );
	}
}



/**
 * adminのheadに追加する処理
 */
add_action( 'admin_head', __NAMESPACE__ . '\hook_admin_head', 20 );
function hook_admin_head() {

	$output_code = arkb_get_admin_head_code();
	if ( ! $output_code ) return;

	echo PHP_EOL . '<!-- Arkhe Blocks -->' . PHP_EOL;
	echo $output_code; // phpcs:ignore
	echo '<!-- / Arkhe Blocks -->' . PHP_EOL;

}

function arkb_get_admin_head_code() {

	$output_code = '';

	$output_code .= '<style>' . \Arkhe_Blocks\Style::get_toolbar_styles() . '</style>' . PHP_EOL;

	// 管理メニュー用CSS
	$output_code .= '<style>.toplevel_page_arkhe_blocks_settings .wp-menu-image img {' .
		'width: 20px; height: 20px; padding-top: 6px!important;' .
	'}</style>' . PHP_EOL;

	// ここからはブロックエディターのみ。
	$is_block_editor = get_current_screen()->is_block_editor();
	if ( $is_block_editor ) $output_code;

	// さらに、Arkheテーマでのみ追加する処理
	if ( ! class_exists( 'Arkhe' ) ) return $output_code;

	global $post_id; // 新規追加時は null
	global $post_type;
	$front_id      = (int) get_option( 'page_on_front' );
	$page_template = basename( get_page_template_slug() ) ?: '';

	if ( false !== strpos( $page_template, 'one-column' ) ) {
		$show_sidebar = 'off';
	} elseif ( 'two-column.php' === $page_template ) {
		$show_sidebar = 'on';
	} else {
		// デフォルトテンプレート時
		if ( $front_id === $post_id ) {
			$side_key = 'show_sidebar_top';
		} elseif ( 'page' === $post_type ) {
			$side_key = 'show_sidebar_page';
		} else {
			$side_key = 'show_sidebar_post';
		}
		$show_sidebar = \Arkhe::get_setting( $side_key ) ? 'on' : 'off';
	}

	// エディター側の<html>に[data-sidebar]を付与( 投稿リストブロック用 )
	$output_code .= '<script>document.documentElement.setAttribute("data-sidebar", "' . $show_sidebar . '");</script>' . PHP_EOL;

	return $output_code;
}


function arkb_get_searchable_blocks() {
	// 初期表示するブロック
	$show_default_blocks = [
		'core/cover',
		'core/gallery',
		'core/image',
		'core/button',
		'core/columns',
		'core/group',
		'core/heading',
		'core/list',
		'core/media-text',
		'core/paragraph',
		'core/pullquote',
		'core/quote',
		'core/table',
		'core/video',
		'arkhe-blocks/accordion',
		'arkhe-blocks/button',
		// 'arkhe-blocks/buttons',
		// 'arkhe-blocks/column',
		'arkhe-blocks/columns',
		'arkhe-blocks/container',
		'arkhe-blocks/faq',
		'arkhe-blocks/dl',
		'arkhe-blocks/notice',
		'arkhe-blocks/section-heading',
		'arkhe-blocks/step',
		'arkhe-blocks/tab',
		'arkhe-blocks/timeline',
		'arkhe-blocks/box-links',
		'arkhe-blocks/section',
		'arkhe-blocks/blog-card',
		'arkhe-blocks/slider',
		'arkhe-blocks/page-list',
		'arkhe-blocks/post-list',
	];

	// ブロック設定ページで検索可能なブロック
	$searchable_blocks_all  = [];
	$searchable_blocks_main = [];

	// 登録済みブロックを全取得
	$block_registry = \WP_Block_Type_Registry::get_instance();

	foreach ( $block_registry->get_all_registered() as $block_name => $block_type ) {
		// if ( str_contains( $block_name, 'core/' ) ) {}
		if ( in_array( $block_name, $show_default_blocks, true ) ) {
			$searchable_blocks_main[] = [
				'name'  => $block_name,
				'title' => $block_type->title,
			];
		}

		$searchable_blocks_all[] = [
			'name'  => $block_name,
			'title' => $block_type->title,
		];
	}

	return [
		'all'  => $searchable_blocks_all, // 全部
		'main' => $searchable_blocks_main, // 初期リストに表示するブロック
	];
}
