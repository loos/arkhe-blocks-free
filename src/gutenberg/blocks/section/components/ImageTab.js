/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, FocalPointPicker } from '@wordpress/components';
import { Icon, video, image } from '@wordpress/icons';

/**
 * @Inner dependencies
 */
import ArkbDeviceTab from '@components/ArkbDeviceTab';
import { DEFAULT_MEDIA_ATTRS } from '../config';
import ArkbImageSizeSelect from '@components/ArkbImageSizeSelect';

const MediaPreview = ({ useFocalPicker, url, type, focalPoint, setFocalPoint }) => {
	if (!url) {
		return (
			<div className='arkb-imgPreview -noimage'>
				<Icon icon={image} /> / <Icon icon={video} />
			</div>
		);
	}

	if (useFocalPicker) {
		return <FocalPointPicker url={url} value={focalPoint} onChange={setFocalPoint} />;
	}
	return (
		<div className='arkb-imgPreview'>
			{'image' === type && <img src={url} alt='' />}
			{'video' === type && <video src={url} />}
		</div>
	);
};

const getNewMediaAttrs = (newMedia) => {
	return {
		id: newMedia.id,
		url: newMedia.url,
		// alt: newMedia.alt,
		type: newMedia.type,
		width: newMedia.width,
		height: newMedia.height,
		size: undefined,
	};
};

/**
 * export ImageTab
 */
export default ({ attrs, setAttributes }) => {
	const { media, mediaSP, focalPoint, focalPointSP, isRepeat, opacity } = attrs;
	const mediaUrl = media.url;
	const mediaUrlSP = mediaSP.url;

	// mediaデータのアップデート
	const setMedia = (device, newAttrs) => {
		if ('pc' === device) {
			setAttributes({
				media: {
					...media,
					...newAttrs,
				},
			});
		} else if ('sp' === device) {
			setAttributes({
				mediaSP: {
					...mediaSP,
					...newAttrs,
				},
			});
		}
	};

	const removeMedia = (device) => {
		if ('pc' === device) {
			setAttributes({
				media: DEFAULT_MEDIA_ATTRS,
				focalPoint: undefined,
			});
		} else if ('sp' === device) {
			setAttributes({
				mediaSP: DEFAULT_MEDIA_ATTRS,
				focalPointSP: undefined,
			});
		}
	};

	// サイズを変えた時の処理
	const updateImageSizePC = useCallback(
		(newSizeSlug, newSizeData) => {
			setMedia('pc', {
				size: newSizeSlug,
				url: newSizeData?.source_url,
				width: newSizeData?.width,
				height: newSizeData?.height,
			});
		},
		[media]
	);

	const updateImageSizeSP = useCallback(
		(newSizeSlug, newSizeData) => {
			setMedia('sp', {
				size: newSizeSlug,
				url: newSizeData?.source_url,
				width: newSizeData?.width,
				height: newSizeData?.height,
			});
		},
		[mediaSP]
	);

	const imageSettingPC = (
		<>
			<MediaPreview
				useFocalPicker={!isRepeat}
				url={mediaUrl}
				type={media.type || ''}
				focalPoint={focalPoint}
				setFocalPoint={(val) => {
					setAttributes({ focalPoint: val });
				}}
			/>
			<div className='arkb-btns--media'>
				<MediaUploadCheck>
					<MediaUpload
						value={media.id}
						onSelect={(newMedia) => {
							if (newMedia) {
								setMedia('pc', getNewMediaAttrs(newMedia));
								if (100 === opacity) {
									setAttributes({ opacity: 50 });
								}
							} else {
								removeMedia('pc');
							}
						}}
						allowedTypes={['image', 'video']}
						render={({ open }) => (
							<Button isPrimary onClick={open}>
								{mediaUrl
									? __('Change media', 'arkhe-blocks')
									: __('Select media', 'arkhe-blocks')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				{mediaUrl && (
					<Button
						text={__('Delete', 'arkhe-blocks')}
						isSecondary
						className='__delete'
						onClick={() => {
							removeMedia('pc');
						}}
					/>
				)}
			</div>
			{'image' === media.type && (
				<ArkbImageSizeSelect
					className='arkb-ctrl--mt--s'
					imgId={media.id}
					imgSize={media.size}
					onChange={updateImageSizePC}
				/>
			)}
		</>
	);

	const imageSettingSP = isRepeat ? null : (
		<>
			<MediaPreview
				useFocalPicker={false}
				url={mediaUrlSP}
				type={mediaSP.type || ''}
				focalPoint={focalPointSP}
				setFocalPoint={(val) => {
					setAttributes({ focalPointSP: val });
				}}
			/>
			<div className='arkb-btns--media'>
				<MediaUploadCheck>
					<MediaUpload
						value={mediaSP.id}
						onSelect={(newMedia) => {
							if (newMedia) {
								setMedia('sp', getNewMediaAttrs(newMedia));
							} else {
								removeMedia('sp');
							}
						}}
						allowedTypes={['image', 'video']}
						render={({ open }) => (
							<Button isPrimary onClick={open}>
								{mediaUrlSP
									? __('Change media', 'arkhe-blocks')
									: __('Select media', 'arkhe-blocks')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				{mediaUrlSP && (
					<Button
						text={__('Delete', 'arkhe-blocks')}
						isSecondary
						className='__delete'
						onClick={() => {
							removeMedia('sp');
						}}
					/>
				)}
			</div>
			{'image' === mediaSP.type && (
				<ArkbImageSizeSelect
					className='arkb-ctrl--mt--s'
					imgId={mediaSP.id}
					imgSize={mediaSP.size}
					onChange={updateImageSizeSP}
				/>
			)}
		</>
	);

	let addClass = `-media`;
	if (!mediaUrl) {
		addClass += ' has-no-pcimg';
	}

	return (
		<ArkbDeviceTab
			className={addClass}
			controlPC={imageSettingPC}
			controlSP={imageSettingSP}
			isHideTab={isRepeat}
		/>
	);
};
