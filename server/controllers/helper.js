// MIT LICENSE

/**
 * Handlers
 */

const generateComponentState = (req) => {

	// Create entity
	const entity = (req.isCore) ? {
		domain: 'myapp.com',
		website: 'https://www.myapp.com',
		name: 'My App',
		entities: [
			'https://www.instagram.com/myapp',
		],
		twitter: {
			handle: '@mytwitterhandle'
		}
	} : {
		domain: req.entity.domain,
		logo: req.entity.logo,
		favicon: req.entity.favicon,
		mobile_icon: req.entity.mobile_icon,
		social_cover: req.entity.social_cover,
		icon_base: req.entity.icon_base,
		website: req.entity.website,
		name: req.entity.name,
		entities: req.entity.entities,
		twitter: req.entity.twitter,
		colors: req.entity.colors
	};

	// Update component state
	const data = {
		canonicalUrl: `${req.protocol}://${req.hostname}${req.path}`,
		state: {
			analytics: {
				gtmId: (req.isCore) ? process.env.GTM_ID : req.entity.analytics.gtm_id
			},
			query: req.query,
			isCore: req.isCore,
			entity
		}
	};

	// Return state
	return data;
};

/**
 * Exports
 */

module.exports = {
	generateComponentState
};
