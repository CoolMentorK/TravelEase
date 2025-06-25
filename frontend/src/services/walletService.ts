import axios from 'axios';
import { getAccessToken } from '../utils/auth.ts'; // Updated path to client-side auth utils

const API_BASE = 'http://localhost:5000/api/wallet'; // Update with your backend URL

export const getBalance = async (): Promise<number> => {
  const token = await getAccessToken();
  const res = await axios.get(`${API_BASE}/balance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.balance;
};

export const topUpWallet = async (amount: number): Promise<void> => {
  const token = await getAccessToken();
  await axios.post(
    `${API_BASE}/topup`,
    { amount },
    { headers: { Authorization: `Bearer ${token}` } },
  );
};
