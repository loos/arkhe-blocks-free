<?php
namespace Arkhe_Blocks\Ajax;

function arkb_check_ajax_nonce( $nonce_key = 'arkb-nonce' ) {

	$nonce = $_POST[ 'nonce' ] ?? ''; // phpcs:ignore
	if ( ! $nonce ) return false;

	if ( \wp_verify_nonce( $nonce, $nonce_key ) ) {
		return true;
	}

	return false;
}


/**
 * キャッシュのクリア
 */
add_action( 'wp_ajax_arkb_clear_cache', function() {
	if ( ! arkb_check_ajax_nonce() ) {
		wp_die( wp_json_encode( 'Nonce error.' ) );
	}

	delete_transient( \Arkhe_Blocks::CACHE_KEYS['get_custom_styles'] . '_' . \Arkhe_Blocks::$version );

	wp_die( wp_json_encode( 'Cleared cache.' ) );
} );
