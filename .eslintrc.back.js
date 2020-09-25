module.exports = {
	extends: ['airbnb-base'],
	env: {
		es6: true,
		node: true,
		jest: true
	},
	globals: {},
	rules: {
		'array-element-newline': ['error', 'always'],
		'comma-dangle': 0,
		'consistent-return': ['error', { 'treatUndefinedAsUnspecified': false }],
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'lines-around-comment': ['error', { 'beforeBlockComment': true, 'beforeLineComment': true }],
		'max-len': 0,
		'node/no-unpublished-require': 0,
		'no-console': 0,
		'no-empty': ['error', { 'allowEmptyCatch': true }],
		'no-tabs': 0,
		'no-throw-literal': 0,
		'no-underscore-dangle': 0,
		'no-process-exit': 0,
		'padded-blocks': 0,
		'quotes': ['error', 'single', { 'avoidEscape': true }],
		'require-atomic-updates': 0
	}
};
