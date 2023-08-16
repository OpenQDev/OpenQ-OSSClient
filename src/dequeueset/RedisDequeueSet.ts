import { DequeueSet } from '../types'

export default class RedisDequeueSet implements DequeueSet {
  items: Record<string, boolean>;
	queue: string[];

	constructor() {
    this.items = {};
    this.queue = [];
  }

  enqueue(item: string): void {
    if (!this.items.hasOwnProperty(item)) {
      this.items[item] = true;
      this.queue.push(item);
    }
  }

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

  peek(): string | null {
    if (this.isEmpty()) {
      return null;
    }

    return this.queue[0];
  }

  remove(item: string): void {
    if (this.items.hasOwnProperty(item)) {
      delete this.items[item];
      this.queue = this.queue.filter((queueItem: string) => queueItem !== item);
    }
  }

  sendToBack(item: string): void {
    if (this.items.hasOwnProperty(item)) {
      const index = this.queue.indexOf(item);
      if (index !== -1) {
        this.queue.splice(index, 1);
        this.queue.push(item);
      }
    }
  }

	isEmpty(): boolean {
		return this.queue.length === 0;
	}
}

// Example usage
const redisDequeueSet = new RedisDequeueSet();

redisDequeueSet.enqueue('valid_token_1');
redisDequeueSet.enqueue('valid_token_2');
redisDequeueSet.enqueue('valid_token_3');

console.log(redisDequeueSet);

if (!redisDequeueSet.isEmpty()) {
	redisDequeueSet.sendToBack(redisDequeueSet.peek() as string);
}

console.log(redisDequeueSet)
