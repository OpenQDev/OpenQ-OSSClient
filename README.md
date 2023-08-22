# OpenQ-OSSClient

The OpenQ-OSSClient is composed of the `OSSClient` which uses a `TokenQueue`.

## OSSClient

The OSSClient is a wrapper around several Github data sources.

The OSSClient handles:

- **AUTHENTICATION** to the data sources by choosing the correct URL and authentication token type
- **RETRIES** by retrying requests that fail due to rate limiting or other errors
- **TOKEN ROTATION** by swapping access tokens when the current one is exhausted
- **IP MASKING** (UNDER CONSTRUCTION) by routing the request through a hopper
- **PAGINATION** by making multiple requests to the data source when necessary
- **CACHING** by storing results in a local database
- **STANDARD FORMATTING of RESPONSES** regardless of the initial data source

## Data Sources

The following is a list of data sources along with their endpoints and authentication tokens.

- **Github GraphQL API**
  - Description: Github GraphQL API
  - Endpoint: `https://api.github.com/graphql`
  - Token: `ghauth`
  - API Documentation

- **Github REST API**
  - Endpoint: `https://api.github.com`
  - Token: `ghauth`
  - API Documentation

- **Github Codesearch API**
  - Endpoint: `https://api.github.com/search/code?VARIABLES`
  - Token: `ghauth`
  - API Documentation

- **Github Archive BigQuery Public Dataset**
  - Endpoint: `https://bigquery.googleapis.com/bigquery/v2/projects/YOUR_PROJECT_ID/queries`
  - Token: `gcloudauth`
  - API Documentation
  - Rate Limiting: The first 1 TB per month is free, subject to [query pricing details](https://cloud.google.com/bigquery/pricing#analysis_pricing_models)
	- Resources
  	- https://cloud.google.com/blog/topics/public-datasets/github-on-bigquery-analyze-all-the-open-source-code
		- https://gist.github.com/arfon/49ca314a5b0a00b1ebf91167db3ff02c
	- NOT PURSUING: Even basic queries must process many GB, rate limit too low

- **OSSInsights** 
  - Endpoint: `https://api.ossinsight.io/v1`
  - Token: `none`
  - Rate Limiting: 600 requests per hour per IP address
  - [API Documentation](https://ossinsight.io/docs/api)

- **Open Source Insights**
  - Endpoint: `https://docs.deps.dev/api/v3alpha/`
  - Token: `none`
  - Rate Limiting: 600 requests per hour per IP address
  - [API Documentation](https://docs.deps.dev/)

- **localhost**
  - Description: A mock server located at `__tests__/server.js` which has it's own rate limiting for testing
  - Endpoint: `http://localhost:3000`
  - Token: `mock_token`
  - API Documentation

## TokenQueue

The `TokenQueue` is the "dumb pipe" used by the `OSSClient` to get access tokens just in time for a network call.

The `TokenQueue` is backed by a `DequeueSet` and houses all logic for adding and removing tokens.

The `OSSClient` calls `TokenQueue.getToken` whenever it needs a token.

Based on the response, `OSSClient` may tell `TokenQueue` to either A) send the token it just used to the back of the queue, or B) remove the token entirely

The `TokenQueue`, as an interface, can have multiple implemnetations.

For example, the `InMemoryTokenQueue` and the `RedisTokenQueue`

## How To

### Add an Authorization Token

It's actually just hardcoded as `your-api-secret` so don't change that

Tokens are stored IN MEMORY in the container/process. So they are whiped out between deploys.

```bash
curl -X POST "https://drmdev.openq.dev/ossclient/add-token" \
-H "Authorization: Bearer your-api-secret" \ 
-H "Content-Type: application/json" \
-d '{ "token": "TOKEN" }'
```

Successful response should look like: `{"message":"Token added successfully"}`

### Proxy a Github Request Through It to get the token rotation and retry benefits

```bash
curl -X POST "https://drmdev.openq.dev/ossclient" \
-H "Content-Type: application/json" \
-d '{ "query": "{ viewer { login } }" }'
```

Successful response should look like: `{"data":{"viewer":{"login":"<the login of the PAT being used>"}}}`

testing
