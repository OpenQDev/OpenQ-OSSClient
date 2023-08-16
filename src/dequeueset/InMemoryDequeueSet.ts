import { DequeueSet } from '@types'

/**
 * Represents an in-memory dequeue set that stores unique items in a queue.
 */
export default class InMemoryDequeueSet implements DequeueSet {
  /**
   * A dictionary storing whether an item exists in the dequeue set.
   */
  items: Record<string, boolean>;

  /**
   * An array representing the queue of items in the dequeue set.
   */
  queue: string[];

  /**
   * Creates an instance of InMemoryDequeueSet.
   * Initializes the items dictionary and the queue array.
   */
  constructor() {
    this.items = {};
    this.queue = [];
  }

  /**
   * Enqueues an item into the dequeue set if it doesn't already exist.
   * @param item - The item to be enqueued.
   */
  enqueue(item: string): void {
    if (!this.items.hasOwnProperty(item)) {
      this.items[item] = true;
      this.queue.push(item);
    }
  }

  /**
   * Dequeues and removes the first item from the dequeue set.
	 * NOTE: Mainly only used if the token is not just exhausted, but totally invalid and shouldn't be retried.
	 * If the token is just exhausted, it should be sent to the back of the queue.
   * @returns The dequeued item, or null if the dequeue set is empty.
   */
  dequeue(): string | null {
    if (this.isEmpty()) {
      return null;
    }

    const item = this.queue.shift();
    const result = item !== undefined ? item : null;

    if (result === null) {
      return null;
    } else {
      delete this.items[result];
    }

    return result;
  }

  /**
   * Retrieves the first item in the dequeue set without removing it.
   * @returns The first item, or null if the dequeue set is empty.
   */
  peek(): string | null {
    if (this.isEmpty()) {
      return null;
    }

    return this.queue[0];
  }

  /**
   * Removes a specified item from the dequeue set from any position.
   * @param item - The item to be removed.
   */
  remove(item: string): void {
    if (this.items.hasOwnProperty(item)) {
      delete this.items[item];
      this.queue = this.queue.filter((queueItem: string) => queueItem !== item);
    }
  }

  /**
   * Moves a specified item to the back of the dequeue set.
   * @param item - The item to be moved to the back.
   */
  sendToBack(item: string): void {
    if (this.items.hasOwnProperty(item)) {
      const index = this.queue.indexOf(item);
      if (index !== -1) {
        this.queue.splice(index, 1);
        this.queue.push(item);
      }
    }
  }

  /**
   * Checks if the dequeue set is empty.
   * @returns True if the dequeue set is empty, otherwise false.
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

// Example usage
const inMemoryDequeueSet = new InMemoryDequeueSet();

inMemoryDequeueSet.enqueue('valid_token_1');
inMemoryDequeueSet.enqueue('valid_token_2');
inMemoryDequeueSet.enqueue('valid_token_3');

// [ 'valid_token_1', 'valid_token_2', 'valid_token_3' ]
console.log(inMemoryDequeueSet.queue);

inMemoryDequeueSet.enqueue('valid_token_1');
// [ 'valid_token_1', 'valid_token_2', 'valid_token_3' ]
console.log(inMemoryDequeueSet.queue);

if (!inMemoryDequeueSet.isEmpty()) {
  inMemoryDequeueSet.sendToBack(inMemoryDequeueSet.peek() as string);
}

// [ 'valid_token_2', 'valid_token_3', 'valid_token_1' ]
console.log(inMemoryDequeueSet.queue);

// valid_token_2
console.log(inMemoryDequeueSet.peek());

inMemoryDequeueSet.remove('valid_token_2');

// [ 'valid_token_3', 'valid_token_1' ]
console.log(inMemoryDequeueSet.queue);
// valid_token_3
console.log(inMemoryDequeueSet.peek());