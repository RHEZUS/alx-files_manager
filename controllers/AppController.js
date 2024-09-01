import redisClient from '../utils/redis';
import dbClient from '../utils/db'

export default class AppController {

    /**
     * returns if redis or db ar connected or not
     * uses the isAlive in redis and db utils
     * { "redis": true, "db": true } with a status code 200
     */
    static getStatus(req, res) {
        res.status(200).json({
          redis: redisClient.isAlive(),
          db: dbClient.isAlive(),
        });
    }

    /**
     * get the number of user and files
     * @param {*} req 
     * @param {*} res 
     * @returns The number of users and files in DB
     * users collection must be used for counting all users
     * files collection must be used for counting all files
     */
    static getStats(req, res) {
        Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
        .then(([usersCount, filesCount]) => {
            res.status(200).json({ users: usersCount, files: filesCount });
        });
    }
}