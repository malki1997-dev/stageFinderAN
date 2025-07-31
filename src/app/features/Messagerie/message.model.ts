export interface MessageDTO {
  id?: number;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: Date;
  isRead: boolean;
}
