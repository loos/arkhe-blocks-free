<?php
namespace Arkhe_Blocks\Render_Block;

defined( 'ABSPATH' ) || exit;


require_once __DIR__ . '/render_hook/container.php';
require_once __DIR__ . '/render_hook/button.php';
require_once __DIR__ . '/render_hook/box_links.php';
require_once __DIR__ . '/render_hook/rich_columns.php';

// tab ブロック
add_filter( 'render_block_arkhe-blocks/tab', __NAMESPACE__ . '\render_tab' );
function render_tab( $block_content ) {
	// JSの呼び出し
	\Arkhe_Blocks::$use['tab'] = true;
	// remove_filter( 'render_block_arkhe-blocks/tab', __NAMESPACE__ . '\render_tab' );

	// memo: 古いデータを置換。いずれ消す
	$block_content = str_replace( ' data-onclick="tabControl"', '', $block_content );

	return $block_content;
}

// accordion
add_filter( 'render_block_arkhe-blocks/accordion', __NAMESPACE__ . '\render_accordion' );
function render_accordion( $block_content ) {
	\Arkhe_Blocks::$use['accordion'] = true;
	remove_filter( 'render_block_arkhe-blocks/accordion', __NAMESPACE__ . '\render_accordion' );
	return $block_content;
}


// linkbox
add_filter( 'render_block_arkhe-blocks/blog-card', __NAMESPACE__ . '\render_linkbox' );
add_filter( 'render_block_arkhe-blocks/box-links', __NAMESPACE__ . '\render_linkbox' );
function render_linkbox( $block_content ) {
	\Arkhe_Blocks::$use['linkbox'] = true;
	remove_filter( 'render_block_arkhe-blocks/blog-card', __NAMESPACE__ . '\render_linkbox' );
	remove_filter( 'render_block_arkhe-blocks/box-links', __NAMESPACE__ . '\render_linkbox' );
	return $block_content;
}


// list
add_filter( 'render_block_core/list', __NAMESPACE__ . '\render_core_list', 10, 2 );
function render_core_list( $block_content, $block ) {
	if ( isset( $block['attrs']['start'] ) ) {
		\Arkhe_Blocks::$use['ol_start'] = true;
		remove_filter( 'render_block_core/list', __NAMESPACE__ . '\render_core_list', 10 );
	}
	return $block_content;
}


// svgの属性値がsaveでおかしくなるバグへの対応
add_filter( 'render_block_arkhe-blocks/notice', __NAMESPACE__ . '\render_fix_svg_props', 10, 2 );
add_filter( 'render_block_arkhe-blocks/timeline-item', __NAMESPACE__ . '\render_fix_svg_props', 10, 2 );
add_filter( 'render_block_arkhe-blocks/box-link', __NAMESPACE__ . '\render_fix_svg_props', 10, 2 );
function render_fix_svg_props( $block_content, $block ) {
	$block_content = str_replace( 'strokewidth=', 'stroke-width=', $block_content );
	$block_content = str_replace( 'strokelinecap=', 'stroke-linecap=', $block_content );
	$block_content = str_replace( 'strokelinejoin=', 'stroke-linejoin=', $block_content );
	return $block_content;
}


// CSS変数名の後方互換
add_filter( 'render_block_arkhe-blocks/step-item', __NAMESPACE__ . '\render_step__change_css_name', 10, 2 );
function render_step__change_css_name( $block_content, $block ) {
	$block_content = str_replace( '--ark-step_color', '--arkb-step-color', $block_content );
	return $block_content;
}
