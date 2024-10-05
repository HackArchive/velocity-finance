export enum Symbols {
  BTCUSD = "PYTH:BTCUSD",
  ETHUSD = "PYTH:ETHUSD",
  SOLUSD = "PYTH:SOLUSD",
}

export interface Trade {
  orderType: "LONG" | "SHORT";
  symbol: string;
  tradeSize: number;
  leverage?: number;
  limitPrice?: number;
  margin?: number;
}
