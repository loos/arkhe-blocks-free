<?php
namespace Arkhe_Blocks\Enqueue;

defined( 'ABSPATH' ) || exit;

use \Arkhe_Blocks\Style as Style;

/**
 * フロントで読み込むファイル
 */
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\hook_wp_enqueue_scripts' );
function hook_wp_enqueue_scripts() {

	$deps = IS_ARKHE_THEME ? [ 'arkhe-main-style' ] : [];
	wp_enqueue_style( 'arkhe-blocks-front', ARKHE_BLOCKS_URL . 'dist/css/front.css', $deps, \Arkhe_Blocks::$file_ver );

	// カスタム系のCSS
	$custom_css = Style::get_custom_styles();
	if ( $custom_css ) {
		wp_add_inline_style( 'arkhe-blocks-front', $custom_css );
	}
}


/**
 * フロントで読み込むファイル (at footer)
 */
add_action( 'wp_footer', __NAMESPACE__ . '\hook_enqueue_footer', 1 );
function hook_enqueue_footer() {

	if ( \Arkhe_Blocks::is_use( 'linkbox' ) ) {
		wp_enqueue_script( 'arkhe-blocks-linkbox', ARKHE_BLOCKS_URL . 'dist/js/linkbox.min.js', [], \Arkhe_Blocks::$file_ver, true );
	}

	if ( \Arkhe_Blocks::is_use( 'ol_start' ) ) {
		wp_enqueue_script( 'arkhe-blocks-ol_start', ARKHE_BLOCKS_URL . 'dist/js/ol_start.min.js', [], \Arkhe_Blocks::$file_ver, true );
	}

	// swiper
	if ( \Arkhe_Blocks::is_use( 'slider--swiper' ) ) {
		wp_enqueue_style( 'arkhe-blocks-swiper', ARKHE_BLOCKS_URL . 'assets/css/swiper.min.css', [], \Arkhe_Blocks::$file_ver );
		wp_enqueue_script( 'arkhe-blocks-swiper', ARKHE_BLOCKS_URL . 'assets/js/swiper.min.js', [], \Arkhe_Blocks::$file_ver, true );
		wp_enqueue_script( 'arkhe-blocks-slider-swiper', ARKHE_BLOCKS_URL . 'dist/gutenberg/blocks/slider/script.js', [ 'arkhe-blocks-swiper' ], \Arkhe_Blocks::$file_ver, true );
	}

	// memo: ハンドル名は一応block.jsonでの自動読み込み時と同じにしてる
	if ( \Arkhe_Blocks::is_use( 'tab' ) ) {
		wp_enqueue_script( 'arkhe-blocks-tab-script', ARKHE_BLOCKS_URL . 'dist/gutenberg/blocks/tab/script.js', [], \Arkhe_Blocks::$file_ver, true );
	}
	if ( \Arkhe_Blocks::is_use( 'accordion' ) ) {
		wp_enqueue_script( 'arkhe-blocks-accordion-script', ARKHE_BLOCKS_URL . 'dist/gutenberg/blocks/accordion/script.js', [], \Arkhe_Blocks::$file_ver, true );
	}
	// 目次生成にJSを使うか
	if ( 'js' === \Arkhe_Blocks::get_data( 'block', 'toc_script' ) || \Arkhe_Blocks::is_use( 'toc' ) && false === wp_cache_get( 'toc', 'arkb' ) ) {
		wp_enqueue_script( 'arkhe-blocks-toc-script', ARKHE_BLOCKS_URL . 'dist/gutenberg/blocks/toc/script.js', [], \Arkhe_Blocks::$file_ver, true );
		wp_localize_script( 'arkhe-blocks-toc-script', 'arkbTocVars', [
			'ignoreClasses'  => apply_filters( 'arkb_toc__ignore_classes', [ 'arkb-toc-off', 'p-postList__title' ] ),
			'target'         => \Arkhe_Blocks::get_data( 'block', 'toc_target' ),
			'threshold'      => \Arkhe_Blocks::get_data( 'block', 'toc_threshold' ),
		] );
	}
}
