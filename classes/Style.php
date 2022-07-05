<?php
namespace Arkhe_Blocks;

class Style {

	// breakpoints
	public static $breakpoints = [
		'l' => '1000px',
		's' => '600px',
	];

	// ブロックの動的スタイル
	public static $dynamic_styles = [
		'all' => '',
		'pc'  => '',
		'sp'  => '',
		'tab' => '',
		'mb'  => '',
	];

	/**
	 * $dynamic_styles にコードを追加
	 */
	public static function add_dynamic_styles( $css, $media = '' ) {
		if ( is_array( $css ) ) {
			foreach ( $css as $_m => $_code ) {
				if ( isset( self::$dynamic_styles[ $_m ] ) ) {
					self::$dynamic_styles[ $_m ] .= $_code;
				}
			}
		} elseif ( $media ) {
			if ( isset( self::$dynamic_styles[ $media ] ) ) {
				self::$dynamic_styles[ $media ] .= $css;
			};
		}
	}


	/**
	 * gapデータを追加
	 */
	public static function add_the_gap_styles( $the_styles, $gap, $gapTab = null, $gapMB = null ) {

		if ( ! empty( $gap ) ) {
			$the_styles['all']['--arkb-gap--x'] = $gap['x'] ?? '';
			$the_styles['all']['--arkb-gap--y'] = $gap['y'] ?? '';
		}
		if ( ! empty( $gapTab ) ) {
			$the_styles['sp']['--arkb-gap--x'] = $gapTab['x'] ?? '';
			$the_styles['sp']['--arkb-gap--y'] = $gapTab['y'] ?? '';
		}
		if ( ! empty( $gapMB ) ) {
			$the_styles['mb']['--arkb-gap--x'] = $gapMB['x'] ?? '';
			$the_styles['mb']['--arkb-gap--y'] = $gapMB['y'] ?? '';
		}

		return $the_styles;
	}


	/**
	 * layoutデータを追加
	 */
	public static function add_the_layout_styles( $the_styles, $layout, $default = [] ) {

		$defaultLayout = array_merge([
			// attributesとしての初期値
			'orientation'                => 'horizontal',
			'justifyContent'             => 'left',
			'verticalAlignment'          => 'center',
			'flexWrap'                   => 'wrap',

			// CSSでデフォルト値を持っているプロパティ（動的出力しない値）
			'justify-content'            => '',
			'align-items'                => '',
			'flex-wrap'                  => '',
		], $default);

		// phpcs:disabled WordPress.PHP.YodaConditions.NotYoda
		$orientation       = $layout['orientation'] ?? $defaultLayout['orientation'];
		$justifyContent    = $layout['justifyContent'] ?? $defaultLayout['justifyContent'];
		$verticalAlignment = $layout['verticalAlignment'] ?? $defaultLayout['verticalAlignment'];
		$flexWrap          = $layout['flexWrap'] ?? $defaultLayout['flexWrap'];

		// justifyContent を flex用の値へ
		if ( $justifyContent === 'left' ) {
			$justifyContent = 'flex-start';
		} elseif ( $justifyContent === 'right' ) {
			$justifyContent = 'flex-end';
		}

		$layoutStyles = [];
		if ( $orientation === 'horizontal' ) {
			// verticalAlignmentをalign-items用の値へ
			if ( $verticalAlignment === 'top' ) {
				$verticalAlignment = 'flex-start';
			} elseif ( $verticalAlignment === 'bottom' ) {
				$verticalAlignment = 'flex-end';
			}

			$layoutStyles['justify-content'] = $justifyContent;
			$layoutStyles['align-items']     = $verticalAlignment;
			$layoutStyles['flex-wrap']       = $flexWrap;

		} else {
			// 縦並びのときは$justifyContent の値を'align-items'にセット。
			$layoutStyles['align-items'] = $justifyContent;
			$layoutStyles['flex-wrap']   = $flexWrap;
		}

		// デフォルト値と同じものは削除
		foreach ( $layoutStyles as $key => $value ) {
			if ( $value === $defaultLayout[ $key ] ) {
				unset( $layoutStyles[ $key ] );
			}
		}

		$the_styles__all   = $the_styles['all'] ?? [];
		$the_styles['all'] = array_merge( $the_styles__all, $layoutStyles );

		return $the_styles;
	}



