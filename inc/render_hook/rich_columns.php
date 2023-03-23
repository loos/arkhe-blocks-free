<?php
namespace Arkhe_Blocks\Render_Hook;

use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;

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


/**
 * リッチカラムのスクロールヒント
 */
add_filter( 'render_block_arkhe-blocks/columns', __NAMESPACE__ . '\add_columns_scroll_hint', 10, 2 );
function add_columns_scroll_hint( $block_content, $block ) {
	$isScrollable = $block['attrs']['isScrollable'] ?? false;
	if ( $isScrollable ) {
		$hook          = '<div class="ark-block-columns__inner';
		$hint          = \Arkhe_Blocks::get_scroll_hint( 'columns' );
		$block_content = str_replace( $hook, $hint . $hook, $block_content );
	}
	return $block_content;
}


/**
 * リッチカラム(親)のstyle
 */
add_filter( 'render_block_arkhe-blocks/columns', __NAMESPACE__ . '\render_columns_styles', 10, 2 );
function render_columns_styles( $block_content, $block ) {

	$the_styles = [];
	$attrs      = $block['attrs'];

	// 列数
	$isScrollable = $attrs['isScrollable'] ?? false;
	if ( $isScrollable ) {
		$width = $attrs['columnWidth'] ?? null;
	} else {
		$width           = $attrs['columnCount'] ?? null;
		$width['pc']     = Style::get_column_width( $width['pc'] ?? '' );
		$width['tab']    = Style::get_column_width( $width['tab'] ?? '' );
		$width['mobile'] = Style::get_column_width( $width['mobile'] ?? '' );
	}
	$the_styles['all']['--arkb-clmn-w--pc']  = $width['pc'] ?? '';
	$the_styles['all']['--arkb-clmn-w--tab'] = $width['tab'] ?? '';
	$the_styles['all']['--arkb-clmn-w--mb']  = $width['mobile'] ?? '';

	// gap
	$gap    = $attrs['gap'] ?? null;
	$gapTab = $attrs['gapTab'] ?? null;
	$gapMB  = $attrs['gapMB'] ?? null;

	if ( ! empty( $gap ) ) {
		$the_styles['all']['--arkb-gap--x'] = $gap['x'] ?? '';
		$the_styles['all']['--arkb-gap--y'] = $gap['y'] ?? '';
	}
	if ( ! empty( $gapTab ) ) {
		$the_styles['sp']['--arkb-gap--x'] = $gapTab['x'] ?? '';
		$the_styles['sp']['--arkb-gap--y'] = $gapTab['y'] ?? '';
	}
	if ( ! empty( $gapMB ) ) {
		$the_styles['mb']['--arkb-gap--x'] = $gapMB['x'] ?? '';
		$the_styles['mb']['--arkb-gap--y'] = $gapMB['y'] ?? '';
	}

	// 余白
	$padding = $attrs['padding'] ?? null;
	if ( $padding ) {
		$the_styles['all']['--arkb-padding'] = Style::get_custom_padding( $padding, 'var(--arkb-padding--default)' );
	}
	$paddingTab = $attrs['paddingTab'] ?? null;
	if ( $paddingTab ) {
		$the_styles['sp']['--arkb-padding'] = Style::get_custom_padding( $paddingTab, 'var(--arkb-padding--default)' );
	}
	$paddingMB = $attrs['paddingMB'] ?? null;
	if ( $paddingMB ) {
		$the_styles['mb']['--arkb-padding'] = Style::get_custom_padding( $paddingMB, 'var(--arkb-padding--default)' );
	}

	// 動的スタイルの処理
	$unique_id = Style::generate_dynamic_block_styles( $the_styles, [ 'prefix' => 'arkb-columns--' ] );
	if ( $unique_id ) {
		$block_content = preg_replace( '/class=\"/', 'class="' . esc_attr( $unique_id ) . ' ', $block_content, 1 );
	}

	return $block_content;
}


/**
 * リッチカラム(子)のstyle
 */
add_filter( 'render_block_arkhe-blocks/column', __NAMESPACE__ . '\render_column_child_styles', 10, 2 );
function render_column_child_styles( $block_content, $block ) {

	$the_styles = [];
	$attrs      = $block['attrs'];

	// linkbox使うかどうか
	if ( ! \Arkhe_Blocks::is_use( 'linkbox' ) && str_contains( $block_content, 'data-arkb-linkbox' ) ) {
		\Arkhe_Blocks::$use['linkbox'] = true;
	}

	// 余白
	$padding = $attrs['padding'] ?? null;
	if ( $padding ) {
		$the_styles['all']['--arkb-padding'] = Style::get_custom_padding( $padding, 'var(--arkb-padding--default)' );
	}
	$paddingTab = $attrs['paddingTab'] ?? null;
	if ( $paddingTab ) {
		$the_styles['sp']['--arkb-padding'] = Style::get_custom_padding( $paddingTab, 'var(--arkb-padding--default)' );
	}
	$paddingMB = $attrs['paddingMB'] ?? null;
	if ( $paddingMB ) {
		$the_styles['mb']['--arkb-padding'] = Style::get_custom_padding( $paddingMB, 'var(--arkb-padding--default)' );
	}

	// 幅
	$width = $attrs['columnWidth'] ?? null;
	if ( ! empty( $width ) ) {
		$the_styles['all']['--arkb-clmn-w--pc']  = $width['pc'] ?? '';
		$the_styles['all']['--arkb-clmn-w--tab'] = $width['tab'] ?? '';
		$the_styles['all']['--arkb-clmn-w--mb']  = $width['mobile'] ?? '';
	}

	if ( empty( $the_styles ) ) {
		return $block_content;
	}

	// 動的スタイルの処理
	$unique_id = Style::generate_dynamic_block_styles( $the_styles, [
		'prefix' => 'arkb-column--',
		'with'   => '.ark-block-column',
	] );
	if ( $unique_id ) {
		$block_content = preg_replace( '/class=\"/', 'class="' . esc_attr( $unique_id ) . ' ', $block_content, 1 );
	}

	return $block_content;
}
