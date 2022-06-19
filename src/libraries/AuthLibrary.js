import Cookies from 'cookies-js';
import _ from 'lodash';
import axios from 'axios';

class AuthLibrary {
	/**
	 *
	 * @param access_token
	 * @param token_type
	 * @param expired_at
	 * @returns {Cookies}
	 */
	setTokenToCookie = (access_token) => {
		try {
			return Cookies.set('access_token', access_token, {
				expires: 5000,
			});
		} catch (err) {
			throw Error('Auth generation is failed.');
		}
	};

	login = (callback) => {
		window.location.href = process.env.PUBLIC_URL;

		if (typeof callback === 'function') {
			return callback();
		}
	};

	/**
	 *
	 * @param callback
	 * @returns {boolean|*}
	 */
	logout = async (callback) => {
		Cookies.expire('access_token');
		window.location.href = process.env.PUBLIC_URL + '/login';

		if (typeof callback === 'function') {
			return callback();
		}
	};
}

export default new AuthLibrary();
