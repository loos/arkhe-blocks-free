<?php
namespace Arkhe_Blocks\Notice;

defined( 'ABSPATH' ) || exit;


/**
 * Pro版へのリンクを追加
 */
add_action( 'plugin_action_links_' . \Arkhe_Blocks::$basename, __NAMESPACE__ . '\hook__plugin_action_links' );
function hook__plugin_action_links( $links ) {
	if ( \Arkhe_Blocks::IS_PRO ) return $links;

	return array_merge( $links, [
		'<a class="arkb-link--toPro" target="_blank" href="https://arkhe-theme.com/ja/product/arkhe-blocks-pro/" style="color: #ff8a46;font-weight: 700;text-shadow: 1px 1px #fff;">' . esc_html__( 'Go Pro', 'arkhe-blocks' ) . '</a>',
	]);
}


/**
 * 管理画面へ表示するメッセージ
 */
add_action( 'admin_notices', function () {

	// プロ版と無料版の2重有効化時に警告を表示する
	if ( \Arkhe_Blocks::IS_PRO ) {
		arkb_check_double_activated();
	}

	if ( ! \Arkhe_Blocks\Licence::has_licence() ) {

		$now_version    = \Arkhe_Blocks::$version;
		$latest_version = arkb_get_latest_version();

		// 現在のバージョンが古くなっているかどうか
		$is_older = version_compare( $now_version, $latest_version ) < 0;

		if ( $is_older ) {
			$licence_link = IS_ARKHE_THEME ? admin_url( 'themes.php?page=arkhe&tab=licence' ) : admin_url( 'admin.php?page=arkhe_blocks_settings&tab=licence' );

			// phpcs:disable WordPress.WP.I18n.MissingTranslatorsComment
			$text  = sprintf(
				__( '<b>%2$s</b> is newer than your version (%1$s).', 'arkhe-blocks' ),
				'ver.' . $now_version,
				'ver.' . $latest_version
			);
			$text .= ' ';
			$text .= sprintf(
				__( 'You can always use the latest version by executing %s.', 'arkhe-blocks' ),
				'<a href="' . $licence_link . '">' . __( 'Licence registration', 'arkhe-blocks' ) . '</a>'
			);

			$allowed = [
				'p'          => [],
				'b'          => [],
				'br'         => [],
				'a'          => [
					'href'  => [],
					'rel'   => [],
				],
			];

			echo '<div class="notice notice-warning"><p>' .
			'<b>[Arkhe Blocks Pro]</b> ' . wp_kses( $text, $allowed ) .
			'</p></div>';
		}
	}
} );


/**
 * Arkhe Blocks の最新版を取得
 */
function arkb_get_latest_version() {
	$latest_version = get_transient( 'arkb_latest_version' ) ?? '';
	if ( ! $latest_version ) {

		$response = wp_remote_get(
			\Arkhe_Blocks::CDN_URL . '/api/?action=get_latest_version&type=blocks',
			[ 'sslverify' => false ]
		);

		if ( is_wp_error( $response ) ) return '';

		$response_code = wp_remote_retrieve_response_code( $response );
		if ( 200 !== $response_code ) return '';

		$response_body = json_decode( wp_remote_retrieve_body( $response ), true ); // array型で取得

		if ( ! is_array( $response_body ) || ! isset( $response_body['ver'] ) ) return '';

		$latest_version = $response_body['ver'];
		set_transient( 'arkb_latest_version', $latest_version, DAY_IN_SECONDS * 7 );
	}

	return $latest_version;
}


/**
 * 無料版とPRO版の両方が稼働していないかをチェック
 */
function arkb_check_double_activated() {
	if ( ! function_exists( 'get_plugins' ) ) {
		include_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$plugins = get_plugins() ?: [];

	$is_use_free = false;
	foreach ( $plugins as $path => $plugin ) {
		if ( ! is_plugin_active( $path ) ) continue;

		if ( 'Arkhe Blocks' === $plugin['Name'] ) {
			$is_use_free = true;
			break;
		}
	}

	// 無料版・有料版を両方使ってる場合
	if ( $is_use_free ) {
		echo '<div class="notice notice-warning"><p>' .
			esc_html__( 'Both the free and PRO versions of Arkhe Blocks are running.', 'arkhe-blocks' ) .
			'<br>' .
			esc_html__( 'If you are using the PRO version, please disable the free version.', 'arkhe-blocks' ) .
		'</p></div>';
	}
}
