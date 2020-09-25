// MIT LICENSE

/**
 * Requires
 */

// Environment
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Modules
const express = require('express');
require('express-async-errors');
const fs = require('fs');
const helmet = require('helmet');
const webpackAssets = require('express-webpack-assets');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const Constants = require('../Constants');
const PartnerConfig = require('../partner.config');

// Middleware
const { handlePartnerConfigForRequest } = require('./middleware/partner');

/**
 * Configure app
 */

const app = express();
module.exports = app;
app.set('view engine', 'ejs');

/**
 * Set partner configuration
 */

app.use(handlePartnerConfigForRequest);

/**
 * Set view render location
 */

const viewsLocation = (process.env.ENV !== 'development') ? 'build/views' : 'views';
app.set('views', path.join(__dirname, `../${viewsLocation}`));

/**
 * Configure body parser for post responses
 */

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/**
 * Parse cookies for requests
 */

app.use(cookieParser());

/**
 * Set header protections with Helmet
 */

app.use(helmet());

/**
 * Enable trust proxy (Heroku)
 */

app.enable('trust proxy');

/**
 * Cross-domain middleware to prevent unidentified calls
 */

app.use(async (req, res, next) => {
	if (process.env.ENABLE_ORIGIN_WHITELIST === 'true') {
		const { origin } = req.headers;
		const whitelist = Constants.CORE_DOMAIN_WHITELIST;
		PartnerConfig.partners.forEach((partner) => {
			whitelist.push(`https://${partner.domain}`);
		});
		if (origin && whitelist.indexOf(origin) === -1) {
			res.status(403).end();
		} else {
			next();
		}
	} else {
		next();
	}
});

/**
 * Security upgrade middleware to redirect http calls to https
 */

if (process.env.ENV !== 'development') {
	app.use(async (req, res, next) => {
		if (req.get('X-Forwarded-Proto') === 'https' || req.hostname === 'localhost') {
			next();
		} else if (req.get('X-Forwarded-Proto') !== 'https' && req.get('X-Forwarded-Port') !== '443') {
			res.redirect(301, `https://${req.hostname}${req.url}`);
		}
	});
}

/**
 * Create hashed manifest for js/css
 */

app.use(webpackAssets('./config/webpack-assets.json', {
	devMode: process.env.ENV === 'development',
}));

/**
 * Serve the default favicon
 */

app.use(favicon(path.join(__dirname, '../src/img', 'favicon.ico')));

/**
 * Serve external assets
 */

app.get('/robots.txt', (req, res) => {
	let robots = fs.readFileSync(`${__dirname}/../build/external/robots.txt`, 'utf8');
	robots = robots.replace(/%ENTITY_DOMAIN%/g, req.entity.domain);
	res.type('text/plain');
	res.send(robots);
});
app.get('/manifest.json', (req, res) => {
	let manifest = fs.readFileSync(`${__dirname}/../build/external/manifest.json`, 'utf8');
	manifest = manifest.replace(/%ENTITY_NAME%/g, req.entity.name);
	res.type('application/json');
	res.send(manifest);
});

/**
 * Serve static assets from the /public folder if in development mode
 */

if (process.env.ENV === 'development') {
	app.use('/public/img', express.static('src/img'));
	app.use('/public/external', express.static('src/external'));
}

/**
 * Serve controllers
 */

require('./controllers/base');

/**
 * Set up port and listener
 */

const serverPort = process.env.PORT || 1337;
const appPort = process.env.PORT || 3000;
const httpServer = http.createServer(app);
httpServer.listen(serverPort, () => {
	console.log(`whitelabel-platform-snippet running on port ${appPort}.`);
});
