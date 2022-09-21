<?php
namespace Arkhe_Blocks\Output;

use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;

/**
 * ダイナミックCSS出力
 */
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


/**
 * <noscript>
 */
add_action( 'wp_footer', __NAMESPACE__ . '\print_footer_scripts', 20 );
function print_footer_scripts() {
	$output_code = '<noscript><style>' .
		'[data-arkb-linkbox]{cursor:auto}' .
		'[data-arkb-link][aria-hidden="true"]{visibility:visible;color:transparent;z-index:0;width:100%;height:100%;pointer-events:auto}' .
		'a.arkb-boxLink__title{text-decoration:underline}' .
	'</style></noscript>' . PHP_EOL;

	echo PHP_EOL . '<!-- Arkhe Blocks -->' . PHP_EOL;
	echo $output_code; // phpcs:ignore
	echo '<!-- / Arkhe Blocks -->' . PHP_EOL;
}
