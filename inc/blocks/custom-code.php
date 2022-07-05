<?php
namespace Arkhe_Blocks\Block\Custom_Code;

use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata( ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/custom-code', [
	'render_callback'  => __NAMESPACE__ . '\cb',
] );

function cb( $attrs, $content ) {
	$variation = $attrs['variation'] ?? '';
	$code      = $attrs['content'] ?? null;
	if ( 'css' === $variation ) {
		Style::add_dynamic_styles( $code );
		return '';
	} elseif ( 'javascript' === $variation ) {
		return '<script>' . $content . '</script>';
	} else {
		return $content;
	}
}
