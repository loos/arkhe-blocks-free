<?php
namespace Arkhe_Blocks\Block\Section;

use \Arkhe_Blocks as Arkb;
use \Arkhe_Blocks\Style as Style;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/section',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Section\cb',
	]
);

function cb( $attrs, $content ) {

	// <style>生成
	$unique_id = render_style( $attrs );
	if ( $unique_id ) {
		$content = preg_replace(
			'/class=\"/',
			'class="' . esc_attr( $unique_id ) . ' ',
			$content,
			1
		);
	}

	// 最新: section v3
	if ( false !== strpos( $content, '<!-- media -->' ) ) {
		return render_section( $attrs, $content );
	} elseif ( false !== strpos( $content, 'class="ark-block-section__body' ) ) {
		return $content;
	}

	// 後方互換
	require_once __DIR__ . '/section/migrate.php';
	require_once __DIR__ . '/section/deprecated.php';
	require_once __DIR__ . '/section/helper.php';

	// 初期 -> section v2
	if ( false !== strpos( $content, 'class="ark-block-section__inner' ) ) {
		$content = migrate_content( $content );
	}

	// section v2
	ob_start();
	render_section_old( $attrs, $content );
	return ob_get_clean();
}


function get_svg_height( $svg_level ) {
	$svgLevel = $svg_level;
	if ( ! $svgLevel ) return '';
	return abs( $svgLevel * 0.1 ) . 'vw';
}


function render_style( $attrs ) {

	$the_styles = [];

	$textColor = $attrs['textColor'] ?? '';
	if ( $textColor ) {
		if ($textColor) $the_styles['all']['color'] = $textColor;
	}

	// 高さ
	$height_type = $attrs['height'] ?? '';
	if ( 'custom' === $height_type ) {
		$heightPC = $attrs['heightPC'] ?? '';
		if ($heightPC) $the_styles['all']['--arkb-min-height'] = $heightPC;

		$heightSP = $attrs['heightSP'] ?? '';
		if ($heightSP) $the_styles['sp']['--arkb-min-height'] = $heightSP;
	}

	// 余白
	$paddingPC = $attrs['paddingPC'] ?? null;
	if ( $paddingPC ) {
		$the_styles['all']['--arkb-padding'] = Style::get_custom_padding( $paddingPC, '0', '4rem 0rem 4rem 0rem' );
	}
	$paddingSP = $attrs['paddingSP'] ?? null;
	if ( $paddingSP ) {
		$the_styles['sp']['--arkb-padding'] = Style::get_custom_padding( $paddingSP, '0' );
	}

	// svg高さ
	$svgTop_level = $attrs['svgTop']['level'] ?? '';
	if ( $svgTop_level ) {
		$the_styles['all']['--arkb-svg-height--top'] = get_svg_height( $svgTop_level );
	}
	$svgBottom_level = $attrs['svgBottom']['level'] ?? '';
	if ( $svgBottom_level ) {
		$the_styles['all']['--arkb-svg-height--bottom'] = get_svg_height( $svgBottom_level );
	}

	// リピート背景画像
	$isRepeat = $attrs['isRepeat'] ?? false;
	$mediaUrl = $attrs['media']['url'] ?? '';
	if ( $isRepeat && $mediaUrl ) {
		$the_styles['all']['background-image']  = "url($mediaUrl)";
		$the_styles['all']['background-repeat'] = 'repeat';

		$bgSize = $attrs['bgSize'] ?? '';
		if ( $bgSize ) {
			$the_styles['all']['background-size'] = $bgSize;
		}
	}

	// 動的スタイルの処理
	$unique_id = Style::sort_dynamic_block_styles( 'arkb-section--', $the_styles );
	return $unique_id;
}

function render_section( $attrs, $content ) {

	$media_html = render_media( $attrs );
	if ( ! $media_html ) return $content;

	$media_attrs = [
		'class' => 'ark-block-section__media arkb-absLayer',
	];

	// $textColor = $attrs['textColor'] ?? '';
	// if ( $textColor ) {
	// 	$content = str_replace(
	// 		'<div class="ark-block-section__body"',
	// 		'<div class="ark-block-section__body" style="color:' . $textColor . '"',
	// 		$content
	// 	);
	// }

	return str_replace(
		'<!-- media -->',
		'<div class="ark-block-section__media arkb-absLayer">' . $media_html . '</div>',
		$content
	);
}


function render_media( $attrs ) {
	// mediaデータ
	$media       = $attrs['media'];
	$mediaSP     = $attrs['mediaSP'];
	$mediaId     = $media['id'] ?? 0;
	$mediaUrl    = $media['url'] ?? '';
	$mediaType   = $media['type'] ?? '';
	$mediaIdSP   = $mediaSP['id'] ?? 0;
	$mediaUrlSP  = $mediaSP['url'] ?? '';
	$mediaTypeSP = $mediaSP['type'] ?? '';

	if ( ! $mediaUrl ) return '';

	$media_html = '';

	// SP用メディア
	if ( $mediaUrlSP ) {
		$props = [
			'src'        => $mediaUrlSP,
			'width'      => $mediaSP['width'] ?? false,
			'height'     => $mediaSP['height'] ?? false,
		];

		if ( isset( $attrs['focalPointSP'] ) ) {
			$x              = $attrs['focalPointSP']['x'] * 100;
			$y              = $attrs['focalPointSP']['y'] * 100;
			$props['style'] = "object-position: {$x}% {$y}%";
		}

		if ( 'video' === $mediaTypeSP ) {
			$media_html .= Arkb::generate_html_tag( 'video', array_merge( $props, [
				'class'      => 'ark-block-section__video arkb-obf-cover arkb-only-sp',
				'custom'     => 'autoplay loop playsinline muted',
			] ), '' );
		} elseif ( 'image' === $mediaTypeSP ) {
			$class       = Arkb::classnames('ark-block-section__img arkb-obf-cover arkb-only-sp', [
				"wp-image-{$mediaIdSP}" => $mediaIdSP,
			]);
			$media_html .= Arkb::generate_html_tag( 'img', array_merge( $props, [
				'class'       => $class,
				'alt'         => '',
				'decording'   => 'async',
				'aria-hidden' => 'true',
			]));
		}
	}

	// PC用メディア
	if ( $mediaUrl ) {
		$props = [
			'src'        => $mediaUrl,
			'width'      => $media['width'] ?? false,
			'height'     => $media['height'] ?? false,
		];

		if ( isset( $attrs['focalPoint'] ) ) {
			$x              = $attrs['focalPoint']['x'] * 100;
			$y              = $attrs['focalPoint']['y'] * 100;
			$props['style'] = "object-position: {$x}% {$y}%";
		}

		if ( 'video' === $mediaType ) {
			$class       = Arkb::classnames('ark-block-section__video arkb-obf-cover', [
				'arkb-only-pc' => $mediaTypeSP,
			]);
			$media_html .= Arkb::generate_html_tag( 'video', array_merge( $props, [
				'class'      => $class,
				'custom'     => 'autoplay loop playsinline muted',
			]), '' );
		} elseif ( 'image' === $mediaType ) {
			$class = Arkb::classnames('ark-block-section__img arkb-obf-cover', [
				"wp-image-{$mediaId}" => $mediaId,
				'arkb-only-pc'        => $mediaTypeSP,
			]);

			$media_html .= Arkb::generate_html_tag( 'img', array_merge( $props, [
				'class'       => $class,
				'alt'         => '',
				'decording'   => 'async',
				'aria-hidden' => 'true',
			]) );
		}
	}

	return apply_filters( 'arkb_section__media_html', $media_html, $attrs );
}
