/**
 * Represents a token queue that utilizes different storage types for managing tokens.
 */
import { DequeueSet, StorageType } from './types';
import InMemoryDequeueSet from './dequeueset/InMemoryDequeueSet';
import RedisDequeueSet from './dequeueset/RedisDequeueSet';

export default class TokenQueue {
  /**
   * @property {DequeueSet} dequeueSet - An instance of a dequeue set implementation.
   */
  dequeueSet: DequeueSet;

  /**
   * Constructs a new instance of TokenQueue based on the specified storage type.
   * @param {StorageType} type - The storage type for initializing the token queue.
   * @throws {Error} Throws an error if an unknown initialization type is provided.
   */
  constructor(type: StorageType) {
    if (type == StorageType.InMemory) {
      this.dequeueSet = new InMemoryDequeueSet();
    } else if (type == StorageType.Redis) {
      this.dequeueSet = new RedisDequeueSet();
    } else {
      throw new Error('Unknown TokenQueue initialization type');
    }
  }

  /**
   * Adds a token to the token queue.
   * @param {string} token - The token to be added.
   */
  addToken(token: string) {
    this.dequeueSet.enqueue(token);
  }

  /**
   * Retrieves the next token from the token queue without removing it.
   * @returns {string | null} The next token, or null if the queue is empty.
   */
  getToken(): string | null {
    return this.dequeueSet.peek();
  }

  /**
   * Removes a token from the token queue.
   * @param {string} token - The token to be removed.
   */
  removeToken(token: string): void {
    this.dequeueSet.remove(token);
  }

  /**
   * Moves a token to the back of the token queue if it exists.
   * @param {string} token - The token to be moved to the back.
   */
  sendToBack(token: string): void {
    return this.dequeueSet.sendToBack(token);
  }

	/**
   * Moves a token to the back of the token queue, and then returns the next token in the queue
   */
		rotateToken(): string | null{
			// Send the current token to the back of the queue
			if (this.dequeueSet.peek() !== null) {
				this.dequeueSet.sendToBack(this.dequeueSet.peek() as string);
			}
			return this.dequeueSet.peek();
		}
}
