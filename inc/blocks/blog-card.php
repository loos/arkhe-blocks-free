<?php
namespace Arkhe_Blocks\Block\Blog_Card;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/blog-card',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Blog_Card\cb',
	]
);

function cb( $attrs, $content ) {

	$sc_props = '';

	// リンクデータ
	$linkData = $attrs['linkData'] ?? [];
	$link_id  = $linkData['id'] ?? 0;
	$url      = $linkData['url'] ?? '';
	$kind     = $linkData['kind'] ?? '';
	$type     = $linkData['type'] ?? '';

	// カードデータ
	$use_cache     = $attrs['useCache'];
	$customCaption = $attrs['caption'] ?? '';
	$customTitle   = $attrs['customTitle'] ?? '';
	$customExcerpt = $attrs['customExcerpt'] ?? '';
	$show_exerptPC = $attrs['showExerptPC'];
	$show_exerptSP = $attrs['showExerptSP'];
	$show_image    = $attrs['showImage'];

	if ( ! empty( $linkData ) ) {
		// v2以降は、linkDataを使う
		$link_id = $linkData['id'] ?? 0;
		$url     = $linkData['url'] ?? '';
		$kind    = $linkData['kind'] ?? '';
		$type    = $linkData['type'] ?? '';

		if ( $link_id && ! $url ) {
			$sc_props .= "linkData={$link_id}";
		}
	} else {
		// v1
		$url     = $attrs['externalUrl'] ?? '';
		$link_id = $attrs['postId'] ?? 0;
		if ( $link_id ) {
			$kind = 'post-type';
		}
	}

	$is_kind_post = 'post-type' === $kind;

	// idなければ外部リンク。（タクソノミーページヘのリンクもサムネイル問題があるのでとりあえず外部リンクとして扱う )
	$is_external = ! $link_id || ! $is_kind_post;

	// キャッシュキーをセット
	$cache_key = '';
	if ( $link_id && 'post-type' === $kind ) {
		$cache_key = "arkhe_blogcard_{$link_id}";
	} elseif ( $link_id && $type ) {
		$cache_key = "arkhe_blogcard_{$type}_{$link_id}";
	} elseif ( $url ) {
		$cache_key = 'arkhe_blogcard_' . md5( $url );
	}

	// カードデータの生成開始
	$card_data = [];

	if ( $use_cache ) {
		$card_data = get_transient( $cache_key ) ?: [];
	} else {
		delete_transient( $cache_key );
	}

	if ( empty( $card_data ) ) {
		if ( $is_external ) {
			$card_data = get_external_blog_card( $url );
		} elseif ( $link_id ) {
			$card_data = get_internal_blog_card( $link_id );
		}

		if ( null === $card_data ) {
			return '';
		}

		if ( $use_cache ) {
			$cache_time = apply_filters( 'arkb_blogcard__cache_time', DAY_IN_SECONDS * 7 );
			set_transient( $cache_key, $card_data, $cache_time );
		}
	}

	// 上書き情報
	if ( $customCaption ) {
		$card_data['caption'] = $customCaption;
	}
	if ( $customTitle ) {
		$card_data['title'] = $customTitle;
	}
	if ( $customExcerpt ) {
		$card_data['excerpt'] = $customExcerpt;
	}
	if ( ! $show_image ) {
		unset( $card_data['thumb_url'] );
	}

	// ここまでのカード化するためのデータが何も取得できていない場合
	if ( empty( $card_data ) ) {
		return '<div class="ark-block-blogCard" style="padding:1em">Error: <a href="' . esc_attr( $url ) . '">' . esc_html( $url ) . '</a></div>';
	}

	// 追加情報
	$card_data['is_newtab'] = $attrs['isNewTab'] ?? false;
	$card_data['rel']       = $attrs['rel'] ?? '';
	$card_data['class']     = $attrs['className'] ?? '';
	$card_data['anchor']    = $attrs['anchor'] ?? '';
	$card_data['type']      = $is_external ? 'external' : 'internal';

	// インナーリンクだがogデータ取得している場合
	if ( $is_external && $kind ) {
		$card_data['caption'] = '';
		$card_data['icon']    = '';
		$card_data['type']    = 'internal';
	}

	$data_excerpt = '';
	if ( $show_exerptPC && $show_exerptSP ) {
		$data_excerpt = 'both';
	} elseif ( $show_exerptPC ) {
		$data_excerpt = 'pc';
	} elseif ( $show_exerptSP ) {
		$data_excerpt = 'sp';
	} else {
		$data_excerpt = 'none';
	}

	$card_data['show_excerpt'] = $data_excerpt;

	ob_start();
	\Arkhe_Blocks::get_part( 'blog_card', $card_data );
	return ob_get_clean();
}


