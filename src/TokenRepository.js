const Redis = require('ioredis');

class TokenRepository {
    constructor() {
        // Create a Redis connection
        this.redis = new Redis();

        // Set the Redis key for the token list
        this.key = 'token_list';
    }

    async add(token) {
        // Add the token to the end of the list
        await this.redis.rpush(this.key, token);
    }

    async remove(token) {
        // Remove all occurrences of the token from the list
        await this.redis.lrem(this.key, 0, token);
    }

    async get() {
        // Get all tokens from the list
        return await this.redis.lrange(this.key, 0, -1);
    }

    async popLatest() {
        // Remove and return the latest token from the list
        return await this.redis.lpop(this.key);
    }
}

// Example usage
const tokenRepo = new TokenRepository();

(async () => {
    await tokenRepo.add('token1');
    await tokenRepo.add('token2');
    await tokenRepo.add('token3');

    console.log(await tokenRepo.popLatest()); // Output: 'token1'
    console.log(await tokenRepo.get()); // Output: ['token2', 'token3']

    tokenRepo.redis.quit(); // Close the Redis connection when done
})();
