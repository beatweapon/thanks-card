export interface ThanksCard {
	id: string;
	designId: string;
	from: string;
	to: string;
	message: string;
	reactions?: Reaction[];
	createdAt: import('firebase/firestore').Timestamp;
}

export interface ThanksCardPreview extends ThanksCard {
	createdAt?: import('firebase/firestore').Timestamp;
}

interface Reaction {
	emoji: string;
	from: string;
}
