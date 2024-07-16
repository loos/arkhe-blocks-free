<?php
namespace Arkhe_Blocks;

trait Utility {

	/**
	 * データをサニタイズ
	 */
	public static function get_cleaned_data( $var ) {
		if ( is_array( $var ) ) {
			return array_map( [ __CLASS__, 'get_cleaned_data' ], $var );
		} else {
			return is_scalar( $var ) ? sanitize_text_field( wp_unslash( $var ) ) : $var;
		}
	}


	/**
	 * WodPressのバージョンチェック
	 */
	public static function wpver_is_above( $version ) {
		global $wp_version;
		return ( version_compare( $wp_version, $version . '-beta' ) >= 0 );
	}


	/**
	 * $use の値を取得
	 */
	public static function is_use( $key ) {
		if ( ! isset( self::$use[ $key ] ) ) {
			return false;
		}
		return self::$use[ $key ];
	}


	/**
	 * style属性用のテキストに変換
	 */
	public static function convert_style_props( $styles ) {
		$style = '';
		foreach ( $styles as $key => $value ) {
			if ( '' === $value ) {
				continue;
			}
			$style .= "{$key}:{$value};";
		}

		return $style;
	}


	/**
	 * html用の属性値を生成
	 */
	public static function generate_html_attrs( $attrs = [], $use_trim = true ) {
		$attr_str = '';
		foreach ( $attrs as $name => $val ) {
			if ( false === $val ) continue;
			if ( 'custom' === $name ) {
				$attr_str .= ' ' . $val;
				continue;
			}
			$attr_str .= ' ' . $name . '="' . esc_attr( $val ) . '"';
		}

		// 最初のスペースをtrimするかそのまま返すか
		if ( $use_trim ) {
			return trim( $attr_str );
		}
		return $attr_str;
	}


	/**
	 * htmlタグを生成
	 */
	public static function generate_html_tag( $tag, $attrs = [], $content = null ) {
		$tag   = esc_attr( $tag );
		$attrs = self::generate_html_attrs( $attrs );

		if ( null === $content ) {
			return "<$tag $attrs>";
		}
		return "<$tag $attrs>" . $content . "</$tag>";
	}


	/**
	 * classnames
	 */
	public static function classnames( $classname, $maybe_adds = [] ) {

		foreach ( $maybe_adds as $val => $flag ) {
			if ( $flag && $val) $classname .= ' ' . $val;
		}
		return $classname;
	}

	/**
	 * カスタム書式セットの旧データからのマイグレーション
	 */
	public static function migrate_custom_format( $data ) {
		// データ1つ目をデフォルトの名前で運用してた時にDBにはない
		if ( ! isset( $data['format_title_1'] ) && isset( $data['format_title_2'] ) ) {
			$data['format_title_1'] = __( 'Custom 01', 'arkhe-blocks' );
		}

		if ( isset( $data['format_title_1'] ) || isset( $data['format_title_2'] ) || isset( $data['format_title_3'] ) ) {
			$data['custom_formats'] = [];

			for ( $i = 1; $i <= 3; $i++ ) {
				if ( ! empty( $data[ 'format_title_' . $i ] ) ) {
					$data['custom_formats'][] = [
						'name' => $data[ 'format_title_' . $i ],
						'slug' => strval( $i ),
					];
				}
				unset( $data[ 'format_title_' . $i ] );
			}
		}

		return $data;
	}

	/**
	 * DB名・フィールド名から、設定画面のタイトルを取得する
	 */
	public static function get_settings_title( $name_key, $key ) {
		if ( 'general' === $name_key && 'palette_colors' === $key ) {
			return __( 'Color Palette', 'arkhe-blocks' );
		}
		if ( 'format' === $name_key && 'custom_formats' === $key ) {
			return __( 'Custom Format', 'arkhe-blocks' );
		}
		if ( 'block' === $name_key && 'block_styles' === $key ) {
			return __( 'Custom Block Style', 'arkhe-blocks' );
		}

		return null;
	}

	/**
	 * getPositionClassName() のPHP版
	 */
	// public static function get_position_class( $position = '', $default = '' ) {
	// 	if ( ! $position || $default === $position) return '';
	// 	$position_classes = [
	// 		'top left'       => 'top-left',
	// 		'top center'     => 'top-center',
	// 		'top right'      => 'top-right',
	// 		'center left'    => 'center-left',
	// 		'center center'  => 'center-center',
	// 		'center right'   => 'center-right',
	// 		'bottom left'    => 'bottom-left',
	// 		'bottom center'  => 'bottom-center',
	// 		'bottom right'   => 'bottom-right',
	// 	];
	// 	return $position_classes[ $position ];
	// }

}