/**
 * 内部リンクのブログカード化
 */
function get_internal_blog_card( $post_id ) {

	$post_data = get_post( $post_id );
	if ( null === $post_data ) return [];

	// 抜粋分の文字数セット
	$title_length       = apply_filters( 'arkb_blogcard__title_length', 100 );
	$excerpt_length     = apply_filters( 'arkb_blogcard__excerpt_length', 140 );
	$title              = get_the_title( $post_id );
	$url                = get_permalink( $post_id );
	$excerpt            = apply_filters( 'get_the_excerpt', $post_data->post_excerpt, $post_data );
	$date_timestamp     = get_post_timestamp( $post_id, 'date' );
	$modified_timestamp = get_post_timestamp( $post_id, 'modified' );
	$author_id          = $post_data->post_author;

	// タイトルは最大100文字までに制限
	if ( mb_strwidth( $title, 'UTF-8' ) > $title_length ) {
		$title = mb_strimwidth( $title, 0, $title_length, '...', 'UTF-8' );
	}

	// 抜粋文の文字数制御
	if ( mb_strwidth( $excerpt, 'UTF-8' ) > $excerpt_length ) {
		$excerpt = mb_strimwidth( $excerpt, 0, $excerpt_length ) . '...';
	}

	$card_data = [
		'url'                => $url,
		'title'              => $title,
		'excerpt'            => $excerpt,
		'date_timestamp'     => $date_timestamp,
		'modified_timestamp' => $modified_timestamp,
		'author_id'          => $author_id,
	];

	// カテゴリーデータ
	$categories = get_the_category( $post_id );
	if ( ! empty( $categories ) ) {
		$card_data['cat_id'] = $categories[0]->term_id;
	}

	// サムネイル画像のデータをセット
	if ( has_post_thumbnail( $post_id ) ) {
		$thumb_id   = get_post_thumbnail_id( $post_id );
		$thumb_data = wp_get_attachment_image_src( $thumb_id, 'medium' );
		$thumb_url  = $thumb_data[0];

		$card_data['thumb_id']  = $thumb_id;
		$card_data['thumb_url'] = $thumb_url;
	}

	return $card_data;
}


/**
 * 外部サイトのブログカード
 */
function get_external_blog_card( $url ) {

	// Get_OGP_InWP の読み込み
	require_once ARKHE_BLOCKS_PATH . 'classes/plugins/get_ogp_inwp.php';

	$ogps = \Get_OGP_InWP::get( $url );
	if ( empty( $ogps ) ) return [];

	// 必要なデータを抽出
	$card_data = \Get_OGP_InWP::extract_card_data( $ogps );

	$title       = $card_data['title'];
	$description = $card_data['description'];
	$site_name   = $card_data['site_name'];

	/**
	 * はてなブログの文字化け対策
	 */
	$title_decoded = utf8_decode( $title );  // utf8でのデコード
	if ( mb_detect_encoding( $title_decoded ) === 'UTF-8' ) {
		$title = $title_decoded;

		$description_decoded = utf8_decode( $description );
		if ( mb_detect_encoding( $description_decoded ) === 'UTF-8' ) {
			$description = $description_decoded;
		}

		$site_name_decoded = utf8_decode( $site_name );
		if ( mb_detect_encoding( $site_name_decoded ) === 'UTF-8' ) {
			$site_name = $site_name_decoded;
		}
	}

	// 最大文字数
	$title_length   = apply_filters( 'arkb_blogcard__title_length', 100 );
	$name_length    = apply_filters( 'arkb_blogcard__name_length', 32 );
	$excerpt_length = apply_filters( 'arkb_blogcard__excerpt_length', 140 );

	// 文字数で切り取り
	if ( mb_strwidth( $title, 'UTF-8' ) > $title_length ) {
		$title = mb_strimwidth( $title, 0, $title_length ) . '...';
	}
	if ( mb_strwidth( $site_name, 'UTF-8' ) > $name_length ) {
		$site_name = mb_strimwidth( $site_name, 0, $name_length ) . '...';
	}
	if ( mb_strwidth( $description, 'UTF-8' ) > $excerpt_length ) {
		$description = mb_strimwidth( $description, 0, $excerpt_length ) . '...';
	}

	return [
		'url'       => $url,
		'title'     => $title,
		'excerpt'   => $description,
		'thumb_url' => $card_data['thumbnail'],
		'icon'      => $card_data['icon'],
		'caption'   => $site_name,
	];
}
