<?php
namespace Arkhe_Blocks\Render_Block;

defined( 'ABSPATH' ) || exit;

// tab
add_filter( 'render_block_arkhe-blocks/tab', __NAMESPACE__ . '\render_tab' );
function render_tab( $block_content ) {
	\Arkhe_Blocks::$use['tab'] = true;

	// memo: 古いデータを置換。いずれ消す
	$block_content = str_replace( ' data-onclick="tabControl"', '', $block_content );

	// remove_filter( 'render_block_arkhe-blocks/tab', __NAMESPACE__ . '\render_tab' );
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



/**
 * リッチカラムのスクロールヒント
 */
add_filter( 'render_block_arkhe-blocks/columns', __NAMESPACE__ . '\add_columns_scroll_hint', 10, 2 );
function add_columns_scroll_hint( $block_content, $block ) {
	$isScrollable = $block['attrs']['isScrollable'] ?? false;
	if ( $isScrollable ) {
		$hook  = '<div class="ark-block-columns__inner';
		$arrow = '<svg class="arkb-scrollHint__svg" width="1em" height="1em" viewBox="0 0 32 32" role="img" focusable="false" >' .
				'<path d="M30.4,15.5l-4.5-4.5l-1.1,1.1l3.4,3.4H1.6v1.6h28.8V15.5z" /></svg>';
		$hint  = apply_filters(
			'arkb_scroll_hint',
			'<div class="arkb-scrollHint"><span class="arkb-scrollHint__text">' . __( 'Scrollable', 'arkhe-blocks' ) . $arrow . '</span></div>'
		);

		$block_content = str_replace( $hook, $hint . $hook, $block_content );
	}
	return $block_content;
}


/**
 * CSS変数名の後方互換
 */
add_filter( 'render_block_arkhe-blocks/columns', __NAMESPACE__ . '\replace_columns_css_prop', 10, 2 );
function replace_columns_css_prop( $block_content, $block ) {
	$block_content = str_replace( '--arkb-fb_pc:', '--arkb-clmn-w--pc:', $block_content );
	$block_content = str_replace( '--arkb-fb_tab:', '--arkb-clmn-w--tab:', $block_content );
	$block_content = str_replace( '--arkb-fb:', '--arkb-clmn-w--mobile:', $block_content );
	$block_content = str_replace( '--arkb-clmn-mrgn--x:', '--arkb-gap--x:', $block_content );
	$block_content = str_replace( '--arkb-clmn-mrgn--bttm:', '--arkb-gap--y:', $block_content );
	return $block_content;
}

add_filter( 'render_block_arkhe-blocks/box-links', __NAMESPACE__ . '\replace_box_links_css_prop', 10, 2 );
function replace_box_links_css_prop( $block_content, $block ) {
	$block_content = str_replace( '--arkb-fb_pc:', '--arkb-box-w--pc:', $block_content );
	$block_content = str_replace( '--arkb-fb_tab:', '--arkb-box-w--tab:', $block_content );
	$block_content = str_replace( '--arkb-fb:', '--arkb-box-w--mb:', $block_content );
	return $block_content;
}
