module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"]
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser"
      }
    },
    {
			files: ["*.ts"],
			parser: "@typescript-eslint/parser",
      parserOptions: {
        parser: "@typescript-eslint/parser"
      },
      rules: {
				semi: [
					"warn",
					"always"
				],
				indent: [
					"warn",
					2,
					{
						"SwitchCase": 1
					}
				],
				"no-trailing-spaces": [
					"warn"
				],
				"comma-dangle": [
					"warn",
					"never"
				],
				"quotes": [
					"warn",
					"double",
					{ "allowTemplateLiterals": true }
				],
				"no-unused-vars": ["off"],
				"no-unused-labels": ["off"],
				"@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
			}
    }
  ]
};
