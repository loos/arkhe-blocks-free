/**
 * @Inner dependencies
 */
import ArkbSVG from '@components/ArkbSVG';

/**
 * @Others dependencies
 */
import classnames from 'classnames';
import { FontAwesomeIcon as FontAwesomeIcon5 } from './fa5/react-fontawesome';
import { library5 } from './fa5/fontawesome-svg-core';
import { fas } from './fa5/free-solid-svg-icons';
import { fab } from './fa5/free-brands-svg-icons';
import { far } from './fa5/free-regular-svg-icons';
library5.add(fas, fab, far);
// console.log('loaded fa5 library');

/**
 * 普通のアイコンと fontawesome を分けるための関数
 */
const splitIconClass = (iconClass) => {
	let iconData;

	// FAだったら配列が返される
	if (null !== iconClass.match(/fas |fab |far /)) {
		iconData = iconClass.split(' ');
		iconData[1] = iconData[1].replace('fa-', '');
		return iconData;
	}

	// FA以外は普通に文字列のまま
	return iconClass;
};

/**
 * ArkheIcon
 */
export const ArkheIcon = ({ icon, className, size = '' }) => {
	if (!icon) return null;

	let theIcon = null;
	// Font Awesome
	if (null !== icon.match(/^fa/) && -1 !== icon.indexOf(' fa-')) {
		const classes = splitIconClass(icon);
		theIcon = <FontAwesomeIcon5 icon={classes} className={className || null} />;
		return theIcon;
	}

	if (-1 !== icon.indexOf('arkb-svg-')) {
		return <ArkbSVG icon={icon} className={className || null} size={size} />;
	}

	return <i className={classnames(className, icon)}></i>;
};
