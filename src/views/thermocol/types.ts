export interface SenderConfig {
  name: string;
  address: string;
  gstin: string;
}

export interface ThermocolProduct {
  id: string;
  name: string;
  packSize: string;
  packSizeMultiple: number; // e.g. 10, 12, 20
  price: number; // Locked rate / standard selling rate
  weight: number; // Weight per unit in kg
  cft: number; // Cubic feet per unit
  stock?: number;
}

export interface ThermocolParty {
  name: string;
  address: string;
  gstin: string;
}

export interface ThermocolTransporter {
  name: string;
  gstin: string;
}

export interface ClientDemand {
  id: string;
  partyName: string;
  productName: string;
  monthlyLimit: number;
}

export interface InvoiceLineItem {
  id: string;
  productId?: string;
  productName: string;
  packSize: string;
  packSizeMultiple: number;
  qty: number;
  rate: number;
  weight: number;
  cft: number;
  taxableValue: number;
  gstValue: number;
  totalValue: number;
  isInvalidMultiple?: boolean;
}

export interface ThermocolInvoice {
  invNo: string;
  date: string;
  partyName: string;
  partyAddress: string;
  partyGstin: string;
  senderName: string;
  senderAddress: string;
  senderGstin: string;
  transName: string;
  transGstin: string;
  lrNo: string;
  lrDate: string;
  vehicleNo: string;
  ewayBillNo?: string;
  totalTaxable: string;
  totalGst: string;
  grandTotal: string;
  totalQty: number;
  totalWeight: string;
  totalCft: string;
  items: InvoiceLineItem[];
}

export interface InwardGridRow {
  id: string;
  grNo: string;
  receiveDate: string;
  invNo: string;
  productName: string;
  packSize: string;
  qty: number | '';
  price: number | '';
  gstPercent: number;
  transName: string;
  lrNo: string;
  lrDate: string;
}

export interface ThermocolInward {
  id: string;
  grNo: string;
  receiveDate: string;
  invNo: string;
  productName: string;
  packSize: string;
  initialQty: number;
  availableQty: number;
  price: number;
  gstPercent: number; // 18%
  transName: string;
  lrNo: string;
  lrDate: string;
  totalAmount: number;
}
