<?php
namespace Arkhe_Blocks\Block\Custom_Code;

use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata( ARKHE_BLOCKS_PATH . 'dist/gutenberg/blocks/custom-code', [
	'render_callback'  => __NAMESPACE__ . '\cb',
] );

function cb( $attrs, $content ) {
	$variation = $attrs['variation'] ?? '';
	$css       = $attrs['content'] ?? null;
	$script    = $attrs['script'] ?? $content ?: '';
	if ( 'css' === $variation ) {
		Style::add_dynamic_styles( $css );
		return '';
	} elseif ( 'javascript' === $variation ) {
		return '<script>' . $script . '</script>';
	} else {
		return $content;
	}
}
