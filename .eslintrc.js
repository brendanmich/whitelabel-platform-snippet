const frontPaths = ['src/**/*.js'];

module.exports = {
	parserOptions: {
		ecmaVersion: 2018,
	},
	overrides: [
		{
			files: ['*.js'],
			excludedFiles: frontPaths,
			...require('./.eslintrc.back.js'),
		},
		{
			files: frontPaths,
			...require('./.eslintrc.front.js'),
		},
	]
};
