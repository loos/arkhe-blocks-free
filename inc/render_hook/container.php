<?php
namespace Arkhe_Blocks\Render_Hook;

use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;


/**
 * コンテナ処理
 */
add_filter( 'render_block_arkhe-blocks/container', __NAMESPACE__ . '\render_container_block', 10, 2 );
function render_container_block( $block_content, $block ) {
	$the_styles = [];
	$attrs      = $block['attrs'] ?? [];
	$layout     = $attrs['layout'] ?? [];
	$gap        = $attrs['gap'] ?? null;
	$padding    = $attrs['padding'] ?? null;

	// layout
	$layout_type = $layout['type'] ?? '';
	if ( 'flex' === $layout_type ) {
		$the_styles = Style::add_the_layout_styles( $the_styles, $layout );
	}

	// gap
	if ( ! empty( $gap ) ) {
		$the_styles['all']['--arkb-gap'] = $gap['x'] ?? '';
		// $the_styles = Style::add_the_gap_styles( $the_styles, $gap );
	}

	if ( $padding ) {
		$the_styles['all']['--arkb-padding'] = Style::get_custom_padding( $padding, '0' );
	}

	// 動的スタイルの処理
	$unique_id = Style::sort_dynamic_block_styles( 'arkb-container--', $the_styles );
	if ( $unique_id ) {
		$block_content = preg_replace( '/class=\"/', 'class="' . esc_attr( $unique_id ) . ' ', $block_content, 1 );
	}

	return $block_content;
}
