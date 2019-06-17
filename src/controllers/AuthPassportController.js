import dotenv from 'dotenv';
import status from '../config/status';

dotenv.config();

/**
 * A class to handle users authentication using social media platform
 */
export default class AuthPassportController {
  /**
   * @param {object} profile social media user information
   * @returns {object} a user object
   */
  static getSocialMediaUser(profile = {}) {
    const user = {};
    if (profile.displayName) {
      const [firstName, lastName] = profile.displayName.split(' ');
      user.firstName = firstName;
      user.lastName = lastName;
    }
    if (profile.name) {
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
    }
    if (profile.emails) {
      user.email = profile.emails[0].value;
    }
    if (profile.username) {
      user.username = profile.username;
    }
    return Object.keys(profile).length
      ? {
        ...user,
        permissions: profile.permissions,
        image: profile.photos[0].value,
        accountProvider: profile.provider,
        accountProviderUserId: profile.id
      }
      : {};
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} an object containing user information
   */
  static async loginOrSignup(req, res) {
    const { APP_URL_FRONTEND } = process.env;
    const user = req.user || req.body || {};
    if (!Object.keys(user).length) {
      return res.status(status.BAD_REQUEST).json({ errors: { body: 'should not be empty' } });
    }
    const profile = AuthPassportController.getSocialMediaUser(user);
    res.cookie('user', JSON.stringify({ profile }), {
      expires: new Date(Date.now() + 86400000)
    });
    res.redirect(302, `${APP_URL_FRONTEND}/game`);
  }
}
