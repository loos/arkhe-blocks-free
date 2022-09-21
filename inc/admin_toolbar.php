<?php
namespace Arkhe_Blocks\Toolbar;

defined( 'ABSPATH' ) || exit;

/**
 * Arkhe Blocks 設定メニューへの導線を追加
 */
add_filter( 'admin_bar_menu', function ( $wp_admin_bar ) {

	$arkhe_menu_id = 'arkhe_blocks';
	$menu_title    = 'Arkhe Blocks';

	if ( method_exists( '\Arkhe', 'get_svg' ) ) {
		$menu_title = '<span class="ab-icon -arkhe">' . \Arkhe::get_svg( 'arkhe-logo' ) . '</span><span class="ab-label">Blocks</span>';
	}

	// 親メニュー
	$wp_admin_bar->add_menu(
		[
			'id'    => $arkhe_menu_id,
			'title' => $menu_title,
			'href'  => admin_url( 'admin.php?page=' . \Arkhe_Blocks::MENU_SLUG ),
			'meta'  => [
				'class' => 'arkb-menu',
			],
		]
	);

}, 99 );



/**
 * プロライセンス購入ページへの導線を追加
 */
add_filter( 'admin_bar_menu', function ( $wp_admin_bar ) {

	$has_licence = \Arkhe_Blocks\Licence::has_licence();

	// ライセンスが有効な時は何もしない
	if ( $has_licence ) return;

	if ( IS_ARKHE_THEME ) {

		// 他のArkheプラグインからメニュー追加済みの場合は何もしない
		if ( method_exists( '\Arkhe', 'get_plugin_data' ) && \Arkhe::get_plugin_data( 'added_toolbar_to_pro' ) ) {
			return;
		}

		// プロライセンス購入ページへの導線を追加
		if ( method_exists( '\Arkhe', 'get_toolbar_data' ) ) {

			// since arkhe 1.9 ~
			$wp_admin_bar->add_menu( \Arkhe::get_toolbar_data( 'licence' ) );
			\Arkhe::set_plugin_data( 'added_toolbar_to_pro', 1 );

		}
	} else {
		// Arkhe以外のテーマの場合

		$wp_admin_bar->add_menu(
			[
				'id'     => 'arkb_licence_check',
				'meta'   => [ 'class' => 'arkhe-menu-licence' ],
				'title'  => __( 'Licence registration', 'arkhe-blocks' ),
				'href'   => admin_url( 'admin.php?page=arkhe_blocks_settings&tab=licence' ),
			]
		);
	}

}, 100 );
