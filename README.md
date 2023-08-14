# OpenQ-OSSClient

The OpenQ-OSSClient is composed of the `OSSClient` which uses a `TokenQueue`

## OSSClient

The OSSClient is a wrapper around several Github data sources.

The OSSClient handles:

- **AUTHENTICATION** to the data sources by choosing the correct token type
- **RATE LIMIT BUSTING** by swapping access tokens when the current one is exhausted **OR** switching IP address
- **PAGINATION** by making multiple requests to the data source when necessary
- **BACKOFFS and RETRIES** by retrying requests that fail due to rate limiting or other errors
- **CACHING** by storing results in a local database
- **STANDARD FORMATTING of RESPONSES** regardless of the initial data source

## Data Sources

The following is a list of data sources along with their endpoints and authentication tokens.

- **localhost**
  - Description: A mock server located at `__tests__/server.js` which has it's own rate limiting for testing
  - Endpoint: `http://localhost:3000`
  - Token: `mock_token`
  - API Documentation

- **graphQL**
  - Description: Github GraphQL API
  - Endpoint: `https://api.github.com/graphql`
  - Token: `ghauth`
  - API Documentation

- **rest**
  - Endpoint: `https://api.github.com`
  - Token: `ghauth`
  - API Documentation

- **codesearch**
  - Endpoint: `https://api.github.com/search/code?VARIABLES`
  - Token: `ghauth`
  - API Documentation

- **bigquery**
  - Endpoint: `https://bigquery.googleapis.com/bigquery/v2/projects/YOUR_PROJECT_ID/queries`
  - Token: `gcloudauth`
  - API Documentation

- **ossinsights**
  - Endpoint: `https://api.ossinsight.io/v1`
  - Token: `none`
  - Rate Limiting: 600 requests per hour per IP address
  - [API Documentation](https://ossinsight.io/docs/api)

## TokenQueue

The `TokenQueue` is the "dumb pipe" used by the `OSSClient` to get access tokens just in time for a network call.

The `TokenQueue` is backed by a `DequeueSet` and houses all logic for adding and removing tokens.

The `OSSClient` calls `TokenQueue.getToken` whenever it needs a token.

Based on the response, `OSSClient` may tell `TokenQueue` to either A) send the token it just used to the back of the queue, or B) remove the token entirely

The `TokenQueue`, as an interface, can have multiple implemnetations.

For example, the `InMemoryTokenQueue` and the `RedisTokenQueue`