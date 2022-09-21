<?php
namespace Arkhe_Blocks\Setup;

defined( 'ABSPATH' ) || exit;

add_action( 'init', function() {
	if ( ! class_exists( 'Arkhe' ) ) return;
	\Arkhe::set_plugin_data( 'use_arkhe_blocks', true );
} );


add_action( 'after_setup_theme', function() {
	// Arkhe用
	if ( \Arkhe_Blocks::get_data( 'general', 'use_fse_blocks' ) ) {
		add_filter( 'arkhe_use_fse_blocks', '__return_true' );
	}
	if ( \Arkhe_Blocks::get_data( 'general', 'use_core_patterns' ) ) {
		add_theme_support( 'core-block-patterns' );
	}

	// Arkhe以外用
	if ( \Arkhe_Blocks::get_data( 'general', 'use_custom_space' ) ) {
		add_theme_support( 'custom-spacing' );
	}

	$color_palette = arkb_get_palette_colors();
	if ( ! empty( $color_palette ) ) {
		add_theme_support( 'editor-color-palette', $color_palette );
	}
}, 20 );


/**
 * カラーパレットを取得
 */
function arkb_get_palette_colors() {
	$color_palette = [];

	// カラーパレット設定を取得
	$custom_palette_colors = \Arkhe_Blocks::get_data( 'general', 'palette_colors' );
	if ( is_array( $custom_palette_colors ) ) {
		foreach ( $custom_palette_colors as $data ) {
			if ( ! is_array( $data ) ) continue;

			// カラー、表示名、スラッグのいずれかが空の場合はスキップ
			if ( empty( $data['color'] ) || empty( $data['name'] ) || empty( $data['slug'] ) ) continue;

			$color_palette[] = [
				'color' => $data['color'],
				'name'  => $data['name'],
				'slug'  => 'arkb-' . $data['slug'],
			];
		}
	}

	// テーマのカラーパレットとマージ
	$theme_palette = get_theme_support( 'editor-color-palette' );

	if ( is_array( $theme_palette ) ) {
		$color_palette = array_merge( $theme_palette[0], $color_palette );
	}

	return $color_palette;
}
