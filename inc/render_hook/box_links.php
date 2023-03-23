<?php
namespace Arkhe_Blocks\Render_Hook;

use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;


/**
 * リッチカラム(親)のstyle
 */
add_filter( 'render_block_arkhe-blocks/box-links', __NAMESPACE__ . '\render_box_links_styles', 10, 2 );
function render_box_links_styles( $block_content, $block ) {

	$the_styles = [];
	$attrs      = $block['attrs'];

	// 列数
	$columnCount = $attrs['columnCount'] ?? null;
	if ( $columnCount ) {
		$box_width_all = Style::get_column_width( $columnCount['pc'] ?? '' ) ?: '50%';
		$box_width_sp  = Style::get_column_width( $columnCount['tab'] ?? '' ) ?: '50%';
		$box_width_mb  = Style::get_column_width( $columnCount['mobile'] ?? '' ) ?: '100%';
	} else {
		$box_width_all = Style::get_column_width( $attrs['colPC'] ?? '' ) ?: '50%';
		$box_width_sp  = Style::get_column_width( $attrs['colTab'] ?? '' ) ?: '50%';
		$box_width_mb  = Style::get_column_width( $attrs['colMobile'] ?? '' ) ?: '100%';
	}
	$the_styles['all']['--arkb-box-width'] = $box_width_all;
	$the_styles['sp']['--arkb-box-width']  = $box_width_sp;
	$the_styles['mb']['--arkb-box-width']  = $box_width_mb;

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

	// 動的スタイルの処理
	$unique_id = Style::generate_dynamic_block_styles( $the_styles, [ 'prefix' => 'arkb-boxlinks--' ] );
	if ( $unique_id ) {
		$block_content = preg_replace( '/class=\"/', 'class="' . esc_attr( $unique_id ) . ' ', $block_content, 1 );
	}

	return $block_content;
}
