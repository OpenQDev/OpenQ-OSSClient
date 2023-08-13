// A double-ended queue set (deque set) is a queue-like data structure that supports insertion and deletion at both the front and the back of the queue.
// The "set" comes from the fact that it contains all unique elements

// OPERATION
// We enqueu fresh new tokens to the front of the queue
// Once exhausted or approaching exhaustion, we dequeue the token from the front and enqueue it to the back
// This gives it time to "reload" while we use the next token in the deque set
// The uniqueness property is important because we don't want to use the same token twice in a row after its been exhausted

class DequeueSet {
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
const dequeueSet = new DequeueSet();

dequeueSet.enqueue('valid_token_1');
dequeueSet.enqueue('valid_token_2');
dequeueSet.enqueue('valid_token_3');

console.log(dequeueSet);
dequeueSet.sendToBack(dequeueSet.peek());

console.log(dequeueSet)
