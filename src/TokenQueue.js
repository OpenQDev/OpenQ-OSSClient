const DequeueSet = require('./DequeueSet.js')
const InMemoryDequeueSet = require('./InMemoryDequeueSet.js')
const RedisDequeueSet = require('./RedisDequeueSet.js')

class TokenQueue implements TokenQueue {
	dequeueSet DequeueSet;
	
	constructor() {
		if (type == 'in-memory') {
			this.dequeueSet = new InMemoryDequeueSet();
		} else if (type == 'redis') {
			this.dequeueSet = new RedisDequeueSet();
		} else {
			throw new Error('Unknown TokenQueue initialization type')
		}
	}

	/**
	 * Adds a token to the queue.
	 *
	 * @param token The token to be added to the queue.
	 */
	addToken(token) {
		this.dequeueSet.enqueue(token);
	}

	/**
	 * Retrieves and removes a token from the front of the queue.
	 *
	 * @return The token at the front of the queue.
	 */
	getToken() {
		return this.dequeueSet.peek();
	}

	/**
	 * Removes a specific token from the queue.
	 *
	 * @param token The token to be removed from the queue.
	 */
	removeToken(token) {
		this.dequeueSet.remove(token);
	}

	/**
	 * Sends a specific token to the back of the queue.
	 *
	 * @param token The token to be moved to the back of the queue.
	 */
	sendToBack(token) {
		return this.dequeueSet.sendToBack();
	}
}