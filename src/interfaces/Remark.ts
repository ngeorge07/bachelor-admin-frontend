export interface Message {
  _id: string;
  title: string;
  message: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Remark {
  _id: string;
  trainNumber: string;
  messages: Message[];
  __v: number;
}
