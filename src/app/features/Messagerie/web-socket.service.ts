import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MessageDTO } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client: Client | null = null;
  private messagesSubject = new BehaviorSubject<MessageDTO[]>([]);
  public messages$: Observable<MessageDTO[]> = this.messagesSubject.asObservable();
  private connectionSubject = new Subject<void>();
  public connection$: Observable<void> = this.connectionSubject.asObservable();
  private connectionErrorSubject = new Subject<string>();
  public connectionError$: Observable<string> = this.connectionErrorSubject.asObservable();
  private maxRetries = 3;
  private retryCount = 0;
  private isConnecting = false;

  constructor(private authService: AuthService) {}

  private initializeWebSocket(): void {
    const token = this.authService.getToken();
    if (!token) {
      const errorMsg = 'No JWT token available for WebSocket connection';
      console.error(errorMsg);
      this.connectionErrorSubject.next(errorMsg);
      return;
    }

    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str: string) => console.log(`WebSocket Debug: ${str}`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      this.isConnecting = false;
      this.retryCount = 0;
      const userId = this.authService.getUserId();
      if (userId) {
        this.subscribeToMessages(userId);
        this.connectionSubject.next();
      } else {
        const errorMsg = 'No user ID available for subscription';
        console.error(errorMsg);
        this.connectionErrorSubject.next(errorMsg);
      }
    };

    this.client.onStompError = (frame) => {
      const errorMsg = `WebSocket STOMP error: ${frame.body || frame}`;
      console.error(errorMsg);
      this.isConnecting = false;
      this.connectionErrorSubject.next(errorMsg);
    };

    this.client.onWebSocketClose = (event) => {
      const errorMsg = `WebSocket closed with code: ${event.code}, reason: ${event.reason || 'unknown'}`;
      console.error(errorMsg);
      this.isConnecting = false;
      this.connectionErrorSubject.next(errorMsg);
      if (this.retryCount < this.maxRetries) {
        console.log(`Attempting to reconnect (${this.retryCount + 1}/${this.maxRetries})`);
        this.retryCount++;
        setTimeout(() => this.connect(), 1000);
      } else {
        this.connectionErrorSubject.next('Max WebSocket reconnection attempts reached');
      }
    };

    this.client.onWebSocketError = (error) => {
      const errorMsg = `WebSocket error: ${error.message || error}`;
      console.error(errorMsg);
      this.isConnecting = false;
      this.connectionErrorSubject.next(errorMsg);
    };
  }

  connect(): Observable<void> {
    if (this.client?.active) {
      console.log('WebSocket already active');
      this.connectionSubject.next();
      return this.connectionSubject.asObservable();
    }

    const token = this.authService.getToken();
    if (!token) {
      const errorMsg = 'No token available for WebSocket connection';
      console.error(errorMsg);
      this.connectionErrorSubject.next(errorMsg);
      return throwError(() => new Error(errorMsg));
    }

    if (!this.isConnecting) {
      console.log('Initiating WebSocket connection');
      this.isConnecting = true;
      this.initializeWebSocket();
      if (this.client) {
        this.client.activate();
      }
    }
    return this.connectionSubject.asObservable();
  }

  disconnect(): void {
    if (this.client?.active) {
      console.log('Disconnecting WebSocket');
      this.client.deactivate();
      this.isConnecting = false;
      this.retryCount = 0;
      this.messagesSubject.next([]);
    }
    this.client = null;
  }

  sendMessage(recipientId: number, content: string, senderId: number): void {
    if (!this.client?.active) {
      console.warn('WebSocket not connected, attempting to reconnect');
      this.connect().subscribe({
        next: () => this.publishMessage(recipientId, content, senderId),
        error: (err) => {
          console.error('Failed to reconnect for sending message:', err);
          this.connectionErrorSubject.next('Failed to send message: WebSocket not connected');
        },
      });
      return;
    }
    this.publishMessage(recipientId, content, senderId);
  }

  private publishMessage(recipientId: number, content: string, senderId: number): void {
    const message: MessageDTO = {
      senderId,
      recipientId,
      content,
      timestamp: new Date(),
      isRead: false,
    };
    try {
      this.client?.publish({
        destination: `/app/chat/${recipientId}`,
        body: JSON.stringify(message),
      });
      console.log('Sent message:', message);
      // Ajouter le message envoyé localement pour un affichage immédiat
      const currentMessages = this.messagesSubject.getValue();
      this.messagesSubject.next([...currentMessages, message]);
    } catch (error) {
      console.error('Error sending message:', error);
      this.connectionErrorSubject.next('Error sending message: ' + (error as Error).message);
    }
  }

  subscribeToMessages(userId: number): void {
    if (!this.client?.active) {
      console.warn('WebSocket not connected, attempting to reconnect');
      this.connect().subscribe({
        next: () => this.subscribeToMessages(userId),
        error: (err) => {
          console.error('Failed to reconnect for subscription:', err);
          this.connectionErrorSubject.next('Failed to subscribe to messages: ' + (err as Error).message);
        },
      });
      return;
    }
    this.client?.subscribe(`/user/${userId}/queue/messages`, (message: IMessage) => {
      try {
        const newMessage: MessageDTO = JSON.parse(message.body);
        const currentMessages = this.messagesSubject.getValue();
        this.messagesSubject.next([...currentMessages, newMessage]);
        console.log('Received message:', newMessage);
      } catch (error) {
        console.error('Error parsing message:', error, 'Raw body:', message.body);
        this.connectionErrorSubject.next('Error parsing message: ' + (error as Error).message);
      }
    });
  }

  subscribeToConversation(otherUserId: number): void {
    if (!this.client?.active) {
      console.warn('WebSocket not connected, attempting to reconnect');
      this.connect().subscribe({
        next: () => this.subscribeToConversation(otherUserId),
        error: (err) => {
          console.error('Failed to reconnect for conversation subscription:', err);
          this.connectionErrorSubject.next('Failed to subscribe to conversation: ' + (err as Error).message);
        },
      });
      return;
    }
    this.client?.subscribe(`/user/queue/conversation/${otherUserId}`, (message: IMessage) => {
      try {
        const messages: MessageDTO[] = JSON.parse(message.body);
        this.messagesSubject.next(messages);
        console.log('Received conversation messages:', messages);
      } catch (error) {
        console.error('Error parsing conversation messages:', error, 'Raw body:', message.body);
        this.connectionErrorSubject.next('Error parsing conversation messages: ' + (error as Error).message);
      }
    });
  }
}
