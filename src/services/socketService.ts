import { io, Socket } from 'socket.io-client';
import { useCallStore } from '../store/callStore';

const SOCKET_URL = 'http://172.16.20.129:3000'; // 替换为您的 Socket.IO 服务器地址

interface MessageData {
  type: 'incomingCall' | 'callAccepted' | 'callEnded' | 'error';
  data?: {
    customerName?: string;
    phoneNumber?: string;
    channelName?: string;
    token?: string;
    callId?: string;
    error?: any;
  };
}

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.setupEventListeners();
    }
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // 连接事件
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('message', (messageData: MessageData) => {
      console.log('Message received:', messageData);
      
      const callStore = useCallStore.getState();
      
      switch (messageData.type) {
        case 'incomingCall':
          if (messageData.data?.customerName && messageData.data?.phoneNumber && messageData.data?.callId) {
            console.log('Incoming call:', messageData.data);
            callStore.handleIncomingCall(
              messageData.data.callId,
              messageData.data.customerName,
              messageData.data.phoneNumber
            );
          }
          break;

        case 'callAccepted':
          if (messageData.data?.channelName && messageData.data?.token) {
            console.log('Call accepted:', messageData.data);
            callStore.setRemoteUserJoined(true);
          }
          break;

        case 'callEnded':
          console.log('Call ended by remote user');
          callStore.endCall();
          break;

        case 'error':
          console.error('Socket error:', messageData.data?.error);
          break;

        default:
          console.log('Unknown message type:', messageData);
      }
    });
  }

  // 发起呼叫
  initiateCall(phoneNumber: string, customerName: string, channelId: string) {
    if (!this.socket) return;
      console.log('initiateCall', phoneNumber, customerName, channelId);
    
    this.socket.emit('message', {
      type: 'initiateCall',
      data: {
        phoneNumber,
        customerName,
        channelId: channelId,
      }
    });
    
  }

  // 接听来电
  acceptCall(callId: string) {
    if (!this.socket) return;
    
    this.socket.emit('message', {
      type: 'acceptCall',
      data: {
        callId,
      }
    });
  }

  // 拒绝来电
  rejectCall(callId: string) {
    if (!this.socket) return;
    
    this.socket.emit('message', {
      type: 'rejectCall',
      data: {
        callId,
      }
    });
  }

  // 结束通话
  endCall(callId: string) {
    if (!this.socket) return;
    
    this.socket.emit('message', {
      type: 'endCall',
      data: {
        callId,
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = SocketService.getInstance(); 