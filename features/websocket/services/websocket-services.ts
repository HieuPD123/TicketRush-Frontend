import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

class WebSocketService {
    private client: Client | null = null;
}