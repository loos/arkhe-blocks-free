<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;



/**
 * 管理画面に独自メニューを追加
 */
add_action( 'admin_menu', function () {
	$arkhe_menu_title = 'Arkhe Blocks';

	// 設定ページを追加
	add_menu_page(
		$arkhe_menu_title, // ページタイトルタグ
		$arkhe_menu_title, // メニュータイトル
		'manage_options',  // 必要な権限
		\Arkhe_Blocks::MENU_SLUG, // このメニューを参照するスラッグ名
		'\Arkhe_Blocks\Menu\display_setting_page', // 表示内容
		ARKHE_BLOCKS_URL . 'assets/img/arkhe-menu-icon.png', // アイコン
		29 // 管理画面での表示位置 Toolkit と同じ
	);

	// トップメニュー複製
	add_submenu_page(
		\Arkhe_Blocks::MENU_SLUG,
		$arkhe_menu_title,
		$arkhe_menu_title,
		'manage_options',
		\Arkhe_Blocks::MENU_SLUG,
		'\Arkhe_Blocks\Menu\display_setting_page'
	);
}, 11 );

/**
 * 設定ページの内容
 */
function display_setting_page() {
	// 設定タブのリスト
	$setting_tabs = \Arkhe_Blocks::$menu_tabs;

	// 現在のタブを取得
	$now_tab = (string) filter_input( INPUT_GET, 'tab' ) ?: 'general';
	?>
	<div id="arkhe-menu" class="arkhe-menu wrap">
		<div class="arkhe-menu__head">
			<h1 class="arkhe-menu__title">
				<?=esc_html__( 'Arkhe Blocks Settings', 'arkhe-blocks' )?>
			</h1>
			<div class="nav-tab-wrapper">
				<?php
					foreach ( $setting_tabs as $key => $val ) :
					$tab_url   = admin_url( 'admin.php?page=' . \Arkhe_Blocks::MENU_SLUG ) . '&tab=' . $key;
					$nav_class = ( $now_tab === $key ) ? 'nav-tab nav-tab-active' : 'nav-tab';

					echo '<a href="' . esc_url( $tab_url ) . '" class="' . esc_attr( $nav_class ) . '">' . esc_html( $val ) . '</a>';
					endforeach;
				?>
			</div>
		</div>
		<div
			id="arkhe-menu-body"
			class="arkhe-menu__body"
			data-tab="<?=esc_attr( $now_tab )?>"
			data-name="<?=esc_attr( \Arkhe_Blocks::DB_NAMES[ $now_tab ] )?>"
		></div>
	</div>
<?php
}

/**
 * 設定の追加
 */
add_action( 'init', function() {

	$menu_tabs     = \Arkhe_Blocks::$menu_tabs;
	$settings_data = \Arkhe_Blocks::get_data();

	foreach ( $menu_tabs as $menu_key => $menu_value ) {
		$properties = [];
		foreach ( $settings_data[ $menu_key ] as $setting_key => $setting_value ) {
			$properties[ $setting_key ] = [ 'type' => 'string' ];
		}

		register_setting(
			\Arkhe_Blocks::MENU_SLUG . '_' . $menu_key,
			\Arkhe_Blocks::DB_NAMES[ $menu_key ],
			[
				'type'         => 'object',
				'show_in_rest' => [
					'schema' => [
						'type'       => 'object',
						'properties' => $properties,
					],
				],
				// 'default' => 後から追加したりした時を考えてJS側でコントロール
			]
		);
	}
} );
