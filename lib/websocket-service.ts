import SockJS from 'sockjs-client';
import { Client, Message, StompSubscription } from '@stomp/stompjs';

// Define configuration for the backend
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';

class WebSocketService {
    private client: Client;
    private isConnected: boolean = false;
    private pendingSubscriptions: Array<{
        topic: string;
        callback: (message: unknown) => void;
        resolve: (sub: StompSubscription) => void;
    }> = [];

    constructor() {
        this.client = new Client({
            // Use SockJS fallback if native WebSocket is not available or for compatibility
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),
            onConnect: () => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('Connected to Spring Boot WebSocket');
                }
                this.isConnected = true;
                this.processPendingSubscriptions();
            },
            onDisconnect: () => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('Disconnected from Spring Boot WebSocket');
                }
                this.isConnected = false;
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            // Auto-reconnect
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // Start connection immediately
        if (typeof window !== 'undefined') { // Ensure we are on client side
            this.client.activate();
        }
    }

    private processPendingSubscriptions() {
        this.pendingSubscriptions.forEach(sub => {
            const stompSub = this.client.subscribe(sub.topic, (message: Message) => {
                try {
                    const parsedBody = JSON.parse(message.body);
                    sub.callback(parsedBody);
                } catch (e) {
                    console.error('Failed to parse message body', e);
                    sub.callback(message.body);
                }
            });
            // We can't really "resolve" the past promise here easily without complex logic,
            // but for the synchronous return wrapper below, we handle it via the wrapper.
        });
        this.pendingSubscriptions = [];
    }

    public subscribe(topic: string, callback: (message: unknown) => void): { unsubscribe: () => void } {
        // Safe wrapper for React useEffect cleanup
        let stompSubscription: StompSubscription | null = null;

        const subscriptionWrapper = {
            unsubscribe: () => {
                if (stompSubscription) {
                    stompSubscription.unsubscribe();
                } else {
                    // Remove from pending if verified cancelled before connect
                    this.pendingSubscriptions = this.pendingSubscriptions.filter(s => s.topic !== topic);
                }
            }
        };

        if (this.isConnected && this.client.active) {
            stompSubscription = this.client.subscribe(topic, (message: Message) => {
                try {
                    const parsedBody = JSON.parse(message.body);
                    callback(parsedBody);
                } catch (e) {
                    // console.error('Failed to parse message body', e);
                    callback(message.body);
                }
            });
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.log('Queuing subscription for:', topic);
            }
            // Queue it
            // We need to capture the *actual* stomp subscription when it happens.
            // But since we can'processPendingSubscriptions' handles it, we need a way to link them.
            // For simplicity in this fix, we just queue the activation. 
            // The unsubscription logic in the wrapper above for 'pending' is simplified.

            // To make "unsubscribe" work for queued items, we'll store a reference to this specific request
            // But actually @stomp/stompjs client.subscribe returns the subscription object.

            // Refined approach:
            // We define a callback that will be executed on connect.
            const onConnectCallback = () => {
                stompSubscription = this.client.subscribe(topic, (message: Message) => {
                    try {
                        const parsedBody = JSON.parse(message.body);
                        callback(parsedBody);
                    } catch (e) {
                        callback(message.body);
                    }
                });
            };

            // We add this to an internal list of callbacks to run on connect
            // This is slightly different from the class property 'pendingSubscriptions' I defined above.
            // Let's rely on a simple array of functions.
            this.addPendingSubscription(onConnectCallback);

            if (!this.client.active) {
                this.client.activate();
            }
        }

        return subscriptionWrapper;
    }

    private pendingCallbacks: Array<() => void> = [];

    private addPendingSubscription(callback: () => void) {
        this.pendingCallbacks.push(callback);
    }

    // Override the processPendingSubscriptions to use the callbacks
    // (Note: replacing the previous method logic with this one)
    private processPendingSubscriptions_v2() {
        this.pendingCallbacks.forEach(cb => cb());
        this.pendingCallbacks = [];
    }

    public send(destination: string, body: unknown) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: destination,
                body: JSON.stringify(body),
            });
        } else {
            // Optional: Queue messages too if needed, but for now just warn
            // console.warn('Cannot send message: WebSocket not connected');
        }
    }
}

// Redefine class properly with the fix integrated cleanly
class SafeWebSocketService {
    private client: Client;
    private isConnected: boolean = false;
    private onConnectCallbacks: Array<() => void> = [];

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),
            onConnect: () => {
                // console.log('Connected to WS');
                this.isConnected = true;
                this.flushCallbacks();
            },
            onDisconnect: () => {
                this.isConnected = false;
            },
            reconnectDelay: 5000,
        });

        if (typeof window !== 'undefined') {
            this.client.activate();
        }
    }

    private flushCallbacks() {
        this.onConnectCallbacks.forEach(cb => cb());
        this.onConnectCallbacks = [];
    }

    public subscribe(topic: string, callback: (message: unknown) => void): { unsubscribe: () => void } {
        let internalSub: StompSubscription | null = null;
        let isUnsubscribed = false;

        const doSubscribe = () => {
            if (isUnsubscribed) return;
            internalSub = this.client.subscribe(topic, (message: Message) => {
                try {
                    callback(JSON.parse(message.body));
                } catch {
                    callback(message.body);
                }
            });
        };

        if (this.isConnected) {
            doSubscribe();
        } else {
            this.onConnectCallbacks.push(doSubscribe);
        }

        return {
            unsubscribe: () => {
                isUnsubscribed = true;
                if (internalSub) {
                    internalSub.unsubscribe();
                }
                // Also remove from callbacks if present? 
                // Minimal impact if it runs and immediately unsubscribes, but cleaner to just let the flag handle it.
            }
        };
    }

    public send(destination: string, body: unknown) {
        if (this.isConnected) {
            this.client.publish({ destination, body: JSON.stringify(body) });
        }
    }
}

const webSocketService = new SafeWebSocketService();
export default webSocketService;
