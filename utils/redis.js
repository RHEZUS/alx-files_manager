import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor(){
        this.client = redis.createClient();
        this.isConnected = true;
        this.getAsync = promisify(this.client.get).bind(this.client);

        this.client.on('error', (error) => {
            console.log(`Redis client not connected to the server: ${error.message}`);
            this.isConnected = false;
        });
        
        this.client.on('connect', () => {
            this.isConnected = true;
        });
        
    }

    /**
     * 
     * @param {string} key 
     * @param {string} value 
     * @param {number} duration
     * @returns {undefined} No return
     */
    async set(key, value, duration) {
        this.client.setex(key, duration, value);
    }

    /**
     * Gets a key from the Redis instance
     * @param {string} key the key to get
     * @returns {Promise<string>} The value of the key
     */
    async get(key){
        const value = await this.getAsync(key);
        return value;
    }

    /**
     * Deletes a key from the Redis instance
     * @param {string} key th key to delete
     * @returns {undefined} No return 
     */

    async del(key) {
        this.client.del(key);
    }

    /**
     * 
     * @returns {boolean} true if the client is connected to the server, false otherwise
     */
    isAlive(){
        return this.isConnected;
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;
