document.addEventListener('DOMContentLoaded', function () {
	/**
	 * olのstart属性に対応する
	 */
	const olWithStart = document.querySelectorAll('ol[start], ol[reversed]');
	for (let i = 0; i < olWithStart.length; i++) {
		const ol = olWithStart[i];
		const start = ol.getAttribute('start');
		const reversed = null !== ol.getAttribute('reversed');

		if (reversed) {
			// 逆順
			ol.style.counterReset = start
				? `arkb-ct ${parseInt(start) + 1}`
				: `arkb-ct ${ol.childNodes.length + 1}`;
		} else {
			// 昇順(通常時)
			ol.style.counterReset = start ? `arkb-ct ${parseInt(start) - 1}` : `arkb-ct`;
		}
	}
});
