import { __experimentalUnitControl, UnitControl } from '@wordpress/block-editor';

/**
 * export UnitControl
 *     https://github.com/WordPress/gutenberg/blob/3da717b8d0/packages/components/src/unit-control/index.js
 */
const __UnitControl = typeof UnitControl === 'function' ? UnitControl : __experimentalUnitControl;

export default __UnitControl;
