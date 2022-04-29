/* eslint-disable no-lonely-if */

/**
 * マージンコントロールを表示するブロックかどうか
 */
export const getIsShowMarginBtn = (name) => {
	// コア以外に表示するブロック
	const validBlocks = ['loos-hcb/code-block'];
	const isValidBlocks = -1 !== validBlocks.indexOf(name);

	if (isValidBlocks) return true;

	// コアブロックかどうか
	const isCore = -1 !== name.indexOf('core/');
	if (!isCore) return false;

	// 除去するブロック
	const removalBlocks = ['core/shortcode', 'core/html', 'core/block'];
	const isRemovalBlocks = -1 !== removalBlocks.indexOf(name);

	if (isRemovalBlocks) return false;

	// ok.
	return true;
};

/**
 * OLリストのカウンターセット
 */
export const setOlListCounter = (clientId, start, reversed) => {
	const iframeEditor = document.querySelector('[name="editor-canvas"]');
	const ownerDocument = iframeEditor ? iframeEditor.contentWindow.document : window.document;

	setTimeout(() => {
		const ol = ownerDocument.querySelector('ol[data-block="' + clientId + '"]'); // wp5.5 ~
		if (null === ol) return;

		if (reversed) {
			// 逆順
			ol.style.counterReset = start
				? `arkb-ct ${parseInt(start) + 1}`
				: `arkb-ct ${ol.childNodes.length + 1}`;
		} else {
			// 昇順(通常時)
			ol.style.counterReset = start ? `arkb-ct ${parseInt(start) - 1}` : `arkb-ct`;
		}
	}, 5);
};
