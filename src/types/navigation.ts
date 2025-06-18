export type RootStackParamList = {
  Home: undefined;
  CallSession: {
    phone: string;
  };
  Call: {
    customerName: string;
    phoneNumber: string;
  };
  电话: undefined;
  记录: undefined;
  看板: undefined;
  我的: undefined;
};

export type TopTabParamList = {
  Pending: undefined;  // 待处理
  Processing: undefined;  // 处理中
  Completed: undefined;  // 已完成
}; 