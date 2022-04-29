<?php
namespace Arkhe_Blocks\Block\Section;

use \Arkhe_Blocks as Arkb;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/section',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Section\cb',
	]
);

function cb( $attrs, $content ) {

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


function render_section( $attrs, $content ) {
	$media_html = render_media( $attrs );
	if ( ! $media_html ) return $content;

	$style = [];
	if ( isset( $attrs['focalPoint'] ) ) {
		$x = $attrs['focalPoint']['x'] * 100;
		$y = $attrs['focalPoint']['y'] * 100;

		$style['--arkb-object-position'] = "{$x}% {$y}%";
	}
	if ( isset( $attrs['focalPointSP'] ) ) {
		$x = $attrs['focalPointSP']['x'] * 100;
		$y = $attrs['focalPointSP']['y'] * 100;

		$style['--arkb-object-position--sp'] = "{$x}% {$y}%";
	}

	$media_attrs = [
		'class' => 'ark-block-section__media arkb-absLayer',
		'style' => Arkb::convert_style_props( $style ) ?: false,
	];

	return str_replace(
		'<!-- media -->',
		'<div ' . Arkb::generate_html_attrs( $media_attrs ) . '>' . $media_html . '</div>',
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
	if ( 'video' === $mediaTypeSP ) {
		$media_html .= Arkb::generate_html_tag( 'video', [
			'class'      => 'ark-block-section__video arkb-obf-cover arkb-only-sp',
			'src'        => $mediaUrlSP,
			'width'      => $mediaSP['width'] ?? false,
			'height'     => $mediaSP['height'] ?? false,
			'custom'     => 'autoplay loop playsinline muted',
		], '' );
	} elseif ( 'image' === $mediaTypeSP ) {
		$class       = Arkb::classnames('ark-block-section__img arkb-obf-cover arkb-only-sp', [
			"wp-image-{$mediaIdSP}" => $mediaIdSP,
		]);
		$media_html .= Arkb::generate_html_tag( 'img', [
			'class'       => $class,
			'width'       => $mediaSP['width'] ?? false,
			'height'      => $mediaSP['height'] ?? false,
			'src'         => $mediaUrlSP,
			'alt'         => '',
			'decording'   => 'async',
			'aria-hidden' => 'true',
		]);
	}

	// PC用メディア
	if ( 'video' === $mediaType ) {
		$class       = Arkb::classnames('ark-block-section__video arkb-obf-cover', [
			'arkb-only-pc' => $mediaTypeSP,
		]);
		$media_html .= Arkb::generate_html_tag( 'video', [
			'class'      => $class,
			'src'        => $mediaUrl,
			'width'      => $media['width'] ?? false,
			'height'     => $media['height'] ?? false,
			'custom'     => 'autoplay loop playsinline muted',
		], '' );
	} elseif ( 'image' === $mediaType ) {
		$class = Arkb::classnames('ark-block-section__img arkb-obf-cover', [
			"wp-image-{$mediaId}" => $mediaId,
			'arkb-only-pc'        => $mediaTypeSP,
		]);

		$media_html .= Arkb::generate_html_tag( 'img', [
			'class'       => $class,
			'width'       => $media['width'] ?? false,
			'height'      => $media['height'] ?? false,
			'src'         => $mediaUrl,
			'alt'         => '',
			'decording'   => 'async',
			'aria-hidden' => 'true',
		] );
	}

	return apply_filters( 'arkb_section_media_html', $media_html, $attrs );
}
