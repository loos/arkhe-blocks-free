import { useSelect } from '@wordpress/data';

/**
 * カスタムタクソノミーのリストを取得
 */
export const getCustomTaxonomies = () => {
	return useSelect((select) => {
		const taxonomies = select('core').getTaxonomies({
			per_page: -1,
			context: 'view',
		});

		const taxonomyList = [];

		if (taxonomies !== null) {
			for (const tax of taxonomies) {
				// 表示しないタクソノミー
				const ignoreTypes = ['category', 'post_tag', 'nav_menu'];
				if (ignoreTypes.indexOf(tax.slug) !== -1) continue;

				// 配列に追加
				taxonomyList.push({
					label: tax.name,
					value: tax.slug,
				});
			}
		}
		return taxonomyList;
	}, []);
};

// 全ポストタイプを取得
export const getPostTypes = () => {
	return useSelect((select) => {
		const postTypes = select('core').getPostTypes({ per_page: -1 });

		if (postTypes === null) return [];

		const postTypeList = [];
		for (const pt of postTypes) {
			// publicな投稿タイプかどうか
			const isViewable = pt.viewable;

			// 表示しない投稿タイプ
			const ignoreTypes = ['attachment'];

			//配列につっこむ
			if (isViewable && ignoreTypes.indexOf(pt.slug) === -1) {
				postTypeList.push({
					label: pt.name,
					value: pt.slug,
				});
			}
		}

		return postTypeList;
	}, []);
};
