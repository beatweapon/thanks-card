import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}
export const auth = admin.auth();

/**
 * Push通知送信処理
 * @param {string} registrationToken
 * @param {string} title
 * @param {string} body
 * @param {string} icon
 * @param {string} path
 */
export const sendMessageToDevice = (registrationToken, title, body, icon, path) => {
  admin
    .messaging()
    .send({
      token: registrationToken,
      data: {
        title,
        body,
        icon,
        path,
      },
    })
    .then((response) => {
      console.log('Push通知が送信されました:', response);
    })
    .catch((error) => {
      console.error('Push通知の送信に失敗しました:', error);
    });
};
