import { sendMessageToDevice } from '$lib/server/firebase_server';
import { fetchUser } from '$lib/server/user';

/**
 * ユーザーのデバイスに通知メッセージを送信する
 * @param {string} to
 * @param {string} title
 * @param {string} message
 * @param {string} icon
 */
export const sendNotificationToUser = async (to, title, message, icon) => {
	const user = await fetchUser(to);

	if (user?.deviceTokens) {
		user.deviceTokens.forEach(async (token) => {
			await sendMessageToDevice(token, title, message, icon);
		});
	}
};
