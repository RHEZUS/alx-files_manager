import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {

    /**
     * returns if redis or db ar connected or not
     * uses the isAlive in redis and db utils
     * @returns '{ "redis": true, "db": true }' with a status code 200
     */
    static getStatus(request, response) {
        response.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
    }

    /**
     * get the number of user and files
     * @returns The number of users and files in DB
     * users collection must be used for counting all users
     * files collection must be used for counting all files
     */
    static async getStats(request, response) {
        const usersNum = await dbClient.nbUsers();
        const filesNum = await dbClient.nbFiles();
        response.status(200).json({ users: usersNum, files: filesNum });
    }
}

module.exports = AppController;
