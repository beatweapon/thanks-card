export interface Stats {
	sentMessage: number;
	receivedMessage: number;
	deletedMessage: number;
	sentReaction: number;
	receivedReaction: number;
	lastSentMessageAt: import('firebase/firestore').Timestamp;
	lastReceivedMessageAt: import('firebase/firestore').Timestamp;
}

export interface UpdateData {
	[x: keyof Stats]: any;
}
