<?php
if ( ! defined( 'ABSPATH' ) ) exit;

// PHP 8から使える str_contains()
if ( ! function_exists( 'str_contains' ) ) {
	function str_contains( $haystack, $needle ) {
		return '' !== $needle && false !== mb_strpos( $haystack, $needle );
	}
}
