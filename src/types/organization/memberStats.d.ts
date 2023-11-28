export interface Stats {
	sentMessage: number;
	receivedMessage: number;
	deleteMessage: number;
	sentReaction: number;
	receivedReaction: number;
	lastSentMessageAt: Date;
	lastReceivedMessageAt: Date;
}

export interface UpdateData {
	[x: keyof Stats]: any;
}
