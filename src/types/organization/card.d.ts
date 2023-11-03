export interface ThanksCard {
	from: string;
	to: string;
	message: string;
	createdAt: import('firebase/firestore').Timestamp;
}
