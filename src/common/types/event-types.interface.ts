export interface EventPayloads {
  'order.create': {
    name: string;
    email: string;
    subject: string;
    totalCost: string;
  };
  'user.reset-password': { name: string; email: string; link: string };
  'user.verify-email': { name: string; email: string; otp: string };
}
