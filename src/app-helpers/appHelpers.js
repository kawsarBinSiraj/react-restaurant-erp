import { v4 as uuid_v4 } from 'uuid';
const _ = require('lodash');
const axios = require('axios');

/**
 * Toast Notification
 *
 * @param toast
 * @param type
 * @param error
 * @returns {ToastId | void | never | *|*}
 */
export const toastNotify = (toast, type, error) => {
	let message = '';
	if (!_.isUndefined(error.data) && !_.isUndefined(error.data.message)) {
		message = error.data.message;
	} else if (!_.isUndefined(error.response) && !_.isUndefined(error.response.data)) {
		message = error.response.data.message;
	} else if (_.isObject(error)) {
		message = error.message;
	} else {
		message = error;
	}

	if (type === 'success') {
		return toast.success(message, {
			position: toast.POSITION.BOTTOM_RIGHT,
			theme: 'colored',
		});
	} else if (type === 'info') {
		return toast.info(message, {
			position: toast.POSITION.BOTTOM_RIGHT,
			theme: 'colored',
		});
	} else if (type === 'warning') {
		return toast.warn(message, {
			position: toast.POSITION.BOTTOM_RIGHT,
			theme: 'colored',
		});
	} else if (type === 'error') {
		return toast.error(message, {
			position: toast.POSITION.BOTTOM_RIGHT,
			theme: 'colored',
		});
	}
};

/**
 * Making random string
 *
 * @param {int} limit
 * @return {string}
 */
export const makeRandomString = (limit = 8) => {
	return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).slice(-limit).toUpperCase();
};


/**
 * sourceLanguageDetector
 *
 * @param {}
 * @return {sourceLanguageDetector}
 */
export const sourceLanguageDetector = async (text, callback) => {
	await axios
		.post(
			'https://translation.googleapis.com/language/translate/v2',
			{},
			{
				params: {
					q: text,
					target: 'bn',
					key: 'AIzaSyCHUCmpR7cT_yDFHC98CZJy2LTms-IwDlM',
				},
			}
		)
		.then((response) => {
			const { translations } = response?.data?.data;
			callback(translations[0]);
		})
		.catch((err) => {
			console.log('rest api error', err);
		});
};

/**
 * stringModify
 *
 * @param {}
 * @return {str}
 */
export const stringModify = (type, string) => {
	switch (type) {
		case 'makeUppercase':
			return string.toString().toUpperCase();
		case 'makeLowercase':
			return string.toString().toLowerCase();
		case 'makeSentenceCase':
			let deicide = string.toString().split('.');
			const newStr = deicide
				.map((s) => {
					return s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase();
				})
				.join('. ');
			return newStr;
		case 'makeCapitalize':
			let strArray = string.toString().split(' ');
			let sentence = '';
			strArray.forEach((value, index) => {
				sentence += `${value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()} `;
			});
			return sentence;
		default:
			return string;
	}
};

/**
 * readTxtFile
 *
 * @param {textFile , callBack}
 * @return {}
 */
export const readTxtFile = async (textFiles = {}, callBack) => {
	let __FETCH_PROMISE = [];
	let __FILE_LOCATIONS = Object.values(textFiles);
	let __FILE_NAMES = Object.keys(textFiles);

	for (let i = 0; i < __FILE_LOCATIONS.length; i++) {
		__FETCH_PROMISE.push(fetch(__FILE_LOCATIONS[i]));
	}

	Promise.all(__FETCH_PROMISE)
		.then(async ([...response]) => {
			let textAsObj = {};
			for (let i = 0; i < response.length; i++) {
				const textContent = await response[i].text();
				const textContentAsArray = textContent.split(/\r|\n/).filter((item) => item !== '');
				const options = textContentAsArray.map((text) => {
					return {
						id: uuid_v4(),
						name: text.toLowerCase(),
					};
				});
				textAsObj[__FILE_NAMES[i]] = options
			}
			callBack(textAsObj);
		})
		.catch((error) => {
			console.error(error);
		});
};
