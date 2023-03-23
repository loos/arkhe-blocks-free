<?php
namespace Arkhe_Blocks\Render_Hook;

use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;


/**
 * ボタン処理
 */
add_filter( 'render_block_arkhe-blocks/buttons', __NAMESPACE__ . '\render_buttons_block', 10, 2 );
function render_buttons_block( $block_content, $block ) {
	$the_styles = [];
	$attrs      = $block['attrs'] ?? [];

	// layout
	$layout        = $attrs['layout'] ?? [];
	$defaultLayout = [
		'orientation'                   => 'horizontal',
		'justifyContent'                => 'center',
		'justify-content'               => 'center',
		'align-items'                   => 'center',
		'flex-wrap'                     => 'wrap',
	];
	$the_styles    = Style::add_the_layout_styles( $the_styles, $layout, $defaultLayout );

	// gap
	$gap        = $attrs['gap'] ?? null;
	$the_styles = Style::add_the_gap_styles( $the_styles, $gap );

	// 動的スタイルの処理
	$unique_id = Style::generate_dynamic_block_styles( $the_styles, [ 'prefix' => 'arkb-buttons--' ] );
	if ( $unique_id ) {
		$block_content = preg_replace( '/class=\"/', 'class="' . esc_attr( $unique_id ) . ' ', $block_content, 1 );
	}

	return $block_content;
}

add_filter( 'render_block_arkhe-blocks/button', __NAMESPACE__ . '\render_button_block', 10, 2 );
function render_button_block( $block_content, $block ) {
	$the_styles = [];
	$attrs      = $block['attrs'] ?? [];

	$block_content = str_replace( '--arkb-btn-color:', '--arkb-btn-color--text:', $block_content );
	$block_content = str_replace( '--arkb-btn-bg:', '--arkb-btn-color--bg:', $block_content );

	// width
	$width = $attrs['width'] ?? [];
	if ( ! empty( $width['pc'] ) ) {
		$the_styles['all']['--arkb-btn-width'] = $width['pc'];
	}
	if ( ! empty( $width['tab'] ) ) {
		$the_styles['sp']['--arkb-btn-width'] = $width['tab'];
	}
	if ( ! empty( $width['mb'] ) ) {
		$the_styles['mb']['--arkb-btn-width'] = $width['mb'];
	}

	// 動的スタイルの処理
	$unique_id = Style::generate_dynamic_block_styles( $the_styles, [ 'prefix' => 'arkb-button--' ] );
	if ( $unique_id ) {
		$block_content = preg_replace( '/class=\"/', 'class="' . esc_attr( $unique_id ) . ' ', $block_content, 1 );
	}

	// html入力時
	if ( str_contains( $block_content, 'data-has-html="1"' ) ) {
		$block_content = preg_replace_callback( '/<a.*?>/', function( $matches ) {
			$atag = $matches[0];

			// if ( str_contains( $atag, 'ark-block-button__link' ) ) {
			// 	return $atag;
			// }

			// クラスの追加
			if ( str_contains( $atag, 'class=' ) ) {
				$atag = preg_replace( '/class=["\'](.*?)["\']/', '/class="ark-block-button__link $1"', $atag );
			} else {
				$atag = str_replace( '<a', '<a class="ark-block-button__link"', $atag );
			}

			return $atag;
		}, $block_content, 1 ); // limit: 1
	}
	return $block_content;
}
