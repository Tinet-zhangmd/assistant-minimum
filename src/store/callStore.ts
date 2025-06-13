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

interface CallState {
  isInCall: boolean;
  customerName: string;
  phoneNumber: string;
  engine: IRtcEngine | null;
  joinChannelSuccess: boolean;
  peerIds: number[];
  isMuted: boolean;
}

interface CallActions {
  initEngine: () => Promise<void>;
  startCall: (customerName: string, phoneNumber: string) => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => Promise<void>;
}

const config = {
    appid: 'c4fb2d705dc74c2885d613baecdef2bd',
    token: '007eJxTYNDb3W/ok8xaznhIL+7X3giVCp6zD7ra1iUusGrUz3UyfqbAkGySlmSUYm5gmpJsbpJsZGFhmmJmaJyUmJqckppmlJRSf8c7oyGQkWFB0UQWRgYIBPH5GYoTc1J1S1KLS3RLMvNSSxgYAF4lIzU=',
    channelName: 'sale-test-tinet',
    uid: Math.floor(Math.random() * 100000), 
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
  isInCall: false,
  customerName: '',
  phoneNumber: '',
  engine: null,
  joinChannelSuccess: false,
  peerIds: [],
  isMuted: false,

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
          set({ joinChannelSuccess: true });
        });

        engine.addListener('onUserJoined', (connection: RtcConnection, remoteUid: number, elapsed: number) => {
          console.log('UserJoined', remoteUid, elapsed);
          set(state => ({
            peerIds: [...state.peerIds, remoteUid]
          }));
        });

        engine.addListener('onUserOffline', (connection: RtcConnection, remoteUid: number, reason: UserOfflineReasonType) => {
          console.log('UserOffline', remoteUid, reason);
          set(state => ({
            peerIds: state.peerIds.filter(id => id !== remoteUid)
          }));
        });

        engine.addListener('onError', (error: number) => {
          console.error('RTC Error:', error);
        });

        // 添加音量提示的监听
        engine.addListener('onAudioVolumeIndication', (connection: RtcConnection, speakers: any[], speakerNumber: number, totalVolume: number) => {
          console.log('Volume indication:', { speakers, speakerNumber, totalVolume });
        });

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
      // 设置频道媒体选项
      const options: ChannelMediaOptions = {
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishMicrophoneTrack: true,
        autoSubscribeAudio: true,
        enableAudioRecordingOrPlayout: true,
      };

      // 加入频道
      await get().engine?.joinChannel(config.token, config.channelName, config.uid, options);
      
      set({
        isInCall: true,
        customerName,
        phoneNumber,
      });
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  },

  endCall: async () => {
    const { engine } = get();
    if (engine) {
      try {
        await engine.leaveChannel();
        set({
          isInCall: false,
          customerName: '',
          phoneNumber: '',
          joinChannelSuccess: false,
          peerIds: [],
          isMuted: false,
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
})); 