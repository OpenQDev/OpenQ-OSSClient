import InMemoryDequeueSet from "@src/dequeueset/InMemoryDequeueSet"

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