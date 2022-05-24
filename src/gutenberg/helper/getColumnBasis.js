/**
 * getColumnBasis
 */
export default (colmunNum) => {
	if (!colmunNum) {
		return null;
	}
	const percent = Math.floor(10000 / colmunNum) / 100;
	return percent + '%';
};
