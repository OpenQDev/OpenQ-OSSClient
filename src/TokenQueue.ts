import { DequeueSet } from './types'
import InMemoryDequeueSet from './dequeueset/InMemoryDequeueSet'
import RedisDequeueSet from './dequeueset/RedisDequeueSet'
import { StorageType } from './types'

export default class TokenQueue {
	dequeueSet: DequeueSet;
	
	constructor(type: StorageType) {
		if (type == StorageType.InMemory) {
			this.dequeueSet = new InMemoryDequeueSet();
		} else if (type == StorageType.Redis) {
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
	addToken(token: string) {
		this.dequeueSet.enqueue(token);
	}

	/**
	 * Retrieves and removes a token from the front of the queue.
	 *
	 * @return The token at the front of the queue.
	 */
	getToken(): string | null {
		return this.dequeueSet.peek();
	}

	/**
	 * Removes a specific token from the queue.
	 *
	 * @param token The token to be removed from the queue.
	 */
	removeToken(token: string): void {
		this.dequeueSet.remove(token);
	}

	/**
	 * Sends a specific token to the back of the queue.
	 *
	 * @param token The token to be moved to the back of the queue.
	 */
	sendToBack(token: string): void {
		return this.dequeueSet.sendToBack(token);
	}
}