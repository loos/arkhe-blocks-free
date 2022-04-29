/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { SelectControl } from '@wordpress/components';
import { memo } from '@wordpress/element';

/**
 * ArkbImageSizeSelect
 */
export default memo(({ imgId, imgSize, onChange, className = '' }) => {
	if (!imgId) return null;

	// 設定可能なメディアサイズのリストを取得
	const imageSizes = useSelect(
		(select) => select('core/block-editor').getSettings().imageSizes,
		[]
	);

	if (!imageSizes) return null;

	// メディアのサイズデータを取得
	const thisImgSizes = useSelect(
		(select) => {
			const media = select('core').getMedia(imgId);
			if (!media) return {};
			return media.media_details.sizes;
		},
		[imgId]
	);

	// セレクトボックス用optionsを imageSizes と thisImgSizes から生成
	const sizeOptions = imageSizes
		.filter(({ slug }) => {
			return thisImgSizes[slug]?.source_url;
		})
		.map(({ name, slug }) => ({
			value: slug,
			label: name,
		}));

	return (
		<SelectControl
			className={className}
			label={__('Image size')}
			value={imgSize || 'full'}
			options={sizeOptions}
			onChange={(newSizeSlug) => {
				const newSizeData = thisImgSizes[newSizeSlug];
				if (newSizeData) {
					onChange(newSizeSlug, newSizeData);
				}
			}}
		/>
	);
});
