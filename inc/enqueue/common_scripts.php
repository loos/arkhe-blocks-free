<?php
namespace Arkhe_Blocks\Enqueue;

defined( 'ABSPATH' ) || exit;

/**
 * 翻訳ファイル読み込み memo: 設定画面用とブロック用。
 */
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\register_translations', 1 );
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\register_translations', 1 );

function register_translations() {

	// 翻訳登録用の空ファイル
	wp_enqueue_script( 'arkhe-blocks-lang', ARKHE_BLOCKS_URL . 'assets/js/translations.js', [], \Arkhe_Blocks::$file_ver, false );

	// JS用翻訳ファイルの読み込み
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'arkhe-blocks-lang', 'arkhe-blocks', ARKHE_BLOCKS_PATH . 'languages' );
	}

	// その他、グローバル変数も紐づけておく
	wp_localize_script( 'arkhe-blocks-lang', 'arkbSettings', arkb_get_setting_vars() );
}


/**
 * 管理画面・エディターで使うグローバル変数
 * 移動時はbinに注意
 */
function arkb_get_setting_vars() {
	return [
		'isArkhe' => IS_ARKHE_THEME,
		'isPro'   => \Arkhe_Blocks::IS_PRO,
		//''   => 'arkhe', // phpcs:ignore
	];
}
