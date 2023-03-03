<?php
namespace Arkhe_Blocks;

trait Parts {

	/**
	 * テンプレート読み込み
	 *   $path : 読み込むファイルのパス
	 *   $args : 引数として利用できるようにする変数
	 */
	public static function get_part( $path = '', $args = null ) {

		if ( '' === $path ) return '';

		// ファイルまでのパスを取得
		$inc_path = self::get_include_part_path( $path );

		// $inc_path を任意のパスに上書き可能なフック
		if ( has_filter( 'arkhe_blocks_part_path__' . $path ) ) {
			$inc_path = apply_filters( 'arkhe_blocks_part_path__' . $path, $inc_path );
		}

		if ( '' === $inc_path ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				echo 'Not found : part "' . esc_html( $path ) . '"';
			}
			return;
		}

		// パーツ出力
		self::the_part_content( $path, $inc_path, $args );
	}


	/**
	 * パーツテンプレートを見つけてパスを返す
	 */
	public static function get_include_part_path( $path = '' ) {
		// 子テーマから探す
		if ( is_child_theme() ) {
			$inc_path = get_stylesheet_directory() . '/block-parts/' . $path . '.php';
			if ( file_exists( $inc_path ) ) return $inc_path;
		}

		// プラグインファイルから探す
		$inc_path = ARKHE_BLOCKS_PATH . 'block-parts/' . $path . '.php';
		if ( file_exists( $inc_path ) ) return $inc_path;

		return '';
	}


	/**
	 * テンプレート読み込み実行部分
	 */
	public static function the_part_content( $path = '', $include_path = '', $args = null ) {
		if ( has_filter( 'arkhe_blocks_part__' . $path ) ) {
			// フィルターフックがあれば

			ob_start();
			include $include_path;
			$part_content = ob_get_clean();

			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo apply_filters( 'arkhe_blocks_part__' . $path, $part_content, $args );

		} else {

			// フックがなければ、普通にファイルを読み込む
			include $include_path;

		}
	}

	/**
	 * スクロールヒントを取得
	 */
	public static function get_scroll_hint( $context = '' ) {
		$svg = '<svg class="arkb-scrollHint__svg" width="1em" height="1em" viewBox="0 0 32 32" role="img" focusable="false" >' .
				'<path d="M30.4,15.5l-4.5-4.5l-1.1,1.1l3.4,3.4H1.6v1.6h28.8V15.5z" /></svg>';

		return apply_filters(
			'arkb_scroll_hint',
			'<div class="arkb-scrollHint"><span class="arkb-scrollHint__text">' . __( 'Scrollable', 'arkhe-blocks' ) . $svg . '</span></div>',
			$context
		);
	}
}