	/**
	 * padding計算
	 */
	public static function get_custom_padding( $padding, $null_val = '', $default_val = '' ) {
		$pd_top    = $padding['top'] ?? $null_val ?: $null_val;
		$pd_right  = $padding['right'] ?? $null_val ?: $null_val;
		$pd_bottom = $padding['bottom'] ?? $null_val ?: $null_val;
		$pd_left   = $padding['left'] ?? $null_val ?: $null_val;
		$pd_value  = "$pd_top $pd_right $pd_bottom $pd_left";

		// 初期値と同じ場合
		if ( $default_val && $default_val === $pd_value ) {
			return '';
		}

		return $pd_value;
	}


	/**
	 * 列数から%計算
	 */
	public static function get_column_width( $colmunNum ) {
		if ( ! $colmunNum ) {
			return '';
		}
		$colmunNum = (int) $colmunNum;
		$percent   = round( 100 / $colmunNum, 2 );
		return $percent . '%';
	}


	/**
	 * 各ブロックスタイルを共通の変数へ仕分けする
	 */
	public static function sort_dynamic_block_styles( $id_prefix, $styles, $width = '' ) {
		if ( empty( $styles ) ) return false;

		$unique_id = '';

		foreach ( ['all', 'pc', 'sp', 'tab', 'mb' ] as $size ) {
			$_styles = $styles[ $size ] ?? null;
			if ( $_styles ) {
				$_css = \Arkhe_Blocks::convert_style_props( $_styles );
				if ( $_css ) {
					// wp_unique_id() は実際にCSSがある場合に初めて呼び出す
					$unique_id = $unique_id ?: wp_unique_id( $id_prefix );

					self::$dynamic_styles[ $size ] .= ".{$unique_id}{$width}" . '{' . $_css . '}';
				}
			}
		}
		return $unique_id;
	}


	/**
	 * styleタグで吐き出すCSSを生成
	 */
	public static function get_dynamic_style_tag() {
		$css    = '';
		$styles = self::$dynamic_styles;

		$_css = $styles['all'] ?? null;
		if ( $_css ) {
			$css .= $_css;
		}

		// PC サイズ: 1000px ~
		$_css = $styles['pc'] ?? null;
		if ( $_css ) {
			$css .= '@media (min-width: ' . self::$breakpoints['l'] . ') {' . $_css . '}';
		}

		// SP (not PC) サイズ (tab横 以下): ~ 1000px
		$_css = $styles['sp'] ?? null;
		if ( $_css ) {
			$css .= '@media not all and (min-width: ' . self::$breakpoints['l'] . ') {' . $_css . '}';
		}

		// Tablet サイズ以上: 600px ~
		$_css = $styles['tab'] ?? null;
		if ( $_css ) {
			$css .= '@media (min-width: ' . self::$breakpoints['l'] . ') {' . $_css . '}';
		}

		// Mobile サイズ: ~ 600px
		$_css = $styles['mb'] ?? null;
		if ( $_css ) {
			$css .= '@media not all and (min-width: ' . self::$breakpoints['s'] . ') {' . $_css . '}';
		}

		if ( ! $css ) {
			return '';
		}
		return '<style id="arkb-dynamic-styles">' . $css . '</style>';
	}


	/**
	 * styleタグ用のテキストに変換
	 */
	// public static function convert_styles_to_css( $selector, $styles ) {
	// 	$style = '';

	// 	$_styles = $styles['all'] ?? null;
	// 	if ( $_styles ) {
	// 		$style .= $selector . '{' . \Arkhe_Blocks::convert_style_props( $_styles ) . '}';
	// 	}

	// 	// not PC (tab横 以下)
	// 	$_styles = $styles['sp'] ?? null;
	// 	if ( $_styles ) {
	// 		$style .= '@media not all and (min-width: ' . self::$breakpoints['l'] . ') {' .
	// 			$selector . '{' . \Arkhe_Blocks::convert_style_props( $_styles ) . '}' .
	// 		'}';
	// 	}

	// 	// mobile
	// 	$_styles = $styles['mb'] ?? null;
	// 	if ( $_styles ) {
	// 		$style .= '@media not all and (min-width: ' . self::$breakpoints['s'] . ') {' .
	// 			$selector . '{' . \Arkhe_Blocks::convert_style_props( $_styles ) . '}' .
	// 		'}';
	// 	}
	// 	return $style;
	// }

}
