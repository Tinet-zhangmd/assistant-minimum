export type RootStackParamList = {
  Home: undefined;
  Call: {
    customerName: string;
    phoneNumber: string;
  };
};

export type TopTabParamList = {
  Pending: undefined;  // 待处理
  Processing: undefined;  // 处理中
  Completed: undefined;  // 已完成
}; 