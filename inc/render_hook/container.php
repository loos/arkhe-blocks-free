<?php
namespace Arkhe_Blocks\Render_Hook;

use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;


/**
 * コンテナ処理
 */
add_filter( 'render_block_arkhe-blocks/container', __NAMESPACE__ . '\render_container_block', 10, 2 );
function render_container_block( $block_content, $block ) {
	$theStyles     = [];
	$attrs         = $block['attrs'] ?? [];
	$layout        = $attrs['layout'] ?? [];
	$gap           = $attrs['gap'] ?? null;
	$hasInner      = $attrs['hasInner'] ?? false;
	$hasInnerSpace = $attrs['hasInnerSpace'] ?? true;
	$version       = $attrs['version'] ?? '1';

	if ( '1' === $version ) {
		$block_content = preg_replace( '/class=/', 'data-ver="1" class=', $block_content, 1 );
	}

	// layout
	$layout_type = $layout['type'] ?? '';
	if ( 'flex' === $layout_type ) {
		$theStyles = Style::add_the_layout_styles( $theStyles, $layout );
	}

	// gap
	if ( ! empty( $gap ) ) {
		$theStyles['all']['--arkb-gap'] = $gap['x'] ?? '';
		// $theStyles = Style::add_the_gap_styles( $theStyles, $gap );
	}

	// 余白スタイル
	$spaceStyles = [];

	// padding
	$padding    = $attrs['padding'] ?? null;
	$paddingTAB = $attrs['paddingTAB'] ?? null;
	$paddingMB  = $attrs['paddingMB'] ?? null;
	if ( $padding ) {
		$spaceStyles['all']['--arkb-padding'] = Style::get_custom_padding( $padding, '0' );
	}
	if ( $paddingTAB ) {
		$spaceStyles['sp']['--arkb-padding'] = Style::get_custom_padding( $paddingTAB, '' );
	}
	if ( $paddingMB ) {
		$spaceStyles['mb']['--arkb-padding'] = Style::get_custom_padding( $paddingMB, '' );
	}

	// margin
	$margin    = $attrs['margin'] ?? null;
	$marginTAB = $attrs['marginTAB'] ?? null;
	$marginMB  = $attrs['marginMB'] ?? null;
	if ( $margin ) {
		if ( isset( $margin['top'] ) ) $spaceStyles['all']['--arkb-margin--top']       = $margin['top'];
		if ( isset( $margin['left'] ) ) $spaceStyles['all']['--arkb-margin--left']     = $margin['left'];
		if ( isset( $margin['right'] ) ) $spaceStyles['all']['--arkb-margin--right']   = $margin['right'];
		if ( isset( $margin['bottom'] ) ) $spaceStyles['all']['--arkb-margin--bottom'] = $margin['bottom'];
	}
	if ( $marginTAB ) {
		if ( isset( $marginTAB['top'] ) ) $spaceStyles['sp']['--arkb-margin--top']       = $marginTAB['top'];
		if ( isset( $marginTAB['left'] ) ) $spaceStyles['sp']['--arkb-margin--left']     = $marginTAB['left'];
		if ( isset( $marginTAB['right'] ) ) $spaceStyles['sp']['--arkb-margin--right']   = $marginTAB['right'];
		if ( isset( $marginTAB['bottom'] ) ) $spaceStyles['sp']['--arkb-margin--bottom'] = $marginTAB['bottom'];
	}
	if ( $marginMB ) {
		if ( isset( $marginMB['top'] ) ) $spaceStyles['mb']['--arkb-margin--top']       = $marginMB['top'];
		if ( isset( $marginMB['left'] ) ) $spaceStyles['mb']['--arkb-margin--left']     = $marginMB['left'];
		if ( isset( $marginMB['right'] ) ) $spaceStyles['mb']['--arkb-margin--right']   = $marginMB['right'];
		if ( isset( $marginMB['bottom'] ) ) $spaceStyles['mb']['--arkb-margin--bottom'] = $marginMB['bottom'];
	}

	// 動的スタイルの処理
	$unique_id = Style::generate_dynamic_block_styles( $theStyles, [ 'prefix' => 'arkb-container--' ] );

	// 余白スタイルは inner に適用するかどうかで切り変える
	if ( $hasInner && $hasInnerSpace ) {
		$unique_id = Style::generate_dynamic_block_styles( $spaceStyles, [
			'unique_id' => $unique_id,
			'prefix'    => 'arkb-container--',
			'after'     => ' > .ark-block-container__inner',
		] );
	} else {
		$unique_id = Style::generate_dynamic_block_styles( $spaceStyles, [
			'unique_id' => $unique_id,
			'prefix'    => 'arkb-container--',
		] );
	}

	if ( $unique_id ) {
		$block_content = preg_replace( '/class=\"/', 'class="' . esc_attr( $unique_id ) . ' ', $block_content, 1 );
	}

	return $block_content;
}
