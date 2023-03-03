<?php
namespace Arkhe_Blocks\Enqueue;

defined( 'ABSPATH' ) || exit;

use \Arkhe_Blocks\Style as Style;


/**
 * Gutenberg用ファイル
 */
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\hook_enqueue_block_editor_assets', 20 );
function hook_enqueue_block_editor_assets( $hook_suffix ) {

	$dist_url = ARKHE_BLOCKS_URL . 'dist/';

	// ブロック用CSS
	$deps = IS_ARKHE_THEME ? [ 'arkhe-editor' ] : [];
	wp_enqueue_style( 'arkhe-blocks-editor', $dist_url . 'css/blocks.css', $deps, \Arkhe_Blocks::$file_ver );

	// カスタム系のCSS
	$custom_css = Style::get_custom_styles();
	if ( $custom_css ) {
		// ユーザー入力があるので esc_ しておく。
		wp_add_inline_style( 'arkhe-blocks-editor', $custom_css );
	}

	// その他設定によって追加されるエディター用のCSS
	$ex_edtitor_css = Style::get_ex_editor_styles();
	if ( $ex_edtitor_css ) {
		wp_add_inline_style( 'arkhe-blocks-editor', $ex_edtitor_css );
	}

	// 基本スクリプト
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/index.asset.php';
	wp_enqueue_script( 'arkhe-blocks-editor', $dist_url . 'gutenberg/index.js', $asset['dependencies'], $asset['version'], true );

	wp_localize_script( 'arkhe-blocks-editor', 'arkbBlockVars', arkb_get_block_vars() );

	// アイコン
	$icon_deps = [ 'wp-element' ];
	wp_enqueue_script( 'arkhe-blocks-icon-ls', $dist_url . 'icons/index.js', $icon_deps, \Arkhe_Blocks::$file_ver, true );
	wp_enqueue_script( 'arkhe-blocks-icon-ph', $dist_url . 'icons/ph/index.js', $icon_deps, \Arkhe_Blocks::$file_ver, true );
	wp_enqueue_script( 'arkhe-blocks-icon-fi', $dist_url . 'icons/fi/index.js', $icon_deps, \Arkhe_Blocks::$file_ver, true );
	wp_enqueue_script( 'arkhe-blocks-icon-io', $dist_url . 'icons/io/index.js', $icon_deps, \Arkhe_Blocks::$file_ver, true );
	wp_enqueue_script( 'arkhe-blocks-icon-fa', $dist_url . 'icons/fa/index.js', $icon_deps, \Arkhe_Blocks::$file_ver, true );

	// コアブロックの拡張
	if ( ! \Arkhe_Blocks::get_data( 'general', 'disable_ex_core' ) ) {
		$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/ex_core.asset.php';
		wp_enqueue_script( 'arkhe-blocks-ex-core', $dist_url . 'gutenberg/ex_core.js', $asset['dependencies'], $asset['version'], true );
	}

	// 書式フォーマットの拡張
	if ( ! \Arkhe_Blocks::get_data( 'general', 'disable_format' ) ) {
		$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/format.asset.php';
		wp_enqueue_script( 'arkhe-blocks-format', $dist_url . 'gutenberg/format.js', $asset['dependencies'], $asset['version'], true );
	}

	// 無料版
	if ( ! \Arkhe_Blocks::IS_PRO ) {
		wp_enqueue_style( 'arkhe-blocks-editor-free', $dist_url . 'css/blocks-free.css', $deps, \Arkhe_Blocks::$file_ver );

		$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/free.asset.php';
		wp_enqueue_script( 'arkhe-blocks-editor-free', $dist_url . 'gutenberg/free.js', $asset['dependencies'], $asset['version'], true );
	}

}


/**
 * ブロックエディターで使うグローバル変数
 * arkbBlockVars
 */
function arkb_get_block_vars() {
	$custom_formats      = [];
	$custom_code_options = [];

	if ( \Arkhe_Blocks::IS_PRO ) {
		// カスタム書式
		$formats = \Arkhe_Blocks::get_data( 'format', 'custom_formats' );
		foreach ( $formats as $data ) {
			if ( ! is_array( $data ) ) continue;

			// 表示名、スラッグのいずれかが空の場合はスキップ
			if ( empty( $data['name'] ) || empty( $data['slug'] ) ) continue;

			$custom_formats[] = [
				'name'      => 'arkhe-blocks/custom-' . $data['slug'],
				'title'     => $data['name'],
				'tagName'   => 'span',
				'className' => 'arkb-format-' . $data['slug'],
			];
		}
	}

	$callTexts = \Arkhe_Blocks::get_data( 'format', 'texts' ) ?: [];

	// Toolkit が有効な場合
	if ( defined( 'ARKHE_TOOLKIT_URL' ) ) {
		$callTexts = array_merge( [
			[
				'label'   => __( 'Line breaks only on PC', 'arkhe-blocks' ),
				'content' => '[pcbr]',
			],
			[
				'label'   => __( 'Line breaks only on SP', 'arkhe-blocks' ),
				'content' => '[spbr]',
			],
			[
				'label'   => __( 'Insert HTML', 'arkhe-blocks' ),
				'content' => '[html]ここにHTMLを入力[/html]',
			],
			// [
			// 	'label'   => __( 'Call Reusable Block', 'arkhe-blocks' ),
			// 	'content' => '[reuse_block id="0"]',
			// ],
		], $callTexts );
	}

	return [
		'assetsUrl'         => ARKHE_BLOCKS_URL . 'assets',
		'customFormats'     => apply_filters( 'arkhe_blocks_custom_formats', $custom_formats ),
		'disableHeaderLink' => \Arkhe_Blocks::get_data( 'general', 'disable_header_link' ),
		'callTexts'         => $callTexts,
		'fontFamilies'      => [
			// カスタムコードブロック フォントファミリーのバリエーション
			[
				'label'      => 'Fira Code',
				'val'        => 'Fira Code',
				'stylesheet' => ARKHE_BLOCKS_URL . 'assets/css/fonts/fira-code.css',
			],
			[
				'label'      => 'Source Code Pro',
				'val'        => 'Source Code Pro',
				'stylesheet' => ARKHE_BLOCKS_URL . 'assets/css/fonts/source-code-pro.css',
			],
			[
				'label'      => 'Ubuntu Mono',
				'val'        => 'Ubuntu Mono',
				'stylesheet' => ARKHE_BLOCKS_URL . 'assets/css/fonts/ubuntu-mono.css',
			],
			[
				'label'      => 'Anonymous Pro',
				'val'        => 'Anonymous Pro',
				'stylesheet' => ARKHE_BLOCKS_URL . 'assets/css/fonts/anonymous-pro.css',
			],
		],
	];
}
