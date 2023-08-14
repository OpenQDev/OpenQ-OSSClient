import './DequeSet.js'

/**
 * An interface representing a token queue that allows adding, removing, and retrieving tokens.
 */
interface TokenQueue {

	/**
	 * Adds a token to the queue.
	 *
	 * @param token The token to be added to the queue.
	 */
	void addToken(Token token);

	/**
	 * Removes a specific token from the queue.
	 *
	 * @param token The token to be removed from the queue.
	 */
	void removeToken(Token token);

	/**
	 * Retrieves and removes a token from the front of the queue.
	 *
	 * @return The token at the front of the queue.
	 */
	Token getToken();
}


class InMemoryTokenQueue implements TokenQueue {
	constructor() {
		this.dequeueSet = new DequeueSet();
		this.tokens = [];
	}

	enqueue(token) {
		this.tokens.push(token);
	}

	dequeue() {
		return this.tokens.shift();
	}

	peek() {
		return this.tokens[0];
	}

	isEmpty() {
		return this.tokens.length === 0;
	}
}