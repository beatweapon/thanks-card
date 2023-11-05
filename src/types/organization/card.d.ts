export interface ThanksCard {
	id: string;
	from: string;
	to: string;
	message: string;
	createdAt: import('firebase/firestore').Timestamp;
}
