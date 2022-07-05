<?php
namespace Arkhe_Blocks\Output;

use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;

function render_dynamic_block_styles( $html ) {
	$style = Style::get_dynamic_style_tag();
	if ( $style ) {
		$html = str_replace( '</head>', "$style\n</head>", $html );
	}
	return $html;
}

add_action( 'wp', function() {

	// headで出力するかどうか
	if ( \Arkhe_Blocks::get_data( 'general', 'dynamic_css_to_head' ) ) {
		ob_start( __NAMESPACE__ . '\render_dynamic_block_styles' );

		// memo: 何か不具合があれば 'shutdown' or 'wp_print_footer_scripts' で ob_end_flush() も試す
		// add_action('wp_print_footer_scripts', function() {ob_end_flush();});
	} else {
		add_action('wp_print_footer_scripts', function() {
			echo Style::get_dynamic_style_tag(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}, 0);
	}
} );
