import prettierConfig from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [".eslintrc.js"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
				sourceType: "module",
			},
			globals: {
				node: true,
				jest: true,
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			prettier: eslintPluginPrettier,
		},
		rules: {
			"prettier/prettier": ["error"],
			"@typescript-eslint/interface-name-prefix": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: true }],
			"@typescript-eslint/no-empty-object-type": ["warn"],
			"@typescript-eslint/no-unused-expressions": "off",
		},
	},
	tseslint.configs.recommended,
	prettierConfig
);
