export const getMockedExchangeRate = (): number => 300; // 1 USD = 300 LKR

export const convertUSDToLKR = (usd: number): number => {
  const rate = getMockedExchangeRate();
  return usd * rate;
};
