import DequeueSet from './DequeueSet'

export default class InMemoryDequeueSet implements DequeueSet {
  items: any;
	queue: any;

	constructor() {
    this.items = {};
    this.queue = [];
  }

  enqueue(item: string) {
    if (!this.items.hasOwnProperty(item)) {
      this.items[item] = true;
      this.queue.push(item);
    }
  }

  dequeue() {
    if (this.queue.length === 0) {
      return undefined;
    }

    const item = this.queue.shift();
    delete this.items[item];
    return item;
  }

  peek() {
    if (this.queue.length === 0) {
      return undefined;
    }

    return this.queue[0];
  }

  remove(item: string) {
    if (this.items.hasOwnProperty(item)) {
      delete this.items[item];
      this.queue = this.queue.filter((queueItem: string) => queueItem !== item);
    }
  }

  sendToBack(item: string) {
    if (this.items.hasOwnProperty(item)) {
      const index = this.queue.indexOf(item);
      if (index !== -1) {
        this.queue.splice(index, 1);
        this.queue.push(item);
      }
    }
  }
}

// Example usage
const inMemoryDequeueSet = new InMemoryDequeueSet();

inMemoryDequeueSet.enqueue('valid_token_1');
inMemoryDequeueSet.enqueue('valid_token_2');
inMemoryDequeueSet.enqueue('valid_token_3');

console.log(inMemoryDequeueSet);
inMemoryDequeueSet.sendToBack(inMemoryDequeueSet.peek());

console.log(inMemoryDequeueSet)
