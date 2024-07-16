<?php
namespace Arkhe_Blocks\Block\Restricted_Area;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'dist/gutenberg/blocks/restricted-area',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Restricted_Area\cb',
	]
);

function cb( $attrs, $content ) {
	$roles           = $attrs['roles'];
	$is_role         = $attrs['isRole'];
	$is_logged_in    = $attrs['isLoggedIn'];
	$is_date_time    = $attrs['isDateTime'];
	$is_page         = $attrs['isPage'];
	$page_limit_type = $attrs['pageLimitType'];

	$start_date_time = $attrs['startDateTime'] ?? '';
	$end_date_time   = $attrs['endDateTime'] ?? '';

	// ログイン制限有効
	if ( $is_role ) {
		// 非ログインユーザー制限あり、かつログイン中は非表示
		if ( ! $is_logged_in && is_user_logged_in() ) return '';

		// ログインユーザー制限あり
		if ( $is_logged_in ) {
			$allowed_roles = array_keys( array_filter( $roles, function( $role ) {
				return true === $role;
			}));

			$current_user = wp_get_current_user();

			// 現在のユーザーの権限が制限対象として含まれていない場合は非表示
			if ( empty( array_intersect( $allowed_roles, $current_user->roles ) ) ) return '';
		}
	}

	// 日時範囲制限有効
	if ( $is_date_time ) {
		// phpcs:ignore WordPress.DateTime.CurrentTimeTimestamp.Requested
		$current_timestamp = current_time( 'timestamp' );
		$start_timestamp   = $start_date_time ? strtotime( $start_date_time ) : null;
		$end_timestamp     = $end_date_time ? strtotime( $end_date_time ) : null;

		// 現在日時が設定範囲に含まれていない場合は非表示
		if ( $start_timestamp && $current_timestamp < $start_timestamp ) return '';
		if ( $end_timestamp && $end_timestamp < $current_timestamp ) return '';
	}

	// ページ制限有効時
	if ( $is_page ) {

		if ( 'page_type' === $page_limit_type ) {
			if ( ! \Arkhe_Blocks\Block\Restricted_Area\check_page_type( $attrs ) ) {
				return '';
			};

		} elseif ( 'terms' === $page_limit_type ) {
			if ( ! \Arkhe_Blocks\Block\Restricted_Area\check_terms( $attrs['terms'] ) ) {
				return '';
			};
		}
	}

	return $content;
}

function check_page_type( $attrs ) {
	$page_types = $attrs['pageTypes'];
	$is_search  = $page_types['search'] ?? false;

	if ( $page_types['404'] && is_404() ) {
		return true;
	} elseif ( $is_search && is_search() ) {
		return true;
	} elseif ( $page_types['front'] && is_front_page() ) {
		return true;
	} elseif ( $page_types['home'] && is_home() ) {
		return true;
	} elseif ( $page_types['archive'] && is_archive() ) {
		return true;
	} elseif ( $page_types['singular'] && is_singular() ) {
		$allowed_post_types = $attrs['allowedPostTypes'];

		// 「すべての投稿タイプ」のとき
		if ( '' === $allowed_post_types ) {
			return true;
		}

		// 配列化
		$allowed_post_types = explode( ',', rtrim( $allowed_post_types, ',' ) );

		$post_type = get_post_type();

		if ( in_array( $post_type, $allowed_post_types, true ) ) {
			return true;
		}

		return false;
	}
}


function check_terms( $terms ) {

	if ( $terms['isArchive'] && is_archive() ) {
		// Arkhe_Blocks\Block\Restricted_Area
		if ( check_terms_in_archive( $terms ) ) {
			return true;
		}
	}

	if ( $terms['isSingular'] && is_singular() ) {
		if ( check_terms_in_singular( $terms ) ) {
			return true;
		}
	}

}


function check_terms_in_archive( $terms ) {
	$catIDs       = $terms['catID'] ? explode( ',', rtrim( $terms['catID'], ',' ) ) : [];
	$tagIDs       = $terms['tagID'] ? explode( ',', rtrim( $terms['tagID'], ',' ) ) : [];
	$termIDs      = $terms['termID'] ? explode( ',', rtrim( $terms['termID'], ',' ) ) : [];
	$taxName      = $terms['taxName'] ?? '';
	$catRelation  = $terms['catRelation'];
	$tagRelation  = $terms['tagRelation'];
	$termRelation = $terms['termRelation'];

	if ( is_category() && ! empty( $catIDs ) ) {

		return 'IN' === $catRelation ? is_category( $catIDs ) : ! is_category( $catIDs );

	} elseif ( is_tag() && ! empty( $tagIDs ) ) {

		return 'IN' === $tagRelation ? is_tag( $tagIDs ) : ! is_tag( $tagIDs );

	} elseif ( $taxName && is_tax( $taxName ) && ! empty( $termIDs ) ) {

		return 'IN' === $termRelation ? is_tax( $taxName, $termIDs ) : ! is_tax( $taxName, $termIDs );

	}

	return false;

}
function check_terms_in_singular( $terms ) {
	$catIDs        = $terms['catID'] ? explode( ',', rtrim( $terms['catID'], ',' ) ) : [];
	$tagIDs        = $terms['tagID'] ? explode( ',', rtrim( $terms['tagID'], ',' ) ) : [];
	$termIDs       = $terms['termID'] ? explode( ',', rtrim( $terms['termID'], ',' ) ) : [];
	$taxName       = $terms['taxName'] ?? '';
	$catRelation   = $terms['catRelation'];
	$tagRelation   = $terms['tagRelation'];
	$termRelation  = $terms['termRelation'];
	$queryRelation = $terms['queryRelation'];

	$valid_cat = false;
	$valid_tag = false;
	$valid_tax = false;
	$is_AND    = 'OR' !== $queryRelation;

	if ( ! empty( $catIDs ) ) {
		$valid_cat = check_singular_terms( 'category', $catIDs, $catRelation );
	} elseif ( $is_AND && empty( $catIDs ) ) {
		$valid_cat = true;
	}

	if ( ! empty( $tagIDs ) ) {
		$valid_tag = check_singular_terms( 'post_tag', $tagIDs, $tagRelation );
	} elseif ( $is_AND && empty( $tagIDs ) ) {
		$valid_tag = true;
	}

	if ( $taxName && ! empty( $termIDs ) ) {
		$valid_tax = check_singular_terms( $taxName, $termIDs, $termRelation );
	} elseif ( $is_AND && empty( $termIDs ) ) {
		$valid_tax = true;
	}

	if ( $is_AND ) {
		return $valid_cat && $valid_tag && $valid_tax;
	} else {
		return $valid_cat || $valid_tag || $valid_tax;
	}
	return false;
}



function check_singular_terms( $tax, $termIDs, $relation ) {

	// 現在の投稿タイプでサポートしているタクソノミーかどうかチェック
	if ( ! in_array( $tax, get_object_taxonomies( get_post_type() ), true ) ) {
		return false;
	}

	if ( 'IN' === $relation ) {

		return has_term( $termIDs, $tax );

	} elseif ( 'NOT IN' === $relation ) {

		return ! has_term( $termIDs, $tax );

	} elseif ( 'AND' === $relation ) {

		$have_all = true;
		foreach ( $termIDs as $termID ) {
			$have_all = $have_all && has_term( $termID, $tax );
		}
		return $have_all;
	}

	return false;
}
