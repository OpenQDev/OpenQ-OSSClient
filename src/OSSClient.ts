import TokenQueue from "./TokenQueue";
import axios, { AxiosResponse } from "axios"
import { StorageType, DataSources } from './types';

/**
 * The OSSClient is a wrapper around several data sources on open-source software
 * The OSSClient handles:
 * - authentication to the data sources by choosing the correct token type
 * - rate limiting by switching to a new token when the current one is exhausted
 * - pagination by making multiple requests to the data source when necessary
 * - errors by retrying requests that fail due to rate limiting or other errors
 * - caching by storing results in a local database
 * - formatting by returning results in a consistent format
 */

export default class OSSClient {
		
	tokenQueue: TokenQueue;
	
	constructor(type: StorageType) {
		this.tokenQueue = new TokenQueue(type);
	}

	dataSources: DataSources = {
		localhost: {
			endpoint: 'http://localhost:3000',
			token: 'mock_token'
		},
		graphQL: {
				endpoint: 'https://api.github.com/graphql',
				token: 'ghauth'
		},
		rest: {
				endpoint: 'https://api.github.com',
				token: 'ghauth'
		},
		codesearch: {
			endpoint: 'https://api.github.com/search/code?VARIABLES',
			token: 'ghauth'
		},
		// OSSInsights Public API has no authentication yet, but rate limits to 600 requests/hour/IP address
		// Docs: https://ossinsight.io/docs/api
		ossinsights: {
			endpoint: 'https://api.ossinsight.io/v1',
			token: 'none'
	 	}
	}

	addToken(token: string): void {
		this.tokenQueue.addToken(token);
	}

	removeToken(token: string): void {
		this.tokenQueue.removeToken(token);
	}

	rotateToken(): string | null {
		return this.tokenQueue.rotateToken();
	}

	makeRequest = async (query: any, maxRetries = 3) => {
		const dataSourceKey: string = "graphQL";

		if (!this.dataSources.hasOwnProperty(dataSourceKey)) {
			throw new Error('Invalid data source key');
		}

		const dataSource = this.dataSources[dataSourceKey];
		let authToken = this.tokenQueue.getToken(); // Get the first token from the deque

		if (authToken === null) {
			throw new Error('No tokens available');
		}

		let retryCount = 0;

		while (retryCount < maxRetries) {
			try {
				const response: AxiosResponse = await axios.post(
					dataSource.endpoint,
					{ query },
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				);

				return response.data;
			} catch (error: any) {
				if (error.response && error.response.status === 401) {
					// Rotate the token only if the response is a 401 Unauthorized
					authToken = this.rotateToken();
				} else {
					// Rethrow other errors
					throw new Error(`Request failed: ${error.message}`);
				}

				retryCount++;
				
				// Wait for a moment before retrying (you can adjust the duration)
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}

		throw new Error(`Request failed after ${maxRetries} retries`);
	};
}