import { SenderConfig, ThermocolProduct, ThermocolParty, ThermocolTransporter, ThermocolInward, ClientDemand } from './types';

export const DEFAULT_SENDER: SenderConfig = {
  name: "ICH Indore",
  address: "Industrial Area, Sector C, Indore, MP - 452015",
  gstin: "23ICHIN1234F1Z5"
};

export const DEFAULT_PRODUCTS: ThermocolProduct[] = [
  {
    id: 'prod_sheet_10',
    name: 'Thermocol Sheet 10mm',
    packSize: 'Bundle of 10',
    packSizeMultiple: 10,
    price: 15.0,
    weight: 1.5,
    cft: 0.40,
    stock: 500
  },
  {
    id: 'prod_box_10',
    name: 'Thermocol Box 10kg',
    packSize: 'Box of 10',
    packSizeMultiple: 10,
    price: 85.0,
    weight: 1.2,
    cft: 0.35,
    stock: 600
  },
  {
    id: 'prod_box_5',
    name: 'Thermocol Box 5kg',
    packSize: 'Box of 10',
    packSizeMultiple: 10,
    price: 55.0,
    weight: 0.7,
    cft: 0.20,
    stock: 800
  },
  {
    id: 'prod_eps_20',
    name: 'EPS Sheet 20mm',
    packSize: 'Bundle of 12',
    packSizeMultiple: 12,
    price: 120.0,
    weight: 2.0,
    cft: 0.50,
    stock: 480
  },
  {
    id: 'prod_corner',
    name: 'Custom Molded Corner',
    packSize: 'Box of 20',
    packSizeMultiple: 20,
    price: 18.0,
    weight: 0.15,
    cft: 0.04,
    stock: 1200
  },
  {
    id: 'prod_edge_zero',
    name: 'Custom EPS Edge Protector (Out of Stock)',
    packSize: 'Box of 25',
    packSizeMultiple: 25,
    price: 25.0,
    weight: 0.25,
    cft: 0.06,
    stock: 0
  }
];

export const DEFAULT_PARTIES: ThermocolParty[] = [
  { name: 'Aarav Packaging Industries', address: 'Plot 42, Heavy Industrial Area, Dewas, MP', gstin: '23AARAV1234A1Z1' },
  { name: 'Shree Ganesh Thermocol', address: 'Shop 12, Transport Nagar, Indore, MP', gstin: '23GANES5678B1Z2' },
  { name: 'Apex Logistics & Boxes', address: 'Sector D, Pithampur Industrial Estate, Dhar, MP', gstin: '23APEX9012C1Z3' }
];

export const DEFAULT_TRANSPORTERS: ThermocolTransporter[] = [
  { name: 'VRL Logistics', gstin: '23AABCV1234P1Z4' },
  { name: 'Safe Express', gstin: '23AABCS5678Q1Z8' },
  { name: 'TCI Freight', gstin: '23AABCT9012R1Z2' },
  { name: 'Gati KWE', gstin: '23AABCG3456S1Z6' },
  { name: 'Rivigo Freight', gstin: '23AABCR7890T1Z0' }
];

export const DEFAULT_DEMANDS: ClientDemand[] = [
  { id: 'dem_1', partyName: 'Aarav Packaging Industries', productName: 'Thermocol Box 10kg', monthlyLimit: 3000 },
  { id: 'dem_2', partyName: 'Aarav Packaging Industries', productName: 'Thermocol Sheet 10mm', monthlyLimit: 5000 },
  { id: 'dem_3', partyName: 'Shree Ganesh Thermocol', productName: 'Thermocol Box 5kg', monthlyLimit: 4000 },
  { id: 'dem_4', partyName: 'Apex Logistics & Boxes', productName: 'EPS Sheet 20mm', monthlyLimit: 2500 }
];

export const DEFAULT_INWARDS: ThermocolInward[] = [
  {
    id: 'TH_INW_101',
    grNo: 'GR-2026-01',
    receiveDate: '2026-09-24',
    invNo: 'SUP-INV-8891',
    productName: 'Thermocol Box 10kg',
    packSize: 'Box of 10',
    initialQty: 1000,
    availableQty: 600,
    price: 85,
    gstPercent: 18,
    transName: 'VRL Logistics',
    lrNo: 'LR-9901',
    lrDate: '2026-09-24',
    totalAmount: 100300
  },
  {
    id: 'TH_INW_102',
    grNo: 'GR-2026-02',
    receiveDate: '2026-09-24',
    invNo: 'SUP-INV-8892',
    productName: 'Thermocol Sheet 10mm',
    packSize: 'Bundle of 10',
    initialQty: 500,
    availableQty: 500,
    price: 15.0,
    gstPercent: 18,
    transName: 'Safe Express',
    lrNo: 'LR-9902',
    lrDate: '2026-09-24',
    totalAmount: 8850
  },
  {
    id: 'TH_INW_104',
    grNo: 'GR-2026-04',
    receiveDate: '2026-09-25',
    invNo: 'SUP-INV-8894',
    productName: 'Thermocol Box 5kg',
    packSize: 'Box of 10',
    initialQty: 800,
    availableQty: 800,
    price: 55.0,
    gstPercent: 18,
    transName: 'Gati KWE',
    lrNo: 'LR-9904',
    lrDate: '2026-09-25',
    totalAmount: 51920
  },
  {
    id: 'TH_INW_105',
    grNo: 'GR-2026-05',
    receiveDate: '2026-09-25',
    invNo: 'SUP-INV-8895',
    productName: 'EPS Sheet 20mm',
    packSize: 'Bundle of 12',
    initialQty: 500,
    availableQty: 480,
    price: 120.0,
    gstPercent: 18,
    transName: 'Rivigo Freight',
    lrNo: 'LR-9905',
    lrDate: '2026-09-25',
    totalAmount: 67968
  },
  {
    id: 'TH_INW_106',
    grNo: 'GR-2026-06',
    receiveDate: '2026-09-25',
    invNo: 'SUP-INV-8896',
    productName: 'Custom Molded Corner',
    packSize: 'Box of 20',
    initialQty: 1500,
    availableQty: 1200,
    price: 18.0,
    gstPercent: 18,
    transName: 'VRL Logistics',
    lrNo: 'LR-9906',
    lrDate: '2026-09-25',
    totalAmount: 31860
  }
];

export function numberToWords(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertTwoDigit = (n: number): string => {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
  };

  const convertThreeDigit = (n: number): string => {
    if (n === 0) return '';
    if (n < 100) return convertTwoDigit(n);
    return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertTwoDigit(n % 100) : '');
  };

  const rounded = Math.floor(Math.abs(num));
  if (rounded === 0) return 'Zero Rupees Only';

  let result = '';
  const crore = Math.floor(rounded / 10000000);
  const lakh = Math.floor((rounded % 10000000) / 100000);
  const thousand = Math.floor((rounded % 100000) / 1000);
  const remainder = rounded % 1000;

  if (crore > 0) result += convertThreeDigit(crore) + ' Crore ';
  if (lakh > 0) result += convertThreeDigit(lakh) + ' Lakh ';
  if (thousand > 0) result += convertThreeDigit(thousand) + ' Thousand ';
  if (remainder > 0) result += convertThreeDigit(remainder);

  const paise = Math.round((Math.abs(num) - rounded) * 100);
  let words = result.trim() + ' Rupees';
  if (paise > 0) {
    words += ' and ' + convertTwoDigit(paise) + ' Paise';
  }
  return words + ' Only';
}
