import { writable } from 'svelte/store';

/**
 * @typedef Card
 * @property {string} from 送った人
 * @property {string} to 受け取った人
 * @property {string} message メッセージ
 * @property {Date} created 送信日
 */

/**
 * @type {import('svelte/store').Writable<Card[]>}
 */
export const cards = writable([
	{ from: 'tatsuya akimoto', to: 'taro', message: 'いつもありがとう！！', created: new Date() },
	{ from: 'kento ueda', to: 'taro', message: '昨日はありがとう！！', created: new Date() }
]);
