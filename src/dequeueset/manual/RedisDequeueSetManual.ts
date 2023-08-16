import RedisDequeueSet from '../RedisDequeueSet';

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
