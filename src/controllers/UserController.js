import dotenv from 'dotenv';
import { User } from '../queries';
import * as helper from '../helpers';
import status from '../config/status';

dotenv.config();

/**
 * A class to handle user local authentication
 */
export default class UserController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} return an object containing the updated profile
   */
  static async findOne(req, res) {
    const userId = (req.params && req.params.id) || req.userId || req.user.id;
    const user = await User.findOne({ id: userId });
    const errors = user.errors || null;

    return (
      (errors
        && errors.name === 'SequelizeDatabaseError'
        && res.status(status.BAD_REQUEST).json({
          errors: { notification: 'The provided user ID should be an integer' }
        }))
      || (errors
        && res.status(status.SERVER_ERROR).json({
          errors: 'Oops, something went wrong, please try again'
        }))
      || res.status(status.OK).json({ user })
    );
  }
}
