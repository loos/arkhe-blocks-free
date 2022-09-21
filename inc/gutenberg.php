<?php
namespace Arkhe_Blocks\Gutenberg;

defined( 'ABSPATH' ) || exit;

/**
 * ブロックの読み込み
 */
add_action( 'init', __NAMESPACE__ . '\register_blocks' );
function register_blocks() {

	// 通常ブロックの読み込み
	foreach ( \Arkhe_Blocks::$blocks as $block_name ) {
		register_block_type_from_metadata( ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/' . $block_name );
	}

	// ダイナミックブロックの読み込み
	foreach ( \Arkhe_Blocks::$dynamic_blocks as $block_name ) {
		require_once __DIR__ . '/blocks/' . $block_name . '.php';
	}

	// スタイルの登録 ( memo: $depsを指定して共通CSSより後ろで読み込ませたいのでphp側で処理している )
	$deps = is_admin() ? 'arkhe-blocks-editor' : 'arkhe-blocks-front';
	foreach ( \Arkhe_Blocks::$blocks_has_style as $name ) {
		wp_register_style(
			"arkhe-blocks-{$name}-style",
			ARKHE_BLOCKS_URL . "dist/gutenberg/blocks/{$name}/index.css",
			[ $deps ],
			\Arkhe_Blocks::$file_ver
		);
	}

	// カスタムブロックスタイルの登録
	$block_styles = \Arkhe_Blocks::get_data( 'block', 'block_styles' );
	if ( is_array( $block_styles ) ) {
		foreach ( $block_styles as $data ) {
			if ( ! is_array( $data ) ) continue;
			if ( empty( $data['block'] ) || empty( $data['name'] ) || empty( $data['slug'] ) ) continue;
			register_block_style(
				$data['block'],
				[
					'name'  => $data['slug'],
					'label' => $data['name'],
				]
			);
		}
	}
}


/**
 * ブロックカテゴリー追加
 */
$hookname = \Arkhe_Blocks::wpver_is_above( '5.8' ) ? 'block_categories_all' : 'block_categories';
add_filter( $hookname, __NAMESPACE__ . '\add_block_categories', 5 );
function add_block_categories( $categories ) {
	$my_category = [
		[
			'slug'  => 'arkhe-blocks',
			'title' => __( 'Arkhe Blocks', 'arkhe-blocks' ),
			'icon'  => null,
		],
	];

	// ウィジェットの前にカテゴリーを追加する
	foreach ( $categories as $index => $data ) {
		$slug = $data['slug'] ?? '';
		if ( 'widgets' === $slug ) {
			array_splice( $categories, $index, 0, $my_category );
			break;
		}
	}

	return $categories;
}
