<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

add_filter( 'admin_bar_menu', function ( $wp_admin_bar ) {

	if ( ! class_exists( 'Arkhe' ) ) return;

	// プロライセンス購入ページへの導線
	if ( ! \Arkhe::get_plugin_data( 'added_toolbar_to_pro' ) && ! \Arkhe::$has_pro_licence ) {
		\Arkhe::set_plugin_data( 'added_toolbar_to_pro', 1 );

		if ( method_exists( '\Arkhe', 'get_toolbar_data' ) ) {

			// since arkhe 1.9 ~
			$wp_admin_bar->add_menu( \Arkhe::get_toolbar_data( 'licence' ) );

		} else {

			// 後方互換のためしばらく残す
			$license_title = __( 'License key registration', 'arkhe-blocks' );
			$wp_admin_bar->add_menu(
				[
					'id'     => 'arkhe_licence_check',
					'meta'   => [ 'class' => 'arkhe-menu-licence' ],
					'title'  => __( 'License key registration', 'arkhe-blocks' ),
					'href'   => admin_url( 'themes.php?page=arkhe&tab=licence' ),
				]
			);
		}
	}
}, 100 );
