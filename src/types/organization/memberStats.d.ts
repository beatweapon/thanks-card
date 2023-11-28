export interface Stats {
	sent: number;
	received: number;
	delete: number;
	reaction: number;
	lastSendedAt: Date;
	lastReceivedAt: Date;
}

export interface UpdateData {
	[x: keyof Stats]: any;
}
