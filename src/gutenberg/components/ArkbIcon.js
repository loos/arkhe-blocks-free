/**
 * @WordPress dependencies
 */
import { createElement } from '@wordpress/element';

/**
 * @Inner dependencies
 */
import ArkbSVG from '@components/ArkbSVG';

/**
 * @Others dependencies
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import * as IoIcons from 'react-icons/io5';
import * as FiIcons from 'react-icons/fi';

/**
 * ArkbIcon
 *     ArkbSVG | FontAwesomeIcon | ReactIcon | <i> のいずれかを返す。
 */
const ArkbIcon = ({ icon, className = '', size = '1em', useItagIfNull = true }) => {
	if (!icon) return null;

	if (-1 !== icon.indexOf('arkb-svg-')) {
		return <ArkbSVG icon={icon} className={className} size={size} />;
	}

	// Font Awesome
	if (null !== icon.match(/^fa/) && -1 !== icon.indexOf(' fa-')) {
		return <FontAwesomeIcon icon={icon} className={className} width={size} height={size} />;
	}

	// ReactIcon
	if (icon.startsWith('Fi')) {
		return createElement(FiIcons[icon], { size, className });
	} else if (icon.startsWith('Io')) {
		return createElement(IoIcons[icon], { size, className });
	}

	// svgに変換できなければiタグで返す
	return useItagIfNull ? <i className={classnames(icon, className)}></i> : null;
};

export default ArkbIcon;
