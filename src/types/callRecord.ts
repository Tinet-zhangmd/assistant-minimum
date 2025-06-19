export type CallStatus = '已接通' | '未接通';

export interface CallRecord {
  id: number;
  phone: string;
  callTime: string; // ISO字符串
  status: CallStatus;
  duration: number; // 单位：秒
  recordingUrl: string;
  transcript?: string;
}

export interface CallRecordFilter {
  status?: CallStatus;
  durationRange?: '全部' | '0-1分钟' | '1-5分钟' | '5分钟以上';
} 