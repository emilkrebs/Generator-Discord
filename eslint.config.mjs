import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			indent: ['error', 'tab'],
			'linebreak-style': 'off',
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
		},
	}
);
