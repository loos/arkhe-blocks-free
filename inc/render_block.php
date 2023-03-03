<?php
namespace Arkhe_Blocks\Render_Block;

defined( 'ABSPATH' ) || exit;


require_once __DIR__ . '/render_hook/container.php';
require_once __DIR__ . '/render_hook/button.php';
require_once __DIR__ . '/render_hook/box_links.php';
require_once __DIR__ . '/render_hook/rich_columns.php';

// tab ブロック
add_filter( 'render_block_arkhe-blocks/tab', __NAMESPACE__ . '\render_tab', 10, 2 );
function render_tab( $block_content, $block ) {
	// JSの呼び出し用フラグをセット
	\Arkhe_Blocks::$use['tab'] = true;
	// remove_filter( 'render_block_arkhe-blocks/tab', __NAMESPACE__ . '\render_tab' );

	$attrs = $block['attrs'] ?? [];

	// スクロールヒント表示
	$isScrollPC = $attrs['isScrollPC'] ?? false;
	$isScrollSP = $attrs['isScrollSP'] ?? false;
	if ( $isScrollPC || $isScrollSP ) {
		$scroll_hint   = \Arkhe_Blocks::get_scroll_hint( 'tab' );
		$block_content = str_replace( '<ul role="tablist"', $scroll_hint . '<ul role="tablist"', $block_content );
	}

	// 旧 data-tab-width を置換
	$tabWidth = $attrs['tabWidth'] ?? '';
	if ( $tabWidth ) {
		$block_content = str_replace(
			'data-tab-width="' . $tabWidth . '"',
			'data-tab-w-pc="' . $tabWidth . '" data-tab-w-sp="' . $tabWidth . '"',
			$block_content
		);
	}

	// memo: 古いデータを置換。いずれ消す
	$block_content = str_replace( ' data-onclick="tabControl"', '', $block_content );

	return $block_content;
}

// accordion
// add_filter( 'render_block_arkhe-blocks/accordion', __NAMESPACE__ . '\render_accordion', 10, 2 );
// function render_accordion( $block_content, $block ) {
// 	\Arkhe_Blocks::$use['accordion'] = true;
// 	remove_filter( 'render_block_arkhe-blocks/accordion', __NAMESPACE__ . '\render_accordion' );
// 	return $block_content;
// }

add_filter( 'render_block_arkhe-blocks/accordion-item', __NAMESPACE__ . '\render_accordion_item', 10, 2 );
function render_accordion_item( $block_content, $block ) {

	// 旧DOMかどうかの判定 memo: 親ブロックはクラスとか自由に付けれるので一応 summary でチェック
	if ( ! str_contains( $block_content, '<summary class="ark-block-accordion__title' ) ) {

		// 旧アコーディオン用スクリプトを読み込む
		\Arkhe_Blocks::$use['old_accordion'] = true;

		// 旧attributesデータで三角アイコンが指定されているかどうか
		$attrs        = $block['attrs'] ?? [];
		$isDefultOpen = $attrs['isDefultOpen'] ?? false;
		$opened_class = $isDefultOpen ? ' is-opened' : '';

		$iconOpened    = $attrs['iconOpened'] ?? '';
		$icon_type     = 'arkb-svg-drop_up' === $iconOpened ? 'triangle' : 'plus';
		$block_content = str_replace(
			'<div class="ark-block-accordion__item',
			'<div data-icon-type="' . $icon_type . '" class="ark-block-accordion__item' . $opened_class,
			$block_content
		);
	} elseif ( ! \Arkhe_Blocks::is_use( 'accordion' ) ) {
		\Arkhe_Blocks::$use['accordion'] = true;
	}

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
	$ordered = $block['attrs']['ordered'] ?? false;
	if ( $ordered || isset( $block['attrs']['start'] ) ) {
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
