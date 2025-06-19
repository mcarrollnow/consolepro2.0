import { NextApiRequest, NextApiResponse } from 'next';

// Mock data for customer history
const customerHistoryData = {
  'customer1': [
    { date: '2023-10-01', action: 'Order placed', details: 'Order #1234' },
    { date: '2023-10-05', action: 'Order shipped', details: 'Order #1234' },
  ],
  'customer2': [
    { date: '2023-09-15', action: 'Order placed', details: 'Order #5678' },
    { date: '2023-09-20', action: 'Order delivered', details: 'Order #5678' },
  ],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customerId } = req.query;

  if (!customerId || typeof customerId !== 'string') {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  const history = customerHistoryData[customerId];

  if (!history) {
    return res.status(404).json({ error: 'Customer history not found' });
  }

  res.status(200).json(history);
} 