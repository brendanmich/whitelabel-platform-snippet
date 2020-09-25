// MIT LICENSE

/**
 * Requires
 */

const PartnerConfig = require('../../partner.config');

/**
 * Handler
 */

const generateEntityForRequest = (req) => {

	// Check for existing entity
	if (req.entity != null && req.entity.id !== 'core') return req.entity;

	// Check for partner by origin
	let currentPartner = null;
	if (req != null && req.headers != null) {
		const { origin, host } = req.headers;
		for (let i = 0; i < PartnerConfig.partners.length; i += 1) {
			if (origin != null && `https://${PartnerConfig.partners[i].domain}` === origin) {
				currentPartner = PartnerConfig.partners[i];
				break;
			} else if (host != null && PartnerConfig.partners[i].domain === host) {
				currentPartner = PartnerConfig.partners[i];
				break;
			}
		}
	}

	// Set default partner for testing purposes only
	if (process.env.ENV === 'development' && process.env.IS_CORE_APP === 'false') {
		[currentPartner] = PartnerConfig.partners;
	}
	return currentPartner;
};

const handlePartnerConfigForRequest = (req, res, next) => {

	// Determine if partner or core
	const currentPartner = generateEntityForRequest(req);

	// Set partner state
	req.isCore = (currentPartner == null);
	req.entity = (currentPartner == null) ? {
		id: 'core',
		name: 'My App',
		domain: 'myapp.com'
	} : currentPartner;

	// Move to next
	next();
};

/**
 * Exports
 */

module.exports = {
	generateEntityForRequest,
	handlePartnerConfigForRequest
};
