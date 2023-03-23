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

		// floorで切り捨て。桁数指定できないので100倍してから戻す
		$percent = floor( 100 * 100 / $colmunNum ) / 100;
		return $percent . '%';
	}


	/**
	 * 各ブロックスタイルを共通の変数へ仕分けし、生成したunique_idを返す
	 */
	public static function generate_dynamic_block_styles( $styles, $args = [] ) {

		if ( empty( $styles ) ) return false;

		$args = array_merge([
			'unique_id' => '',
			'prefix'    => '',
			'with'      => '',
			'after'     => '',
		], $args );

		$unique_id = $args['unique_id'];
		foreach ( ['all', 'pc', 'sp', 'tab', 'mb' ] as $size ) {
			$_styles = $styles[ $size ] ?? null;
			if ( $_styles ) {
				$_css = \Arkhe_Blocks::convert_style_props( $_styles );
				if ( $_css ) {
					// wp_unique_id() は実際にCSSがある場合に初めて呼び出す
					$unique_id = $unique_id ?: wp_unique_id( $args['prefix'] );

					$with  = $args['with'];
					$after = $args['after'] ? ' ' . $args['after'] : '';

					self::$dynamic_styles[ $size ] .= ".{$unique_id}{$with}{$after}" . '{' . $_css . '}';
				}
			}
		}
		return $unique_id;
	}


	/**
	 * CSSコードの圧縮
	 */
	public static function minify_css( $css ) {

		$css_replaces = [];

		// @charsetの除去
		// $css_replaces[ '/@charset \"(utf|UTF)-8\";/' ] = '';

		// コメントの除去
		$css_replaces['/(\/\*!.*?\*\/|\"(?:(?!(?<!\\\)\").)*\"|\'(?:(?!(?<!\\\)\').)*\')|\/\*.*?\*\//s'] = '${1}';

		// 1つ以上連続する空白文字列の置換
		$css_replaces['/(\/\*!.*?\*\/|\"(?:(?!(?<!\\\)\").)*\"|\'(?:(?!(?<!\\\)\').)*\')\s*|\s+/s'] = '${1} ';

		// 一括置換
		$css = preg_replace( array_keys( $css_replaces ), array_values( $css_replaces ), $css );

		return $css;
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

		return '<style id="arkb-dynamic-styles">' . self::minify_css( $css ) . '</style>';
	}


	/**
	 * 設定可能なカスタムスタイル
	 */
	public static function get_custom_styles() {
		// バージョンアップ時にキャッシュキーが変わるようにする。 ajax側と合わせることに注意。
		$cache_key = \Arkhe_Blocks::CACHE_KEYS['get_custom_styles'] . '_' . \Arkhe_Blocks::$version;
		$css       = get_transient( $cache_key ) ?: '';

		if ( ! $css ) {

			// CSS変数で管理する値
			$body_props = [];

			// ボタン
			$btn_default_radius = \Arkhe_Blocks::get_data( 'block', 'btn_default_radius' ) ?: '0';
			if ( '0' !== $btn_default_radius ) {
				$body_props[] = "--arkb-btn-radius:{$btn_default_radius}px";
				// $css .= 'body{--arkb-btn-radius: ' . $btn_default_radius . 'px}';
			}
			$btn_default_color = \Arkhe_Blocks::get_data( 'block', 'btn_default_color' ) ?: '';
			if ( '' !== $btn_default_color ) {
				$body_props[] = "--arkb-btn-color--default:{$btn_default_color}";
				// $css .= 'body{--arkb-btn-color--default: ' . $btn_default_color . '}';
			}

			$toc_color = \Arkhe_Blocks::get_data( 'block', 'toc_color' ) ?: '';
			if ( '' !== $toc_color ) {
				$body_props[] = "--arkb-toc-color:{$toc_color}";
			}

			// マーカー
			$marker_color       = \Arkhe_Blocks::get_data( 'format', 'marker_color' ) ?: '';
			$marker_style       = \Arkhe_Blocks::get_data( 'format', 'marker_style' ) ?: '';
			$marker_start       = \Arkhe_Blocks::get_data( 'format', 'marker_start' ) ?: '';
			$is_marker_txt_bold = \Arkhe_Blocks::get_data( 'format', 'is_marker_txt_bold' ) ?: '';
			$marker_styles      = [
				'fill' =>
					'linear-gradient(transparent var(--arkb-marker-start), var(--arkb-marker-color) 0)',
				'stripe' =>
					'repeating-linear-gradient(-45deg, var(--arkb-marker-color), var(--arkb-marker-color) 2px, transparent 2px, transparent 3px) no-repeat 0 var(--arkb-marker-start)',
				// 'stripe-bold' =>
				// 	'repeating-linear-gradient(-45deg, var(--arkb-marker-color), var(--arkb-marker-color) 3px, transparent 3px, transparent 5px) no-repeat 0 var(--arkb-marker-start)',
			];

			$body_props[] = '--arkb-marker-color:' . $marker_color;
			$body_props[] = '--arkb-marker-start:' . $marker_start;
			$body_props[] = '--arkb-marker-style:' . $marker_styles[ $marker_style ];
			if ( $is_marker_txt_bold ) {
				$body_props[] = '--arkb-marker-txt-weight:700';
			}

			// CSS変数をbodyに展開
			$css .= 'body{' . implode( ';', $body_props ) . '}';

			// カラーパレット
			$palette_colors = \Arkhe_Blocks::get_data( 'general', 'palette_colors' );
			if ( is_array( $palette_colors ) ) {
				foreach ( $palette_colors as $data ) {
					if ( ! is_array( $data ) ) continue;

					$slug  = $data['slug'] ?? '';
					$color = $data['color'] ?? '';

					// カラー、スラッグのいずれかが空の場合はスキップ
					if ( ! $slug || ! $color  ) continue;

					$css .= ".has-arkb-{$slug}-color {color:{$color} !important;}";
					$css .= ".has-arkb-{$slug}-background-color {background-color:{$color} !important;}";
				}
			}

			// カスタム書式用CSS
			$custom_formats = \Arkhe_Blocks::get_data( 'format', 'custom_formats' );
			if ( is_array( $custom_formats ) ) {
				foreach ( $custom_formats as $data ) {
					if ( ! is_array( $data ) || ! isset( $data['css'] ) ) continue;
					$css .= $data['css'];
				}
			}

			// 旧 カスタム書式用CSS
			$custom_format_css = \Arkhe_Blocks::get_data( 'format', 'custom_format_css' );
			if ( $custom_format_css ) {
				$css .= $custom_format_css;
			}

			// カスタムブロックスタイル用CSS
			$block_styles = \Arkhe_Blocks::get_data( 'block', 'block_styles' );
			if ( is_array( $block_styles ) ) {
				foreach ( $block_styles as $data ) {
					if ( ! is_array( $data ) || ! isset( $data['css'] ) ) continue;
					$css .= $data['css'];
				}
			}

			$css = self::minify_css( $css );
			set_transient( $cache_key, $css, 7 * DAY_IN_SECONDS );
		}

		return $css;
	}

	/**
	 * 設定で追加されるエディター用スタイル
	 */
	public static function get_toolbar_styles() {
		return '#wpadminbar .ab-icon.-arkhe {' .
			'display: flex;align-items: center;box-sizing: border-box;height: 100%;' .
		'}' .
		'#wpadminbar .ab-icon.-arkhe svg{' .
			'width: 20px !important;fill: currentColor;' .
		'}';
	}


	/**
	 * 設定で追加されるエディター用スタイル
	 */
	public static function get_ex_editor_styles() {

		$css = '';

		$show_spacer_guide = \Arkhe_Blocks::get_data( 'block', 'show_spacer_guide' );
		if ( $show_spacer_guide ) {
			$css .= '[data-type="core/spacer"]{' .
				'background-clip: padding-box;' .
				'background-image: repeating-linear-gradient(-45deg, rgba(160, 170, 180, .15), rgba(160, 170, 180, .15) 2px, transparent 2px, transparent 7px);' .
				'border: solid 1px rgba(160, 180, 200, .2);' .
				'border-image: repeating-linear-gradient(45deg, rgba(160, 180, 200, .5), rgba(160, 180, 200, .5) 6px, transparent 6px, transparent 9px) 1;' .
			'}';
		}

		$css = self::minify_css( $css );
		return $css;
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
