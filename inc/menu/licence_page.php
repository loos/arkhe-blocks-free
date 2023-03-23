<?php
defined( 'ABSPATH' ) || exit;

use \Arkhe_Blocks\Licence as Licence;

/**
 * ライセンス認証ページページの内容
 */
$licence_link = 'https://arkhe-theme.com/ja/product/arkhe-pro-pack/';
$licence_key  = Licence::$licence_key;
$licence_data = Licence::$licence_data;

// 1分以内に認証を行った回数
$check_count = get_transient( 'arkb_licence_check_count' ) ?: 0;

// nonceキーチェック
$nonce_verified = false;
// if ( isset( $_POST['arkb_licence_nonce'] ) && isset( $_POST['arkb_licence_key'] ) ) {

// 	$nonce       = sanitize_text_field( wp_unslash( $_POST['arkb_licence_nonce'] ) );
// 	$licence_key = sanitize_text_field( wp_unslash( $_POST['arkb_licence_key'] ) );

// 	if ( ! wp_verify_nonce( $nonce, 'arkb_licence_nonce' ) ) exit( 'Nonce could not be verified.' );

// 	set_transient( 'arkb_licence_check_count', ++$check_count, 60 );

// 	update_option( \Arkhe_Blocks::DB_NAMES['licence_key'], $licence_key );

// 	// ライセンスチェック
// 	delete_transient( \Arkhe_Blocks::CACHE_KEYS['licence'] ); // キャッシュは削除してデータ取り直す
// 	$licence_data = Licence::get_licence_data( $licence_key );
// }

if ( isset( $_POST['_arkb_nonce'] ) ) {
	$nonce = \Arkhe_Blocks::get_cleaned_data( $_POST['_arkb_nonce'] ); // phpcs:ignore WordPress.Security
	if ( ! wp_verify_nonce( $nonce, 'arkb_licence_nonce' ) ) exit( 'Nonce error.' );

	$submit_type = \Arkhe_Blocks::get_cleaned_data( filter_input( INPUT_POST, 'submit_type' ) );
	$licence_key = \Arkhe_Blocks::get_cleaned_data( filter_input( INPUT_POST, 'arkb_licence_key' ) );

	if ( 'deauthorize' === $submit_type ) {

		update_option( \Arkhe_Blocks::DB_NAMES['licence_key'], '' );
		delete_transient( \Arkhe_Blocks::CACHE_KEYS['licence'] ); // キャッシュも削除
		$licence_data = [];
		$licence_key  = '';

	} elseif ( 'license_check' === $submit_type && $licence_key ) {

		set_transient( 'arkb_licence_check_count', ++$check_count, 60 );

		// ライセンスキーを保存
		update_option( \Arkhe_Blocks::DB_NAMES['licence_key'], $licence_key );

		// キャッシュは削除してからライセンスチェック
		delete_transient( \Arkhe_Blocks::CACHE_KEYS['licence'] );
		$licence_data = Licence::get_licence_data( $licence_key );
	}
}


// ライセンスデータ
$is_error   = isset( $licence_data['error'] ) ? (bool) $licence_data['error'] : false;
$the_status = isset( $licence_data['status'] ) ? (int) $licence_data['status'] : 0;
$the_owner  = isset( $licence_data['owner'] ) ? $licence_data['owner'] : '';
$the_email  = isset( $licence_data['email'] ) ? $licence_data['email'] : '';

// ライセンスチェック の結果
$result      = '';
$result_type = 'normal';
if ( (int) $check_count > 5 ) {
	// 試行回数多すぎる時
	$result_type = 'warning';
	$result      = __( 'Too many authentication requests. Please try again later.', 'arkhe-blocks' );
} elseif ( $licence_data ) {

	if ( $is_error ) {
		// エラーが帰ってきた場合

		$result_type = 'error';
		$result      = $licence_data['message'];

	} elseif ( 0 === $the_status ) {
		// エラーではないがライセンスが停止中だった時

		$result_type = 'error';
		$result      = __( 'This license key is currently disabled.', 'arkhe-blocks' );

	} elseif ( 1 === $the_status ) {
		// 個人ライセンスが確認できた時

		$result_type = 'ok';
		$result      = __( 'A valid license key has been confirmed.', 'arkhe-blocks' );
		$result     .= sprintf(
			// translators: %s is email;
			__( 'This is "%1$s" and is owned by %2$s.', 'arkhe-blocks' ),
			__( 'Personal License', 'arkhe-blocks' ),
			$the_email
		);

	} elseif ( 2 === $the_status ) {
		// 制作ライセンスが確認できた時

		$result_type = 'ok';
		$result      = __( 'A valid license key has been confirmed.', 'arkhe-blocks' );
		$result     .= sprintf(
			// translators: %s is owner;
			__( 'This is "%1$s" and is owned by %2$s.', 'arkhe-blocks' ),
			__( 'Creator License', 'arkhe-blocks' ),
			$the_owner ?: $the_email
		);
	}
}

$has_licence = 1 === $the_status || 2 === $the_status;
?>
<div class="arkb-menu__section">
	<div class="arkb-menu__section__inner" data-style="box">
		<div class="arkb-menu__licence">
			<form method="POST">
				<?php wp_nonce_field( 'arkb_licence_nonce', '_arkb_nonce' ); ?>

				<?php if ( ! $has_licence ) : ?>
					<div class="components-base-control">
						<div class="components-base-control__field">
							<input class="components-text-control__input" type="text"  name="arkb_licence_key" value="<?=esc_attr( $licence_key ); ?>">
						</div>
					</div>
					<?php if ( 'warning' !== $result_type ) : ?>
						<button type="submit" name="submit_type" value="license_check" class="components-button is-primary"><?=esc_html__( 'Check License', 'arkhe-blocks' )?></button>
					<?php endif; ?>
					<p class="arkb-menu-help">
						<?php
							echo sprintf(
								// translators: %s is link;
								esc_html__( 'Purchasing "%s" will allow you to update all Arkhe plugins to the latest version.', 'arkhe-blocks' ),
								'<a href="' . esc_url( $licence_link ) . '">' . esc_html__( 'Arkhe License', 'arkhe-blocks' ) . '</a>'
							);
						?>
					</p>
				<?php else : ?>
					<span style="line-height: 32px;padding: 0 8px;"><?php echo esc_attr( substr( $licence_key, 0, 4 ) ); ?>************</span>
					<button type="submit" name="submit_type" value="deauthorize" class="button button-secondary">
						<?php esc_html_e( 'Deauthorize', 'arkhe-blocks' ); ?>
					</button>
				<?php endif; ?>
			</form>
			<?php if ( $result ) : ?>
				<div class="__notice -<?=esc_attr( $result_type ); ?>"><?=esc_html( $result ); ?></div>
			<?php endif; ?>
		</div>
	</div>
</div>
