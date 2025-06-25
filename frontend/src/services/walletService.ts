import axios from 'axios';
import { getAccessToken } from '../utils/auth.ts'; // Updated path to client-side auth utils

const API_BASE = 'http://192.168.1.3:5000/api/wallet'; // Update with your backend URL

export const getBalance = async (): Promise<number> => {
  const token = await getAccessToken();
  console.log('Fetched token:', token); // Debug
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

export const sendPayment = async (vendorId: string, amount: number): Promise<void> => {
  const token = await getAccessToken();
  await axios.post(
    `${API_BASE}/pay`,
    { vendorId, amount },
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export interface Transaction {
  type: 'TOPUP' | 'PAYMENT';
  amountLKR: number;
  vendorId?: string;
  timestamp: string;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const token = await getAccessToken();
  const res = await axios.get(`${API_BASE}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.transactions;
};
