import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {

  /**
   * Should sign-in the user by generating a new authentication token
   * @return an authentication token token: "155342df-2399-41da-9e8c-458b6ac52a0c"
   * with a status code 200
   */
  static async getConnect(request, response) {
    // get the Authorization header
    const authData = request.header('Authorization');
    let userEmail = authData.split(' ')[1];
    const buff = Buffer.from(userEmail, 'base64');
    userEmail = buff.toString('ascii');
    const data = userEmail.split(':'); // contains email and password
    if (data.length !== 2) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }
    // hash the password
    const hashedPassword = sha1(data[1]);
    // find the user in the database
    const users = dbClient.db.collection('users');
    users.findOne({ email: data[0], password: hashedPassword }, async (err, user) => {
      if (user) {
        // generate a token
        const token = uuidv4();
        const key = `auth_${token}`;
        // store the token in redis for 24 hours
        await redisClient.set(key, user._id.toString(), 60 * 60 * 24);
        response.status(200).json({ token });
      } else {
        response.status(401).json({ error: 'Unauthorized' });
      }
    });
  }

  /**
   * Should sign-out the user based on the token
   * @returns an empty response
   * status code 20 
   */
  static async getDisconnect(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const id = await redisClient.get(key);
    if (id) {
      await redisClient.del(key);
      response.status(204).json({});
    } else {
      response.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = AuthController;
