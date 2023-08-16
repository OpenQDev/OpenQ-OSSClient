import './DequeueSet'

export default class InMemoryDequeueSet implements DequeueSet {
  constructor() {
    this.items = {};
    this.queue = [];
  }

  enqueue(item) {
    if (!this.items.hasOwnProperty(item)) {
      this.items[item] = true;
      this.queue.push(item);
    }
  }

  dequeueue() {
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

  remove(item) {
    if (this.items.hasOwnProperty(item)) {
      delete this.items[item];
      this.queue = this.queue.filter(queueItem => queueItem !== item);
    }
  }

  sendToBack(item) {
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
const dequeueueSet = new dequeueueSet();

dequeueSet.enqueue('valid_token_1');
dequeueSet.enqueue('valid_token_2');
dequeueSet.enqueue('valid_token_3');

console.log(dequeueSet);
dequeueSet.sendToBack(dequeueSet.peek());

console.log(dequeueSet)
