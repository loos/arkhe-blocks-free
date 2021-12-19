document.addEventListener('DOMContentLoaded', function () {
	const linkBoxs = document.querySelectorAll('[data-arkb-linkbox]');
	function clickLink(e) {
		// コンテンツ内のリンクがクリックされた時。（ a.click() もここにくる ）
		if ('A' === e.target.tagName) {
			return;
		}

		e.preventDefault();
		const a = e.currentTarget.querySelector('[data-arkb-link]');
		if (null === a) return;

		// a.onclick = (event) => {
		// 	event.stopPropagation();
		// 	return true;
		// };

		a.click();
	}

	linkBoxs.forEach((elem) => {
		elem.addEventListener('keydown', function (e) {
			// Enterの時のみ
			if (e.keyCode === 13) {
				clickLink(e);
			}
		});
		elem.addEventListener('click', function (e) {
			clickLink(e);
		});
	});
});
