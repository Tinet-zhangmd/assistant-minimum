import { create } from 'zustand';
import { CallRecord, CallRecordFilter } from '../types/callRecord';
import { fetchCallRecords } from '../api/callRecordApi';

interface CallRecordState {
  records: CallRecord[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  filter: CallRecordFilter;
  loadRecords: (page?: number) => Promise<void>;
  setFilter: (filter: CallRecordFilter) => void;
  resetFilter: () => void;
}

export const useCallRecordStore = create<CallRecordState>((set, get) => ({
  records: [],
  total: 0,
  page: 1,
  pageSize: 20,
  loading: false,
  filter: {},
  loadRecords: async (page = 1) => {
    set({ loading: true });
    const { pageSize, filter } = get();
    const res = await fetchCallRecords(page, pageSize, filter);
    set({ records: res.list, total: res.total, page, loading: false });
  },
  setFilter: (filter) => {
    set({ filter });
    get().loadRecords(1);
  },
  resetFilter: () => {
    set({ filter: {} });
    get().loadRecords(1);
  },
})); 