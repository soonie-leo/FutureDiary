export interface IAssetInfo {
  date: string;
  netAsset: number;
  loan: number;
  realty: number;
  stock: number;
  cash: number;
}

export interface ITargetInfo {
  annualAsset: number;
  monthlyIncome: number;
  monthlyConsumption: number;
}
