import { create } from 'zustand';
import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  RtcConnection,
  UserOfflineReasonType,
  ChannelMediaOptions,
  ClientRoleType,
  AudioProfileType,
  AudioScenarioType,
} from 'react-native-agora';
import { PermissionsAndroid, Platform } from 'react-native';
import { socketService } from '../services/socketService';

interface CallState {
  isCallActive: boolean;
  isMuted: boolean;
  remoteUserJoined: boolean;
  customerName: string;
  phoneNumber: string;
  engine: IRtcEngine | null;
  currentCallId: string | null;
  isIncomingCall: boolean;
}

interface CallActions {
  initEngine: () => Promise<void>;
  startCall: (customerName: string, phoneNumber: string) => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => Promise<void>;
  setRemoteUserJoined: (joined: boolean) => void;
  handleIncomingCall: (callId: string, customerName: string, phoneNumber: string) => void;
  acceptIncomingCall: () => void;
  rejectIncomingCall: () => void;
}

const config = {
    appid: 'c4fb2d705dc74c2885d613baecdef2bd',
    token: '007eJxTYNgs5Hxlz5t7R1MOphwUkHsieGfjtgs/Vkb23/Gw+bPq+eHjCgzJJmlJRinmBqYpyeYmyUYWFqYpZobGSYmpySmpaUZJKcpfgjMaAhkZ2JUbWRgZIBDE52coTsxJ1S1JLS7RLcnMSy1hYAAAQg8nsA==',
    channelName: 'sale-test-tinet',
    uid: null as number | null, 
}

const requestMicrophonePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: '麦克风权限',
          message: '通话需要使用您的麦克风',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '确定',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Failed to request permission:', err);
      return false;
    }
  }
  return true; // iOS会在Info.plist中处理权限
};

export const useCallStore = create<CallState & CallActions>((set, get) => ({
  isCallActive: false,
  isMuted: false,
  remoteUserJoined: false,
  customerName: '',
  phoneNumber: '',
  engine: null,
  currentCallId: null,
  isIncomingCall: false,

  initEngine: async () => {
    if (!get().engine) {
      try {
        // 请求麦克风权限
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          console.error('No microphone permission granted');
          return;
        }

        const engine = createAgoraRtcEngine();
        engine.initialize({
          appId: config.appid,
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
        });

        // 启用音频模块
        await engine.enableAudio();
        
        // 设置音频场景为通话场景
        await engine.setAudioProfile(
          AudioProfileType.AudioProfileDefault,
          AudioScenarioType.AudioScenarioChatroom
        );

        // 启用说话者音量提示
        await engine.enableAudioVolumeIndication(200, 3, true);
        
        // 配置声网事件监听
        engine.addListener('onJoinChannelSuccess', (connection: RtcConnection, elapsed: number) => {
          console.log('JoinChannelSuccess', connection.channelId, elapsed);
        });

        engine.addListener('onUserJoined', (connection: RtcConnection, remoteUid: number, elapsed: number) => {
          console.log('UserJoined', remoteUid, elapsed);
        });

        engine.addListener('onUserOffline', (connection: RtcConnection, remoteUid: number, reason: UserOfflineReasonType) => {
          console.log('UserOffline', remoteUid, reason);
        });

        engine.addListener('onError', (error: number) => {
          console.error('RTC Error:', error);
        });

        // 添加音量提示的监听
        // engine.addListener('onAudioVolumeIndication', (connection: RtcConnection, speakers: any[], speakerNumber: number, totalVolume: number) => {
        //   console.log('Volume indication:', { speakers, speakerNumber, totalVolume });
        // });

        set({ engine });
      } catch (error) {
        console.error('Failed to init RTC engine:', error);
      }
    }
  },

  startCall: async (customerName: string, phoneNumber: string) => {
    const { engine, initEngine } = get();
    
    if (!engine) {
      await initEngine();
    }

    try {
      const uid = parseInt(phoneNumber.slice(-9));
      config.uid = uid;
      // 通过 Socket.IO 发起呼叫

      // 加入声网频道
      if (config.uid === null) {
        throw new Error('uid is null');
      }
      console.log('acceptIncomingCall', config.uid, config.channelName, config.token);
      socketService.initiateCall(config.uid.toString(), customerName, config.channelName);

      await engine?.joinChannel(
        config.token,
        config.channelName,
        config.uid,
        {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishMicrophoneTrack: true,
          enableAudioRecordingOrPlayout: true,
          autoSubscribeAudio: true,
        }
      );

      set({
        isCallActive: true,
        customerName,
        phoneNumber,
      });
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  },

  endCall: async () => {
    const { engine, currentCallId } = get();
    if (engine) {
      try {
        await engine.leaveChannel();
        
        // 通知服务器通话结束
        if (currentCallId) {
          socketService.endCall(currentCallId);
        }

        set({
          isCallActive: false,
          remoteUserJoined: false,
          customerName: '',
          phoneNumber: '',
          currentCallId: null,
          isIncomingCall: false,
        });
      } catch (error) {
        console.error('Failed to end call:', error);
      }
    }
  },

  toggleMute: async () => {
    const { engine, isMuted } = get();
    if (engine) {
      try {
        await engine.muteLocalAudioStream(!isMuted);
        set({ isMuted: !isMuted });
      } catch (error) {
        console.error('Failed to toggle mute:', error);
      }
    }
  },

  setRemoteUserJoined: (joined) => set({
    remoteUserJoined: joined,
  }),

  handleIncomingCall: (callId: string, customerName: string, phoneNumber: string) => {
    set({
      currentCallId: callId,
      customerName,
      phoneNumber,
      isIncomingCall: true,
    });
  },

  acceptIncomingCall: () => {
    const { currentCallId, engine } = get();
    if (currentCallId) {
      socketService.acceptCall(currentCallId);

      // 加入声网频道
      if (config.uid === null) {
        throw new Error('uid is null');
      }
      engine?.joinChannel(
        config.token,
        config.channelName,
        config.uid,
        {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishMicrophoneTrack: true,
          enableAudioRecordingOrPlayout: true,
          autoSubscribeAudio: true,
        }
      );

      set({
        isCallActive: true,
        isIncomingCall: false,
      });
    }
  },

  rejectIncomingCall: () => {
    const { currentCallId } = get();
    if (currentCallId) {
      socketService.rejectCall(currentCallId);
      set({
        currentCallId: null,
        customerName: '',
        phoneNumber: '',
        isIncomingCall: false,
      });
    }
  },
})); 