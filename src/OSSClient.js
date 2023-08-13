const OrderedSet = require("./OrderedSet")

class OSSClient {
		
	tokenDeque = new OrderedSet();
	
	constructor() {
		this.tokenDeque.enqueue('valid_token_1');
		this.tokenDeque.enqueue('valid_token_2');
		this.tokenDeque.enqueue('valid_token_3');
	}

	dataSources = {
		localhost: {
			endpoint: 'http://localhost:3000',
			token: 'mock_token'
		},
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

  makeRequest = async (url, dataSourceKey) => {
    if (!this.dataSources.hasOwnProperty(dataSourceKey)) {
      throw new Error('Invalid data source key');
    }

    const dataSource = this.dataSources[dataSourceKey];
    const authToken = this.tokenDeque.peek(); // Get the first token from the deque

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  };
}

// Example usage
const client = new OSSClient();
const dataSourceKey = 'localhost';
const url = client.dataSources[dataSourceKey].endpoint;

client.makeRequest(url, dataSourceKey)
  .then(data => {
    console.log('Response:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });