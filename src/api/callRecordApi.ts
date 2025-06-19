import { CallRecord, CallRecordFilter } from '../types/callRecord';

const MOCK_RECORDS: CallRecord[] = Array.from({ length: 68 }).map((_, i) => {
  const id = 1000 + i;
  const phone = `138****${id}`;
  const status = i % 3 === 0 ? '已接通' : '未接通';
  const duration = status === '已接通' ? Math.floor(Math.random() * 300 + 30) : 0;
  const callTime = `2025/6/${19 - Math.floor(i / 10)} ${String(10 - (i % 10)).padStart(2, '0')}:36:49`;
  return {
    id,
    phone,
    callTime,
    status,
    duration,
    recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    transcript: '',
  };
});

export async function fetchCallRecords(
  page: number,
  pageSize: number,
  filter: CallRecordFilter = {}
): Promise<{ list: CallRecord[]; total: number }> {
  let filtered = MOCK_RECORDS;
  if (filter.status) {
    filtered = filtered.filter(r => r.status === filter.status);
  }
  if (filter.durationRange && filter.durationRange !== '全部') {
    if (filter.durationRange === '0-1分钟') filtered = filtered.filter(r => r.duration > 0 && r.duration <= 60);
    if (filter.durationRange === '1-5分钟') filtered = filtered.filter(r => r.duration > 60 && r.duration <= 300);
    if (filter.durationRange === '5分钟以上') filtered = filtered.filter(r => r.duration > 300);
  }
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ list: filtered.slice(start, end), total });
    }, 300);
  });
} 