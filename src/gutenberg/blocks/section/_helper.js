/**
 * スタイルをセットする関数
 */
export const getBlockStyle = (attributes) => {
	const {
		textColor,
		height,
		heightPC,
		heightSP,
		paddingPC,
		paddingSP,
		isRepeat,
		media,
		bgSize,
		//
	} = attributes;

	const style = {};

	// textColorがセットされているか
	if (textColor) style.color = textColor;

	// 内部minheight
	if ('custom' === height) {
		if (heightPC) {
			style['--arkb-section-minH'] = heightPC;
		}
		if (heightSP) {
			style['--arkb-section-minH--sp'] = heightSP;
		}
	}

	// 内部padding用の変数
	const _varPadPC = `${paddingPC.top} ${paddingPC.right} ${paddingPC.bottom} ${paddingPC.left}`;
	const _varPadSP = `${paddingSP.top} ${paddingSP.right} ${paddingSP.bottom} ${paddingSP.left}`;
	style['--arkb-section-padding'] = _varPadPC;
	style['--arkb-section-padding--sp'] = _varPadSP;

	// リピート背景画像
	if (isRepeat && media.url) {
		style.backgroundImage = `url(${media.url})`;
		style.backgroundRepeat = 'repeat';

		if (bgSize) {
			style.backgroundSize = bgSize;
		}
	}

	return style;
};

export const getColorStyle = ({ bgColor, bgGradient, opacity }) => {
	if (!bgGradient && !bgColor) return null;
	const style = {};

	// グラデーションかどうか
	if (bgGradient) {
		style.background = bgGradient;
	} else {
		style.backgroundColor = bgColor || null;
	}
	style.opacity = (opacity * 0.01).toFixed(2);
	return style;
};

export const getSvgData = (svgData) => {
	const svgLevel = svgData.level || 0;
	if (0 === svgLevel) {
		return {
			...svgData,
			height: 0,
			isReverse: false,
		};
	}

	// vwに合わせて 100 >> 10.0
	const svgHeight = (svgLevel * 0.1).toFixed(1);
	return {
		...svgData,
		height: Math.abs(svgHeight), // 絶対値
		isReverse: 0 > svgLevel, // 負の値かどうか
	};
};

/**
 *
 * 旧 getBlockStyle v2
 */
export const getBlockStyleV2 = (attributes) => {
	const {
		textColor,
		height,
		heightPC,
		heightSP,
		paddingPC,
		paddingSP,
		isRepeat,
		media,
		bgSize,
		//
	} = attributes;

	const style = {};

	// textColorがセットされているか
	if (textColor) style.color = textColor;

	// 内部minheight
	if ('custom' === height) {
		if (heightPC) {
			style['--arkb-section-minH'] = heightPC;
		}
		if (heightSP) {
			style['--arkb-section-minH--sp'] = heightSP;
		}
	}

	// 内部padding用の変数
	const _varPadPC = `${paddingPC.top} ${paddingPC.right} ${paddingPC.bottom} ${paddingPC.left}`;
	const _varPadSP = `${paddingSP.top} ${paddingSP.right} ${paddingSP.bottom} ${paddingSP.left}`;

	// 初期値以外であれば
	if ('4rem 2rem 4rem 2em' !== _varPadPC) {
		style['--arkb-section-padding'] = _varPadPC;
	}
	if ('4rem 2rem 4rem 2em' !== _varPadSP) {
		style['--arkb-section-padding--sp'] = _varPadSP;
	}

	// リピート背景画像
	if (isRepeat && media.url) {
		style.backgroundImage = `url(${media.url})`;
		style.backgroundRepeat = 'repeat';

		if (bgSize) {
			style.backgroundSize = bgSize;
		}
	}

	return style;
};

/**
 * 旧 getBlockStyle v1
 */
export const getBlockStyleV1 = (attributes) => {
	const {
		textColor,
		heightPC,
		heightSP,
		heightUnitPC,
		heightUnitSP,
		isFullscreen,
		padPC,
		padSP,
		padUnitPC,
		padUnitSP,
		isRepeat,
		mediaUrl,
	} = attributes;

	const style = {};

	// textColorがセットされているか
	if (textColor) style.color = textColor;

	// 内部minheight
	if (isFullscreen) {
		style['--arkb-section-minH--pc'] = `100vh`;
		style['--arkb-section-minH--sp'] = `100vh`;
	} else {
		if (heightPC) {
			style['--arkb-section-minH--pc'] = `${heightPC}${heightUnitPC}`;
		}
		if (heightSP) {
			style['--arkb-section-minH--sp'] = `${heightSP}${heightUnitSP}`;
		}
	}

	// 内部padding用の変数
	const _varPadPC = `${padPC}${padUnitPC}`;
	const _varPadSP = `${padSP}${padUnitSP}`;

	if ('4rem 2rem 4rem 2em' !== _varPadPC) {
		style['--arkb-section-pad--pc'] = _varPadPC;
	}
	if ('4rem 2rem 4rem 2em' !== _varPadSP) {
		style['--arkb-section-pad--sp'] = _varPadSP;
	}

	// リピート背景画像
	if (isRepeat && mediaUrl) {
		style.backgroundImage = `url(${mediaUrl})`;
		style.backgroundRepeat = 'repeat';
	}

	return style;
};

/**
 * 旧 getSvgData
 */
export const getSvgDataOld = (svgLevel) => {
	if (0 === svgLevel) {
		return {
			isReverse: false,
			height: 0,
		};
	}
	// vwに合わせて 100 >> 10.0
	const height = (svgLevel * 0.1).toFixed(1);

	return {
		isReverse: 0 > svgLevel, // 負の値かどうか
		height: Math.abs(height), // 絶対値
	};
};
