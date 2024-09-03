import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Class for performing operations with redis service
 */
class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  /**
   * checks if the server is connected
   * @returns {boolean} true if the client is connected to the server, false otherwise
   */
  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  /**
   * Gets a key from the Redis instance
   * @param {string} key the key to get
   * @returns {Promise<string>} The value of the key
   */
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value;
  }

  /**
   * Sets a key from the Redis instance
   * @param {string} key the key to get
   * @param {string} value the value to set
   * @param {number} time the time to set the key for
   * @returns {Promise<string>} The value of the key
   */
  async set(key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, time);
  }

  /**
   * Deletes a key from the Redis instance
   * @param {string} key th key to delete
   * @returns {undefined} No return
   */
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
