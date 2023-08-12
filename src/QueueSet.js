const Redis = require('ioredis');

class QueueSet {
  constructor(name) {
    this.name = name;
    this.redis = new Redis();
  }

  async add(item) {
    // Add to the set if not already present
    const addedToSet = await this.redis.sadd(`${this.name}:set`, item);

    if (addedToSet) {
      // Add to the end of the list
      await this.redis.rpush(`${this.name}:queue`, item);
    }
  }

  async pop() {
    // Pop from the front of the list
    const item = await this.redis.lpop(`${this.name}:queue`);

    if (item) {
      // Remove from the set as well
      await this.redis.srem(`${this.name}:set`, item);
    }

    return item;
  }

  async size() {
    return await this.redis.llen(`${this.name}:queue`);
  }

  async contains(item) {
    return await this.redis.sismember(`${this.name}:set`, item) === 1;
  }
}

// Create a QueueSet instance
const queueSet = new QueueSet("my_queue_set");

// Add elements to the QueueSet
queueSet.add("element1");
queueSet.add("element2");
queueSet.add("element3");

// Check if an element is in the QueueSet
queueSet.contains("element1").then(console.log);  // Output: true
queueSet.contains("element4").then(console.log);  // Output: false

// Get and remove elements from the QueueSet
queueSet.pop().then(console.log);  // Output: element1
queueSet.pop().then(console.log);  // Output: element2

// Check the size of the QueueSet
queueSet.size().then(console.log);  // Output: 1
