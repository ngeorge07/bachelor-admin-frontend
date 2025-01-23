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
  delay: number;
  messages: Message[];
  __v: number;
}
