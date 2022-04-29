/**
 * @WordPress dependencies
 */
import { memo } from '@wordpress/element';
/**
 * @others dependencies
 */
import classnames from 'classnames';

const blockName = 'ark-block-section';

/**
 * <BgMedia />
 */
export default memo(({ media, mediaSP, focalPoint, focalPointSP, isRepeat }) => {
	const mediaUrl = media.url;
	const mediaUrlSP = mediaSP.url;

	if (isRepeat) {
		return null;
	}
	if (!mediaUrl) {
		return null;
	}

	const style = {};
	if (!!focalPoint) {
		const pX = (focalPoint.x * 100).toFixed();
		const pY = (focalPoint.y * 100).toFixed();

		style['--arkb-object-position'] = `${pX}% ${pY}%`;
	}

	if (!!focalPointSP) {
		const pX = (focalPointSP.x * 100).toFixed();
		const pY = (focalPointSP.y * 100).toFixed();
		style['--arkb-object-position--sp'] = `${pX}% ${pY}%`;
	}

	let bgMmediaPC = null;
	if ('video' === media.type) {
		bgMmediaPC = (
			<video
				src={mediaUrl}
				className={classnames(`${blockName}__video arkb-obf-cover`, {
					'arkb-only-pc': !!mediaUrlSP,
				})}
				width={media.width || null}
				height={media.height || null}
				autoPlay
				loop
				playsInline
				muted
			></video>
		);
	} else if ('image' === media.type) {
		bgMmediaPC = (
			<img
				src={mediaUrl}
				alt={media.alt || ''}
				className={classnames(`${blockName}__img arkb-obf-cover`, {
					'arkb-only-pc': !!mediaUrlSP,
				})}
				width={media.width || null}
				height={media.height || null}
			/>
		);
	}

	let bgMmediaSP = null;
	if (mediaUrlSP) {
		if ('video' === mediaSP.type) {
			bgMmediaSP = (
				<video
					className={`${blockName}__video arkb-obf-cover arkb-only-sp`}
					src={mediaUrlSP}
					width={mediaSP.width || null}
					height={mediaSP.height || null}
					autoPlay
					loop
					playsInline
					muted
				></video>
			);
		} else if ('image' === mediaSP.type) {
			bgMmediaSP = (
				<img
					className={`${blockName}__img arkb-obf-cover arkb-only-sp`}
					src={mediaUrlSP}
					alt={mediaUrlSP.alt || ''}
					width={mediaSP.width || null}
					height={mediaSP.height || null}
				/>
			);
		}
	}

	// if (!mediaSrc) return '';

	return (
		<div className={`${blockName}__media arkb-absLayer`} style={style || null}>
			{bgMmediaPC}
			{bgMmediaSP}
		</div>
	);
});
