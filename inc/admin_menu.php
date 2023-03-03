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

	// register_setting() する時にlicenceタブの情報があると邪魔なのでここで追加
	if ( \Arkhe_Blocks::IS_PRO && ! IS_ARKHE_THEME ) {
		$setting_tabs['licence'] = __( 'Licence registration', 'arkhe-blocks' );
	}

	// 現在のタブを取得
	$now_tab = (string) filter_input( INPUT_GET, 'tab' ) ?: 'general';

	?>
	<div id="arkb-menu" class="arkb-menu wrap">
		<div class="arkb-menu__head">
			<hr class="wp-header-end">
			<div class="arkb-menu__container">
				<h1 class="arkb-menu__title">
					<img src="<?=esc_attr( ARKHE_BLOCKS_URL . 'assets/img/arkhe-logo.svg' )?>" alt="" width="40" height="40" class="arkb-menu__titleLogo">
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
		</div>
		<?php if ( 'licence' !== $now_tab ) : ?>
			<div
				id="arkb-menu-body"
				class="arkb-menu__body arkb-menu__container"
				data-tab="<?=esc_attr( $now_tab )?>"
				data-name="<?=esc_attr( \Arkhe_Blocks::DB_NAMES[ $now_tab ] ?? '' )?>"
			></div>
		<?php else : ?>
			<div id="arkb-menu-body" class="arkb-menu__body arkb-menu__container" >
				<?php if ( ! IS_ARKHE_THEME ) include __DIR__ . '/menu/licence_page.php'; ?>
			</div>
		<?php endif; ?>
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
			if ( 'palette_colors' === $setting_key ) {
				// カラーパレットは別途schemaを定義
				$properties[ $setting_key ] = [
					'type'  => 'array',
					'items' => [
						'type'       => 'object',
						'properties' => [
							'name' => [
								'type' => 'string',
							],
							'slug' => [
								'type' => 'string',
							],
							'color' => [
								'type' => 'string',
							],
						],
					],
				];
			} elseif ( 'custom_formats' === $setting_key ) {
				// カスタム書式は別途schemaを定義
				$properties[ $setting_key ] = [
					'type'  => 'array',
					'items' => [
						'type'       => 'object',
						'properties' => [
							'name' => [
								'type' => 'string',
							],
							'slug' => [
								'type' => 'string',
							],
							'css' => [
								'type' => 'string',
							],
						],
					],
				];
			} elseif ( 'texts' === $setting_key ) {
				// テキスト呼び出し機能は別途schemaを定義
				$properties[ $setting_key ] = [
					'type'  => 'array',
					'items' => [
						'type'       => 'object',
						'properties' => [
							'label' => [
								'type' => 'string',
							],
							'content' => [
								'type' => 'string',
							],
						],
					],
				];
			} elseif ( 'block_styles' === $setting_key ) {
				// カスタムブロックスタイルは別途schemaを定義
				$properties[ $setting_key ] = [
					'type'  => 'array',
					'items' => [
						'type'       => 'object',
						'properties' => [
							'block' => [
								'type' => 'string',
							],
							'name' => [
								'type' => 'string',
							],
							'slug' => [
								'type' => 'string',
							],
							'css' => [
								'type' => 'string',
							],
						],
					],
				];
			} else {
				// それ以外の場合はstring型
				$properties[ $setting_key ] = [ 'type' => 'string' ];
			}
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
