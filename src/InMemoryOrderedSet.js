// A double-ended queue (deque) is a queue-like data structure that supports insertion and deletion at both the front and the back of the queue.
// The following snippet implements a deque using an array:

class OrderedSet {
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
const orderedSet = new OrderedSet();

orderedSet.enqueue(1);
orderedSet.enqueue(2);
orderedSet.enqueue(3);

console.log(orderedSet);
orderedSet.sendToBack(orderedSet.peek());

console.log(orderedSet)
