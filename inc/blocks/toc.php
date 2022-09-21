<?php
namespace Arkhe_Blocks\Block\Toc;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/toc',
	[
		'render_callback'  => __NAMESPACE__ . '\cb',
	]
);

function cb( $attrs, $content ) {

	// TOCブロックの使用を記録
	\Arkhe_Blocks::$use['toc'] = true;

	$anchor    = $attrs['anchor'] ?? '';
	$className = $attrs['className'] ?? '';
	$target    = $attrs['target'] ?? '';

	$block_attrs = [
		'id'            => $anchor ?: false,
		'class'         => trim( 'ark-block-toc ' . $className ),
		'data-target'   => $target ?: false,
		// 'data-rendered' => '0',
	];

	if ( $target ) {
		wp_cache_set( 'toc-target', $target, 'arkb' );
	} else {
		wp_cache_delete( 'toc-target', 'arkb' );
	}

	// スクリプトでの生成がオフのとき
	if ( 'php' === \Arkhe_Blocks::get_data( 'block', 'toc_script' ) ) {

		// 目次生成処理を登録
		add_filter( 'the_content', __NAMESPACE__ . '\arkb_generate_toc', 99 );

		$cached_toc = wp_cache_get( 'toc', 'arkb' );
		if ( false !== $cached_toc ) {
			// the_content での処理をすでに行っている時
			if ( $cached_toc ) {
				// 目次の生成に成功している時
				return '<div ' . \Arkhe_Blocks::generate_html_attrs( $block_attrs ) . '>' .
				'<div class="ark-block-toc__title">' . \Arkhe_Blocks::get_data( 'block', 'toc_title' ) . '</div>' .
				$cached_toc .
			'</div>';
			} else {
				// 目次として表示するものがなかった時
				return '';
			}
		}
	}

	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	ob_start();
	echo '<div ' . \Arkhe_Blocks::generate_html_attrs( $block_attrs ) . '>
		<div class="ark-block-toc__title">' . \Arkhe_Blocks::get_data( 'block', 'toc_title' ) . '</div>
		<!-- Arkb TOC -->
	</div>';
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
	return ob_get_clean();
}


/**
 * 目次生成処理
 */
function arkb_generate_toc( $content ) {

	wp_cache_set( 'toc', '', 'arkb' );

	$target    = wp_cache_get( 'toc-target', 'arkb' ) ?: \Arkhe_Blocks::get_data( 'block', 'toc_target' );
	$threshold = (int) \Arkhe_Blocks::get_data( 'block', 'toc_threshold' );

	if ( 'h2' === $target ) {
		$pattern = '/(<h(2)[^>]*>)(.*?)<\/h2>/ms';
	} elseif ( 'h3' === $target ) {
		$pattern = '/(<h([2-3])[^>]*>)(.*?)<\/h\2>/ms';
	} elseif ( 'h4' === $target ) {
		$pattern = '/(<h([2-4])[^>]*>)(.*?)<\/h\2>/ms';
	}

	// \2 = $2
	$has_htag = preg_match_all( $pattern, $content, $matches, PREG_SET_ORDER );
	if ( ! $has_htag ) return $content;

	// 見出しの数がthresholdより少ない場合は何もしない
	if ( count( $matches ) < $threshold ) {
		return $content;
	}

	$level        = 0;
	$currentLevel = 2;
	$listHtml     = '';
	foreach ( $matches as $i => $match ) {
		// var_dump( $match );

		$mathed0  = $match[0];
		$the_htag = $match[1];
		$level    = (int) $match[2];
		$text     = $match[3];

		// 最初の見出しがh2でない場合、スキップ
		if ( '' === $listHtml && 2 !== $level ) {
			continue;
		}

		// h2からいきなりh4とかになった時スキップする
		if ( 1 < $level - $currentLevel ) {
			continue;
		}

		// h2からいきなりh4とかになった時スキップする
		if ( 1 < $level - $currentLevel ) {
			continue;
		}

		// 除外対象のクラスが付いている見出しは除外
		preg_match( '/class="([^"]*)"/', $the_htag, $matched_class );
		if ( ! empty( $matched_class ) ) {
			$classes           = explode( ' ', $matched_class[1] );
			$ignore_classes    = apply_filters( 'arkb_toc__ignore_classes', [ 'arkb-toc-off', 'p-postList__title' ] );
			$intersect_classes = array_intersect( $ignore_classes, $classes );
			if ( ! empty( $intersect_classes ) ) {
				continue;
			}
		}

		// id を生成
		$htagID = '';
		preg_match( '/id="([^"]*)"/', $the_htag, $matched_id );
		if ( empty( $matched_id ) ) {
			$htagID = 'arkb-toc-' . $i;

			// コンテンツ側にもidを付与
			$new_htag = str_replace( '<h' . $level, '<h' . $level . ' id="' . $htagID . '"', $mathed0 );
			$content  = str_replace( $mathed0, $new_htag, $content );
		} else {
			$htagID = $matched_id[1];
		}

		if ( $currentLevel < $level ) {
			// 見出しレベルが上がったら、<ul|ol> を追加

			$currentLevel++;
			$listHtml  = substr( $listHtml, 0, -5 ); // </li> を削除しておいて入れ子にする
			$listHtml .= '<ol class="ark-block-toc__list" data-level="' . $currentLevel . '">';
		} elseif ( $currentLevel > $level ) {
			// 見出しレベルが戻る時、深さに応じて <ul|ol> を閉じる

			while ( $currentLevel > $level ) {
				$currentLevel--;
				$listHtml .= '</ol></li>';
			}
		}

		// <li> を追加
		$text      = strip_tags( $text, '<ruby><rb><rt><rp>' );
		$listHtml .= '<li><a href="#' . $htagID . '" class="ark-block-toc__link">' . $text . '</a></li>';

	} // end foreach

	// 最後の見出しレベルに合わせて閉じタグを生成
	while ( $currentLevel > 1 ) {
		$listHtml .= '</ol></li>';
		$currentLevel--;
	}

	if ( ! $listHtml ) return $content;

	$listHtml = '<ol class="ark-block-toc__list" data-level="2">' . $listHtml . '</ol>';

	// echo $listHtml;
	$content = str_replace( '<!-- Arkb TOC -->', $listHtml, $content );

	wp_cache_set( 'toc', $listHtml, 'arkb' );

	return $content;
}
