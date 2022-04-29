/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';
import useInnerBlocksProps from '@compatible/useInnerBlocksProps';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import blockIcon from './icon';
import metadata from './block.json';
import TheControls from './controls';

/**
 * 制限エリアブロック
 */
const blockName = 'ark-block-restrictedArea';
registerBlockType(metadata.name, {
	title: _x('Restricted Area', 'blcok-name', 'arkhe-blocks'),
	description: __(
		'A block that can output content only under specified conditions.',
		'arkhe-blocks'
	),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	edit: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps({
			className: `${blockName}`,
		});
		const innerBlocksProps = useInnerBlocksProps(
			{},
			{
				template: [['core/paragraph']],
				templateLock: false,
				// renderAppender: InnerBlocks.ButtonBlockAppender,
			}
		);
		return (
			<>
				<TheControls {...{ attributes, setAttributes }} />
				<div {...blockProps}>
					{innerBlocksProps.children}
					<div className='arkb-parentSelector'>
						<Icon icon={blockIcon} />
					</div>
				</div>
			</>
		);
	},

	save: () => {
		return <InnerBlocks.Content />;
	},
});
