/**
 * @WordPress dependencies
 */
// import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useEffect } from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * @Internal dependencies
 */
import ArkbMarginControl from '@components/ArkbMarginControl';
import { getIsShowMarginBtn, setOlListCounter } from './helper.js';

/**
 * HOC
 */
addFilter(
	'editor.BlockEdit',
	'arkb-hook/add-controls',
	createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			const { name, attributes, setAttributes, isSelected, clientId } = props;
			const isOlBlock = 'core/list' === name && attributes.ordered;

			/**
			 * ページロード時に一度だけ発火したい処理 ( isSelected のバリデーションを通す前に一度実行 )
			 */
			useEffect(() => {
				if (isOlBlock) {
					setOlListCounter(clientId, attributes.start, attributes.reversed);
				}
			}, [clientId]);

			// ここから先は全部 isSelected の時のみ追加
			if (!isSelected) {
				return <BlockEdit {...props} />;
			}

			// リストブロック用の処理
			if (isOlBlock) {
				setOlListCounter(clientId, attributes.start, attributes.reversed);
			}

			// マージンコントロールを表示するかどうか
			const isShowMarginBtn = isSelected ? getIsShowMarginBtn(name) : false;
			return (
				<>
					<BlockEdit {...props} />
					{isShowMarginBtn && (
						<BlockControls>
							<ArkbMarginControl
								className={attributes.className}
								setAttributes={setAttributes}
							/>
						</BlockControls>
					)}

					{/* <InspectorControls>
					<MarginPanel className={attributes.className} setAttributes={setAttributes} />
				</InspectorControls> */}
				</>
			);
		};
	}, 'addMarginControls'),
	10
);
