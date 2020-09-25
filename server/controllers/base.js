// MIT LICENSE

/**
 * Required
 */

const app = require('../index');
const { generateComponentState } = require('./helper');

/**
 * Routes
 */

app.get('/', async (req, res) => {

	// Create component data
	const data = generateComponentState(req, res);

	// Stringify data for parsing
	data.dataString = JSON.stringify(data);

	// Render component
	res.render('pages/home', data);
});

/**
 * Error Routes
 */

app.use(async (req, res) => {

	// Create component data
	const data = generateComponentState(req, res);

	// Stringify data for parsing
	data.dataString = JSON.stringify(data);

	// Render component
	res.status(404).render('pages/404', data);
});

app.use(async (err, req, res, next) => { /* eslint-disable-line no-unused-vars */ /* next is required */

	// Create component data
	const data = generateComponentState(req, res);

	// Stringify data for parsing
	data.dataString = JSON.stringify(data);

	// Render component
	res.status(500).render('pages/500', data);
});
