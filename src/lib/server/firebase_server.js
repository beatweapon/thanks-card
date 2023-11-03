import admin from 'firebase-admin';

const app = admin.initializeApp();
export const auth = app.auth();

/**
 * Push通知送信処理
 * @param {string} registrationToken
 * @param {string} title
 * @param {string} body
 * @param {string} icon
 */
export const sendMessageToDevice = (registrationToken, title, body, icon) => {
	admin
		.messaging()
		.send({
			token: registrationToken,
			notification: {
				title,
				body,
			},
			data: {
				icon,
			},
		})
		.then((response) => {
			console.log('Push通知が送信されました:', response);
		})
		.catch((error) => {
			console.error('Push通知の送信に失敗しました:', error);
		});
};
