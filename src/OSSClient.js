class OSSClient {
		
	constructor() {}

	tokenRepository = {
		
	}

	dataSources = {
			ossinsights: {
					endpoint: 'https://ossinsights.com',
					token: 'ossinsights'
			},
			graphQL: {
					endpoint: 'https://graphql.com',
					token: 'ghauth'
			},
			rest: {
					endpoint: 'https://rest.com',
					token: 'ghauth'
			},
			bigquery: {
					endpoint: 'https://bigquery.com',
					token: 'google?'
			},
			gitguru: {
					endpoint: 'https://gitguru.com',
					token: 'none'
			}
	}
}