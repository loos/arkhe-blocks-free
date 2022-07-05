<?php
namespace Arkhe_Blocks;

trait Utility {


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
			$style .= "${key}:${value};";
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
