import axios from 'axios';
import { Task } from '../types/task';

const BASE_URL = 'https://api.example.com'; // 这里替换为实际的API地址

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    try {
      // 模拟API调用
      return [
        { id: 1, name: '黄伟', phone: '15890604060', description: '客户咨询价格，准备购买', lastContact: '2025-05-23 16:59', priority: 'high' },
        { id: 2, name: '刘军', phone: '15739977573', description: '客户咨询价格，准备购买', lastContact: '2025-05-23 16:00', priority: 'high' },
        { id: 3, name: '张静', phone: '13665617288', description: '需要更多产品信息', lastContact: '2025-05-23 15:30', priority: 'high' },
      ];
      // const response = await axios.get<Task[]>(`${BASE_URL}/tasks`);
      // return response.data;
    } catch (error) {
      console.error('获取任务列表失败:', error);
      throw error;
    }
  },
}; 