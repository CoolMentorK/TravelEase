import axios from 'axios';
import { getAccessToken } from '../utils/auth.ts';
import getEnvVars from '../../config.tsx';

const { API_BASE_URL } = getEnvVars();
const API_BASE = `${API_BASE_URL}/api/wallet`;

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
