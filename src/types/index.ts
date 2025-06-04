export interface CalculationRecord {
  id: string; // unique id for the record
  productId: string;
  productName: string;
  originalValue: number;
  percentageApplied: number;
  calculatedValue: number;
  timestamp: Date;
}
