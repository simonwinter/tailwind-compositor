import { iTailwindTheme, ICompositorConfig, iFontOpenType } from './types';
var flattenDeep = require('lodash.flattendeep');

import { styleFontFamily, styleText } from './styles';

/**
 *
 *
 */
export const createTextStyles = ({
	theme,
	e,
	addUtilities,
}: {
	theme: iTailwindTheme;
	e: any;
	addUtilities: Function;
}) => {
	const {
		root,
		baseline,
		leading,
		fonts,
		type,
		options,
	}: ICompositorConfig = theme('compositor');

	const familyStyles = fonts.map((font: iFontOpenType) => {
		return {
			[`.font-${font.key}`]: styleFontFamily({ font }),
		};
	});

	const leadingScale = Array.from(new Array(leading + 1), (v, i) => i);

	const sizeStyles = flattenDeep(
		fonts.map((font: iFontOpenType) =>
			type.map((size, sizeIdx) => {
				return leadingScale.map(lead => {
					//
					// create baseline styles
					const outputTextStyle = styleText({
						font: font,
						root: root,
						baseline: baseline,
						size: size,
						leading: lead,
						snap: options.snap,
						useRem: options.useRem,
					});

					// apply if variant type is enabled
					const textStyles = {
						[`&.${e(`text-${sizeIdx}/${lead}`)}`]: outputTextStyle,
					};

					return {
						[`.font-${font.key}`]: {
							...textStyles,
						},
					};
				});
			})
		)
	);
	addUtilities(familyStyles, []);
	addUtilities(sizeStyles, ['responsive']);
};

export default createTextStyles;
