import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowUpRight, 
  ClipboardList, 
  Warehouse, 
  FileSpreadsheet, 
  Edit3, 
  Printer, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Download, 
  Lock, 
  FileText,
  Scale,
  Box,
  Truck,
  Layers,
  Users,
  Database,
  BarChart3
} from 'lucide-react';
import { 
  SenderConfig, 
  ThermocolProduct, 
  ThermocolParty, 
  ThermocolTransporter, 
  ThermocolInvoice, 
  ThermocolInward, 
  InwardGridRow,
  InvoiceLineItem,
  ClientDemand 
} from './thermocol/types';
import { 
  DEFAULT_SENDER, 
  DEFAULT_PRODUCTS, 
  DEFAULT_PARTIES, 
  DEFAULT_TRANSPORTERS, 
  DEFAULT_INWARDS,
  DEFAULT_DEMANDS,
  numberToWords 
} from './thermocol/utils';
import { OriginConfigHeader } from './thermocol/OriginConfigHeader';
import { TaxInvoiceModal } from './thermocol/TaxInvoiceModal';

export const PackingMaterialView: React.FC = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'orderTab' | 'previewPrintTab' | 'editInvoiceTab' | 'reportTab' | 'demandSupplyTab' | 'inwardTab' | 'masterTab'
  >('orderTab');

  // Consignor / Sender Origin Config
  const [sender, setSender] = useState<SenderConfig>(() => {
    try {
      const saved = localStorage.getItem('th_wms_sender_v6');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SENDER;
  });

  const handleUpdateSender = (updated: SenderConfig) => {
    setSender(updated);
    try {
      localStorage.setItem('th_wms_sender_v6', JSON.stringify(updated));
    } catch (e) {}
  };

  // Masters
  const [products, setProducts] = useState<ThermocolProduct[]>(() => {
    try {
      const saved = localStorage.getItem('th_wms_products_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_PRODUCTS;
  });

  const [parties, setParties] = useState<ThermocolParty[]>(() => {
    try {
      const saved = localStorage.getItem('th_wms_parties_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_PARTIES;
  });

  const [transporters, setTransporters] = useState<ThermocolTransporter[]>(() => {
    try {
      const saved = localStorage.getItem('th_wms_trans_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_TRANSPORTERS;
  });

  // Client Demands Master
  const [clientDemands, setClientDemands] = useState<ClientDemand[]>(() => {
    try {
      const saved = localStorage.getItem('th_wms_demands_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_DEMANDS;
  });

  // Inwards (Incoming stock lots)
  const [inwards, setInwards] = useState<ThermocolInward[]>(() => {
    try {
      const saved = localStorage.getItem('th_wms_inwards_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_INWARDS;
  });

  // Generated Invoices
  const [invoices, setInvoices] = useState<ThermocolInvoice[]>(() => {
    try {
      const saved = localStorage.getItem('th_wms_invoices_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        invNo: 'ICHIND/26-27/001',
        date: '2026-09-24',
        partyName: 'Aarav Packaging Industries',
        partyAddress: 'Plot 42, Heavy Industrial Area, Dewas, MP',
        partyGstin: '23AARAV1234A1Z1',
        senderName: DEFAULT_SENDER.name,
        senderAddress: DEFAULT_SENDER.address,
        senderGstin: DEFAULT_SENDER.gstin,
        transName: 'VRL Logistics',
        transGstin: '23AABCV1234P1Z4',
        lrNo: 'LR-9901',
        lrDate: '2026-09-24',
        vehicleNo: 'MP09-AB-1234',
        ewayBillNo: 'EWB-231908273615',
        totalTaxable: '8500.00',
        totalGst: '1530.00',
        grandTotal: '10030.00',
        totalQty: 100,
        totalWeight: '120.00',
        totalCft: '35.00',
        items: [
          {
            id: 'line_init_1',
            productId: 'prod_box_10',
            productName: 'Thermocol Box 10kg',
            packSize: 'Box of 10',
            packSizeMultiple: 10,
            qty: 100,
            rate: 85,
            weight: 120,
            cft: 35,
            taxableValue: 8500,
            gstValue: 1530,
            totalValue: 10030
          }
        ]
      }
    ];
  });

  // Strict Series Continuity: FY 2026-27 format ICHIND/26-27/001, 002, etc. (never decrements or resets when deleted)
  const [invoiceSeq, setInvoiceSeq] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('th_wms_ord_seq_v6');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 2; // Next is 002 since 001 exists
  });

  const formatInvNo = (seq: number) => `ICHIND/26-27/${String(seq).padStart(3, '0')}`;

  const persistStorage = (
    newProds = products,
    newParts = parties,
    newTrans = transporters,
    newDemands = clientDemands,
    newInws = inwards,
    newInvs = invoices,
    newSeq = invoiceSeq
  ) => {
    try {
      localStorage.setItem('th_wms_products_v6', JSON.stringify(newProds));
      localStorage.setItem('th_wms_parties_v6', JSON.stringify(newParts));
      localStorage.setItem('th_wms_trans_v6', JSON.stringify(newTrans));
      localStorage.setItem('th_wms_demands_v6', JSON.stringify(newDemands));
      localStorage.setItem('th_wms_inwards_v6', JSON.stringify(newInws));
      localStorage.setItem('th_wms_invoices_v6', JSON.stringify(newInvs));
      localStorage.setItem('th_wms_ord_seq_v6', String(newSeq));
    } catch (e) {}
  };

  // Helper to compute available stock for a specific product
  const getProductStock = (prod: ThermocolProduct) => {
    return inwards
      .filter(i => i.productName === prod.name)
      .reduce((sum, i) => sum + (Number(i.availableQty) || 0), 0);
  };

  // Available in-stock products (Zero-Stock Filtering: stock > 0 ONLY)
  const availableProducts = useMemo(() => {
    return products.filter(p => {
      const stock = getProductStock(p);
      return stock > 0;
    });
  }, [products, inwards]);

  // ----------------------------------------------------
  // Module C: Order Entry & New Outward Invoice
  // ----------------------------------------------------
  const [ordInvNo, setOrdInvNo] = useState(formatInvNo(invoiceSeq));
  const [ordDate, setOrdDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [ordPartyName, setOrdPartyName] = useState(parties[0]?.name || '');
  const [ordTransName, setOrdTransName] = useState(transporters[0]?.name || '');
  const [ordLrNo, setOrdLrNo] = useState('');
  const [ordLrDate, setOrdLrDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [ordVehicle, setOrdVehicle] = useState('MP09-AB-1234');
  const [ordEwayBill, setOrdEwayBill] = useState('EWB-231908273615');
  const [orderMsg, setOrderMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    setOrdInvNo(formatInvNo(invoiceSeq));
  }, [invoiceSeq]);

  const [orderLines, setOrderLines] = useState<Array<{
    id: string;
    productId: string;
    productName: string;
    qty: number | '';
  }>>(() => {
    const initProd = availableProducts[0] || products[0];
    return [
      {
        id: 'ord_line_1',
        productId: initProd?.id || 'prod_1',
        productName: initProd?.name || '',
        qty: initProd?.packSizeMultiple || 10
      }
    ];
  });

  const addOrderLine = () => {
    const p = availableProducts[0] || products[0];
    setOrderLines(prev => [
      ...prev,
      {
        id: 'ord_line_' + Date.now() + Math.random().toString(36).substring(2, 5),
        productId: p?.id || 'prod_1',
        productName: p?.name || '',
        qty: p?.packSizeMultiple || 10
      }
    ]);
  };

  const removeOrderLine = (id: string) => {
    setOrderLines(prev => prev.filter(l => l.id !== id));
  };

  // Monthly Client Demand Tracking & Validation Check
  const monthlyDemandValidation = useMemo(() => {
    const currentMonthPrefix = ordDate ? ordDate.substring(0, 7) : new Date().toISOString().substring(0, 7);
    const warnings: string[] = [];

    orderLines.forEach(line => {
      const prod = products.find(p => p.id === line.productId) || 
                   products.find(p => p.name === line.productName) || 
                   products[0];
      if (!prod) return;

      const demandRule = clientDemands.find(d => d.partyName === ordPartyName && d.productName === prod.name);
      if (!demandRule) return;

      // Calculate already dispatched units for this client and product in current month
      let dispatchedThisMonth = 0;
      invoices.forEach(inv => {
        if (inv.partyName === ordPartyName && inv.date.startsWith(currentMonthPrefix)) {
          inv.items.forEach(it => {
            if (it.productName === prod.name) {
              dispatchedThisMonth += it.qty;
            }
          });
        }
      });

      const requestedQty = Number(line.qty) || 0;
      const remainingLimit = demandRule.monthlyLimit - dispatchedThisMonth;

      if (dispatchedThisMonth + requestedQty > demandRule.monthlyLimit) {
        warnings.push(
          `Monthly demand for "${prod.name}" to "${ordPartyName}" is ${demandRule.monthlyLimit} units. ${dispatchedThisMonth} units already dispatched this month. Requested Qty (${requestedQty}) exceeds remaining limit (${Math.max(0, remainingLimit)})!`
        );
      }
    });

    return {
      hasDemandWarning: warnings.length > 0,
      demandWarningMessage: warnings.join(' ')
    };
  }, [orderLines, ordPartyName, ordDate, clientDemands, invoices, products]);

  // Order lines automated calculations & pack size validation check
  const orderCalculations = useMemo(() => {
    let totalTaxable = 0;
    let totalGst = 0;
    let grandTotal = 0;
    let totalQty = 0;
    let totalWeight = 0;
    let totalCft = 0;
    let hasPackSizeError = false;
    let packSizeErrorMessage = '';

    const lines = orderLines.map(l => {
      const prod = products.find(p => p.id === l.productId) || 
                   products.find(p => p.name === l.productName) || 
                   products[0];

      const q = Number(l.qty) || 0;
      const multiple = prod?.packSizeMultiple || 1;
      const rate = prod?.price || 0;

      // Pack size validation check
      const isInvalidMultiple = q > 0 && q % multiple !== 0;
      if (isInvalidMultiple) {
        hasPackSizeError = true;
        packSizeErrorMessage = `Invalid quantity for ${prod.name}: Quantity (${q}) must be a multiple of pack size ${multiple} (${prod.packSize})!`;
      }

      const taxable = q * rate;
      const gst = taxable * 0.18;
      const total = taxable + gst;
      const lineWt = q * (prod?.weight || 0);
      const lineCft = q * (prod?.cft || 0);

      totalTaxable += taxable;
      totalGst += gst;
      grandTotal += total;
      totalQty += q;
      totalWeight += lineWt;
      totalCft += lineCft;

      return {
        id: l.id,
        productId: prod?.id,
        productName: prod?.name || l.productName,
        packSize: prod?.packSize || 'Standard',
        packSizeMultiple: multiple,
        qty: q,
        rate: rate,
        weight: Number(lineWt.toFixed(2)),
        cft: Number(lineCft.toFixed(2)),
        taxableValue: Number(taxable.toFixed(2)),
        gstValue: Number(gst.toFixed(2)),
        totalValue: Number(total.toFixed(2)),
        isInvalidMultiple
      };
    });

    return {
      lines,
      totalTaxable: totalTaxable.toFixed(2),
      totalGst: totalGst.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      totalQty,
      totalWeight: totalWeight.toFixed(2),
      totalCft: totalCft.toFixed(2),
      hasPackSizeError,
      packSizeErrorMessage,
      amountInWords: numberToWords(grandTotal)
    };
  }, [orderLines, products]);

  // Generate & Save Outward Invoice Line (With Live Inventory Deduction & Strict FY 26-27 Series)
  const handleSaveOutwardInvoice = () => {
    if (!ordPartyName.trim()) {
      setOrderMsg({ text: 'Please select a Client!', isError: true });
      return;
    }
    if (orderCalculations.hasPackSizeError) {
      setOrderMsg({ text: orderCalculations.packSizeErrorMessage, isError: true });
      return;
    }
    if (orderCalculations.totalQty <= 0) {
      setOrderMsg({ text: 'Please specify valid quantities for order items!', isError: true });
      return;
    }

    // Verify stock and deduct from inward lots
    const updatedInwards = [...inwards];
    for (const item of orderCalculations.lines) {
      let needed = item.qty;
      const matching = updatedInwards.filter(i => 
        i.productName === item.productName && 
        i.availableQty > 0
      );
      const totalAvail = matching.reduce((sum, i) => sum + i.availableQty, 0);

      if (totalAvail < needed) {
        setOrderMsg({ 
          text: `Insufficient inventory for "${item.productName}"! Required: ${needed}, Available: ${totalAvail}`, 
          isError: true 
        });
        return;
      }

      for (const inw of matching) {
        if (needed <= 0) break;
        const deduct = Math.min(inw.availableQty, needed);
        inw.availableQty -= deduct;
        needed -= deduct;
      }
    }

    const partyObj = parties.find(p => p.name === ordPartyName);
    const transObj = transporters.find(t => t.name === ordTransName);
    const currentInvNo = formatInvNo(invoiceSeq);

    const newInvoice: ThermocolInvoice = {
      invNo: currentInvNo,
      date: ordDate,
      partyName: ordPartyName,
      partyAddress: partyObj ? partyObj.address : 'Industrial Area, Dewas, MP',
      partyGstin: partyObj ? partyObj.gstin : '23UNREGISTERED',
      senderName: sender.name,
      senderAddress: sender.address,
      senderGstin: sender.gstin,
      transName: ordTransName,
      transGstin: transObj ? transObj.gstin : '',
      lrNo: ordLrNo.trim() || 'LR-PENDING',
      lrDate: ordLrDate,
      vehicleNo: ordVehicle.trim() || 'MP09-AB-1234',
      ewayBillNo: ordEwayBill.trim() || 'EWB-PENDING',
      totalTaxable: orderCalculations.totalTaxable,
      totalGst: orderCalculations.totalGst,
      grandTotal: orderCalculations.grandTotal,
      totalQty: orderCalculations.totalQty,
      totalWeight: orderCalculations.totalWeight,
      totalCft: orderCalculations.totalCft,
      items: orderCalculations.lines.map(l => ({
        id: l.id,
        productId: l.productId,
        productName: l.productName,
        packSize: l.packSize,
        packSizeMultiple: l.packSizeMultiple,
        qty: l.qty,
        rate: l.rate,
        weight: l.weight,
        cft: l.cft,
        taxableValue: l.taxableValue,
        gstValue: l.gstValue,
        totalValue: l.totalValue
      }))
    };

    const updatedInvoices = [newInvoice, ...invoices];
    const nextSeq = invoiceSeq + 1; // Strict series continuity increment

    setInwards(updatedInwards);
    setInvoices(updatedInvoices);
    setInvoiceSeq(nextSeq);
    persistStorage(products, parties, transporters, clientDemands, updatedInwards, updatedInvoices, nextSeq);

    setOrderMsg({ text: `Invoice ${currentInvNo} generated & stock deducted successfully!`, isError: false });
    setSelectedPreviewInv(newInvoice.invNo);
    setActiveTab('previewPrintTab');
  };

  // ----------------------------------------------------
  // Module D: Tax Invoice Preview & Print
  // ----------------------------------------------------
  const [selectedPreviewInv, setSelectedPreviewInv] = useState<string>(invoices[0]?.invNo || '');
  const activePreviewInvoice = useMemo(() => {
    return invoices.find(i => i.invNo === selectedPreviewInv) || invoices[0];
  }, [invoices, selectedPreviewInv]);

  // ----------------------------------------------------
  // Module E: Invoice Correction, Editing & Deletion
  // ----------------------------------------------------
  const [editInvNo, setEditInvNo] = useState<string>(invoices[0]?.invNo || '');
  const [editForm, setEditForm] = useState<ThermocolInvoice | null>(null);
  const [editMsg, setEditMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    const found = invoices.find(i => i.invNo === editInvNo);
    if (found) {
      setEditForm(JSON.parse(JSON.stringify(found)));
      setEditMsg(null);
    }
  }, [editInvNo, invoices]);

  const updateEditItem = (itemId: string, field: 'qty' | 'rate', val: any) => {
    if (!editForm) return;
    const num = val === '' ? 0 : Number(val);

    const updatedItems = editForm.items.map(it => {
      if (it.id !== itemId) return it;
      const q = field === 'qty' ? num : it.qty;
      const r = field === 'rate' ? num : it.rate;
      const taxable = q * r;
      const gst = taxable * 0.18;
      const total = taxable + gst;
      const prod = products.find(p => p.name === it.productName) || products[0];

      return {
        ...it,
        qty: q,
        rate: r,
        weight: Number((q * (prod?.weight || 1)).toFixed(2)),
        cft: Number((q * (prod?.cft || 0.3)).toFixed(2)),
        taxableValue: Number(taxable.toFixed(2)),
        gstValue: Number(gst.toFixed(2)),
        totalValue: Number(total.toFixed(2))
      };
    });

    let totalTaxable = 0;
    let totalGst = 0;
    let grandTotal = 0;
    let totalQty = 0;
    let totalWeight = 0;
    let totalCft = 0;

    updatedItems.forEach(it => {
      totalTaxable += it.taxableValue;
      totalGst += it.gstValue;
      grandTotal += it.totalValue;
      totalQty += it.qty;
      totalWeight += it.weight;
      totalCft += it.cft;
    });

    setEditForm({
      ...editForm,
      items: updatedItems,
      totalTaxable: totalTaxable.toFixed(2),
      totalGst: totalGst.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      totalQty,
      totalWeight: totalWeight.toFixed(2),
      totalCft: totalCft.toFixed(2)
    });
  };

  const handleSaveInvoiceCorrection = () => {
    if (!editForm) return;

    const updated = invoices.map(i => i.invNo === editForm.invNo ? editForm : i);
    setInvoices(updated);
    persistStorage(products, parties, transporters, clientDemands, inwards, updated, invoiceSeq);

    setEditMsg({ text: `Corrections saved successfully for ${editForm.invNo}!`, isError: false });
    setTimeout(() => setEditMsg(null), 3500);
  };

  // Delete Entire Invoice and restore inventory stock (Note: invoiceSeq is NOT reset/decremented)
  const handleDeleteInvoice = (invNoToDelete: string) => {
    const invToDelete = invoices.find(i => i.invNo === invNoToDelete);
    if (!invToDelete) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete invoice ${invNoToDelete}?\n\nThis will restore ${invToDelete.totalQty} items back to your live inward inventory. (Note: Invoice sequence number ICHIND/26-27 series will not be reset).`
    );
    if (!confirmed) return;

    // Restore inventory stock back to inwards
    const updatedInwards = [...inwards];
    for (const item of invToDelete.items) {
      let toRestore = item.qty;
      const matching = updatedInwards.filter(i => i.productName === item.productName);

      if (matching.length > 0) {
        matching[0].availableQty += toRestore;
      } else {
        updatedInwards.push({
          id: 'TH_RESTORE_' + Date.now() + Math.random().toString(36).substring(2, 5),
          grNo: 'RESTORE-' + invToDelete.invNo,
          receiveDate: new Date().toISOString().split('T')[0],
          invNo: 'RESTORE-' + invToDelete.invNo,
          productName: item.productName,
          packSize: item.packSize || 'Standard',
          initialQty: toRestore,
          availableQty: toRestore,
          price: item.rate,
          gstPercent: 18,
          transName: invToDelete.transName,
          lrNo: invToDelete.lrNo,
          lrDate: invToDelete.lrDate,
          totalAmount: Number((toRestore * item.rate * 1.18).toFixed(2))
        });
      }
    }

    const updatedInvoices = invoices.filter(i => i.invNo !== invNoToDelete);
    setInvoices(updatedInvoices);
    setInwards(updatedInwards);
    persistStorage(products, parties, transporters, clientDemands, updatedInwards, updatedInvoices, invoiceSeq);

    if (selectedPreviewInv === invNoToDelete) {
      setSelectedPreviewInv(updatedInvoices[0]?.invNo || '');
    }
    if (editInvNo === invNoToDelete) {
      setEditInvNo(updatedInvoices[0]?.invNo || '');
    }

    setEditMsg({ text: `Invoice ${invNoToDelete} deleted and inventory restored successfully!`, isError: false });
  };

  // ----------------------------------------------------
  // Module F: Billing & Dispatch Report
  // ----------------------------------------------------
  const [reportView, setReportView] = useState<'summary' | 'detailed'>('summary');
  const [reportSearch, setReportSearch] = useState('');

  const filteredInvoices = useMemo(() => {
    if (!reportSearch.trim()) return invoices;
    const q = reportSearch.toLowerCase();
    return invoices.filter(i => 
      i.invNo.toLowerCase().includes(q) ||
      i.partyName.toLowerCase().includes(q) ||
      i.transName.toLowerCase().includes(q) ||
      i.vehicleNo.toLowerCase().includes(q) ||
      (i.ewayBillNo && i.ewayBillNo.toLowerCase().includes(q))
    );
  }, [invoices, reportSearch]);

  const exportSummaryCsv = () => {
    const headers = 'Invoice_Number,Invoice_Date,Client_Name,Transporter,LR_Number,LR_Date,Vehicle_Number,Eway_Bill_Number,Total_Taxable_INR,Total_GST_18_INR,Total_Invoice_Value_INR,Total_Quantity,Total_Weight_kg,Total_CFT\n';
    const rows = filteredInvoices.map(i => 
      `"${i.invNo}","${i.date}","${i.partyName}","${i.transName}","${i.lrNo}","${i.lrDate}","${i.vehicleNo}","${i.ewayBillNo || ''}",${i.totalTaxable},${i.totalGst},${i.grandTotal},${i.totalQty},${i.totalWeight},${i.totalCft}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Billing_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportDetailedCsv = () => {
    const headers = 'Invoice_Number,Invoice_Date,Client_Name,Product_Name,Quantity,Rate_INR,Weight_kg,CFT,Taxable_Value_INR,GST_18_INR,Total_Value_INR,Transporter,LR_Number,Vehicle_Number,Eway_Bill_Number\n';
    const rows = filteredInvoices.flatMap(inv => 
      inv.items.map(it => 
        `"${inv.invNo}","${inv.date}","${inv.partyName}","${it.productName}",${it.qty},${it.rate},${it.weight},${it.cft},${it.taxableValue},${it.gstValue},${it.totalValue},"${inv.transName}","${inv.lrNo}","${inv.vehicleNo}","${inv.ewayBillNo || ''}"`
      )
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Billing_Detailed_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // ----------------------------------------------------
  // Module G: Demand vs. Supply Report
  // ----------------------------------------------------
  const demandVsSupplyData = useMemo(() => {
    const currentMonthPrefix = new Date().toISOString().substring(0, 7);
    return clientDemands.map(dem => {
      let dispatched = 0;
      invoices.forEach(inv => {
        if (inv.partyName === dem.partyName) {
          inv.items.forEach(it => {
            if (it.productName === dem.productName) {
              dispatched += it.qty;
            }
          });
        }
      });
      const remaining = dem.monthlyLimit - dispatched;
      const isExceeded = dispatched > dem.monthlyLimit;
      return {
        ...dem,
        dispatched,
        remaining,
        status: isExceeded ? 'Exceeded' : 'Within Quota'
      };
    });
  }, [clientDemands, invoices]);

  const exportDemandSupplyCsv = () => {
    const headers = 'Client_Name,Product_Name,Monthly_Demand_Limit,Total_Dispatched_Qty,Remaining_Demand_Qty,Status\n';
    const rows = demandVsSupplyData.map(d => 
      `"${d.partyName}","${d.productName}",${d.monthlyLimit},${d.dispatched},${d.remaining},"${d.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Demand_vs_Supply_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // ----------------------------------------------------
  // Module H: Inward Management & Excel-Style Available Stock Status
  // ----------------------------------------------------
  const [inwardSubTab, setInwardSubTab] = useState<'stock' | 'detail' | 'addGrid'>('stock');
  const [inwardGridRows, setInwardGridRows] = useState<InwardGridRow[]>([
    {
      id: 'grid_row_1',
      grNo: 'GR-2026-10',
      receiveDate: new Date().toISOString().split('T')[0],
      invNo: 'SUP-INV-8901',
      productName: products[0]?.name || '',
      packSize: products[0]?.packSize || 'Bundle of 10',
      qty: 200,
      price: products[0]?.price || 15,
      gstPercent: 18,
      transName: transporters[0]?.name || 'VRL Logistics',
      lrNo: 'LR-9910',
      lrDate: new Date().toISOString().split('T')[0]
    }
  ]);

  const addInwardRow = () => {
    const p = products[0];
    setInwardGridRows(prev => [
      ...prev,
      {
        id: 'grid_row_' + Date.now(),
        grNo: `GR-2026-${Math.floor(10 + Math.random() * 90)}`,
        receiveDate: new Date().toISOString().split('T')[0],
        invNo: `SUP-INV-${Math.floor(100 + Math.random() * 900)}`,
        productName: p?.name || '',
        packSize: p?.packSize || '',
        qty: 100,
        price: p?.price || 50,
        gstPercent: 18,
        transName: transporters[0]?.name || 'VRL Logistics',
        lrNo: `LR-${Math.floor(1000 + Math.random() * 9000)}`,
        lrDate: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const handleSaveInwardGrid = () => {
    const newItems: ThermocolInward[] = inwardGridRows.map((r, idx) => {
      const q = Number(r.qty) || 0;
      const p = Number(r.price) || 0;
      return {
        id: 'TH_INW_' + Date.now() + '_' + idx,
        grNo: r.grNo.trim(),
        receiveDate: r.receiveDate,
        invNo: r.invNo.trim() || '-',
        productName: r.productName,
        packSize: r.packSize,
        initialQty: q,
        availableQty: q,
        price: p,
        gstPercent: 18,
        transName: r.transName,
        lrNo: r.lrNo.trim() || '-',
        lrDate: r.lrDate,
        totalAmount: Number((q * p * 1.18).toFixed(2))
      };
    });

    const updated = [...newItems, ...inwards];
    setInwards(updated);
    persistStorage(products, parties, transporters, clientDemands, updated, invoices, invoiceSeq);
    setInwardSubTab('stock');
  };

  const exportStockReportCsv = () => {
    const headers = 'Product_Name,Rate_INR,Pack_Size,Pack_Multiple,Available_Stock_Pcs,Unit_Weight_kg,Total_Weight_Shifting_kg,Total_Weight_Shifting_MT,Total_Volume_CFT\n';
    const rows = products.map(prod => {
      const currentStock = getProductStock(prod);
      const totalWeightKg = (currentStock * prod.weight).toFixed(2);
      const totalWeightMt = (Number(totalWeightKg) / 1000).toFixed(3);
      const totalCft = (currentStock * prod.cft).toFixed(2);
      return `"${prod.name}",${prod.price},"${prod.packSize}",${prod.packSizeMultiple},${currentStock},${prod.weight},${totalWeightKg},${totalWeightMt},${totalCft}`;
    }).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Available_Stock_Excel_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // ----------------------------------------------------
  // Module I: Master Management & CSV Bulk Import
  // ----------------------------------------------------
  const csvFileRef = useRef<HTMLInputElement>(null);
  const [csvType, setCsvType] = useState<'outward' | 'inward' | 'product' | 'party' | 'transporter' | 'demand'>('outward');
  const [csvStatusMsg, setCsvStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const downloadSampleTemplate = (type: 'outward' | 'inward' | 'product' | 'party' | 'transporter' | 'demand') => {
    let headers = '';
    let row = '';
    if (type === 'outward') {
      headers = 'Invoice_No,Invoice_Date,Client_Name,Product_Name,Quantity,Rate,Transporter,Vehicle_No,Eway_Bill_No\n';
      row = 'ICHIND/26-27/101,2026-09-25,Aarav Packaging Industries,Thermocol Sheet 10mm,100,15.0,VRL Logistics,MP09-AB-1234,EWB-231908273615\n';
    } else if (type === 'inward') {
      headers = 'GR_Number,Receive_Date,Supplier_Invoice,Product_Name,Quantity,Rate,Transporter,LR_Number\n';
      row = 'GR-2026-101,2026-09-25,SUP-8899,Thermocol Sheet 10mm,500,15.0,VRL Logistics,LR-7766\n';
    } else if (type === 'product') {
      headers = 'Product_Name,Rate_INR,Pack_Size,Units_Per_Pack,Weight_Per_Unit_kg,CFT_Per_Unit\n';
      row = 'Thermocol Box 12kg,90.0,Box of 10,10,1.3,0.38\n';
    } else if (type === 'party') {
      headers = 'Party_Name,Billing_Address,GSTIN,State\n';
      row = 'New India Packaging,Industrial Estate Sector A Indore,23NEWIN1234A1Z5,Madhya Pradesh\n';
    } else if (type === 'transporter') {
      headers = 'Transporter_Name,Transporter_GSTIN\n';
      row = 'VRL Logistics,23AABCV1234P1Z4\n';
    } else {
      headers = 'Client_Name,Product_Name,Monthly_Limit\n';
      row = 'Aarav Packaging Industries,Thermocol Box 10kg,3000\n';
    }
    const blob = new Blob([headers + row], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sample_${type}_template.csv`;
    link.click();
  };

  const handleUploadCsv = () => {
    const file = csvFileRef.current?.files?.[0];
    if (!file) {
      setCsvStatusMsg({ text: 'Please select a CSV file to upload!', isError: true });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      const lines = text.split('\n');
      let count = 0;

      if (csvType === 'product') {
        const addedProds: ThermocolProduct[] = [];
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (!l) continue;
          const cols = l.split(',');
          if (cols.length >= 6) {
            addedProds.push({
              id: 'prod_csv_' + Date.now() + '_' + i,
              name: cols[0]?.replace(/"/g, '').trim() || `Product ${i}`,
              price: parseFloat(cols[1]) || 50.0,
              packSize: cols[2]?.replace(/"/g, '').trim() || 'Box of 10',
              packSizeMultiple: parseInt(cols[3]) || 10,
              weight: parseFloat(cols[4]) || 1.0,
              cft: parseFloat(cols[5]) || 0.3,
              stock: 0
            });
            count++;
          }
        }
        const updated = [...addedProds, ...products];
        setProducts(updated);
        persistStorage(updated, parties, transporters, clientDemands, inwards, invoices, invoiceSeq);
        setCsvStatusMsg({ text: `Imported ${count} Products from CSV successfully!`, isError: false });
      } else if (csvType === 'party') {
        const addedParties: ThermocolParty[] = [];
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (!l) continue;
          const cols = l.split(',');
          if (cols.length >= 3) {
            addedParties.push({
              name: cols[0]?.replace(/"/g, '').trim() || `Client ${i}`,
              address: cols[1]?.replace(/"/g, '').trim() || 'Indore, MP',
              gstin: cols[2]?.replace(/"/g, '').trim() || '23UNREGISTERED'
            });
            count++;
          }
        }
        const updated = [...addedParties, ...parties];
        setParties(updated);
        persistStorage(products, updated, transporters, clientDemands, inwards, invoices, invoiceSeq);
        setCsvStatusMsg({ text: `Imported ${count} Customers / Parties from CSV successfully!`, isError: false });
      } else if (csvType === 'transporter') {
        const addedTrans: ThermocolTransporter[] = [];
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (!l) continue;
          const cols = l.split(',');
          if (cols.length >= 2) {
            addedTrans.push({
              name: cols[0]?.replace(/"/g, '').trim() || `Transporter ${i}`,
              gstin: cols[1]?.replace(/"/g, '').trim() || '23TRANSPORTER'
            });
            count++;
          }
        }
        const updated = [...addedTrans, ...transporters];
        setTransporters(updated);
        persistStorage(products, parties, updated, clientDemands, inwards, invoices, invoiceSeq);
        setCsvStatusMsg({ text: `Imported ${count} Transporters from CSV successfully!`, isError: false });
      } else if (csvType === 'demand') {
        const addedDemands: ClientDemand[] = [];
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (!l) continue;
          const cols = l.split(',');
          if (cols.length >= 3) {
            addedDemands.push({
              id: 'dem_csv_' + Date.now() + '_' + i,
              partyName: cols[0]?.replace(/"/g, '').trim(),
              productName: cols[1]?.replace(/"/g, '').trim(),
              monthlyLimit: parseInt(cols[2]) || 2000
            });
            count++;
          }
        }
        const updated = [...addedDemands, ...clientDemands];
        setClientDemands(updated);
        persistStorage(products, parties, transporters, updated, inwards, invoices, invoiceSeq);
        setCsvStatusMsg({ text: `Imported ${count} Client Demand limits from CSV successfully!`, isError: false });
      } else if (csvType === 'inward') {
        const added: ThermocolInward[] = [];
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (!l) continue;
          const cols = l.split(',');
          if (cols.length >= 5) {
            const pName = cols[3]?.replace(/"/g, '').trim();
            const prod = products.find(p => p.name === pName) || products[0];
            const q = parseInt(cols[4]) || 100;
            const r = parseFloat(cols[5]) || prod.price;

            added.push({
              id: 'TH_INW_CSV_' + Date.now() + '_' + i,
              grNo: cols[0]?.replace(/"/g, '').trim() || `GR-CSV-${i}`,
              receiveDate: cols[1]?.replace(/"/g, '').trim() || new Date().toISOString().split('T')[0],
              invNo: cols[2]?.replace(/"/g, '').trim() || 'SUP-INV-CSV',
              productName: prod.name,
              packSize: prod.packSize,
              initialQty: q,
              availableQty: q,
              price: r,
              gstPercent: 18,
              transName: cols[6]?.replace(/"/g, '').trim() || transporters[0].name,
              lrNo: cols[7]?.replace(/"/g, '').trim() || 'LR-CSV',
              lrDate: new Date().toISOString().split('T')[0],
              totalAmount: Number((q * r * 1.18).toFixed(2))
            });
            count++;
          }
        }
        const updated = [...added, ...inwards];
        setInwards(updated);
        persistStorage(products, parties, transporters, clientDemands, updated, invoices, invoiceSeq);
        setCsvStatusMsg({ text: `Imported ${count} Inward records from CSV successfully!`, isError: false });
      } else {
        const addedInvs: ThermocolInvoice[] = [];
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (!l) continue;
          const cols = l.split(',');
          if (cols.length >= 5) {
            const pName = cols[3]?.replace(/"/g, '').trim();
            const prod = products.find(p => p.name === pName) || products[0];
            const q = parseInt(cols[4]) || 100;
            const r = parseFloat(cols[5]) || prod.price;
            const taxable = q * r;
            const gst = taxable * 0.18;
            const grand = taxable + gst;
            const party = parties.find(p => p.name === cols[2]?.replace(/"/g, '').trim()) || parties[0];

            addedInvs.push({
              invNo: cols[0]?.replace(/"/g, '').trim() || formatInvNo(invoiceSeq + i),
              date: cols[1]?.replace(/"/g, '').trim() || new Date().toISOString().split('T')[0],
              partyName: party.name,
              partyAddress: party.address,
              partyGstin: party.gstin,
              senderName: sender.name,
              senderAddress: sender.address,
              senderGstin: sender.gstin,
              transName: cols[6]?.replace(/"/g, '').trim() || transporters[0].name,
              transGstin: transporters[0].gstin,
              lrNo: 'LR-CSV',
              lrDate: new Date().toISOString().split('T')[0],
              vehicleNo: cols[7]?.replace(/"/g, '').trim() || 'MP09-AB-1234',
              ewayBillNo: cols[8]?.replace(/"/g, '').trim() || 'EWB-CSV',
              totalTaxable: taxable.toFixed(2),
              totalGst: gst.toFixed(2),
              grandTotal: grand.toFixed(2),
              totalQty: q,
              totalWeight: (q * prod.weight).toFixed(2),
              totalCft: (q * prod.cft).toFixed(2),
              items: [
                {
                  id: 'csv_item_' + i,
                  productId: prod.id,
                  productName: prod.name,
                  packSize: prod.packSize,
                  packSizeMultiple: prod.packSizeMultiple,
                  qty: q,
                  rate: r,
                  weight: Number((q * prod.weight).toFixed(2)),
                  cft: Number((q * prod.cft).toFixed(2)),
                  taxableValue: Number(taxable.toFixed(2)),
                  gstValue: Number(gst.toFixed(2)),
                  totalValue: Number(grand.toFixed(2))
                }
              ]
            });
            count++;
          }
        }
        const updated = [...addedInvs, ...invoices];
        setInvoices(updated);
        persistStorage(products, parties, transporters, clientDemands, inwards, updated, invoiceSeq);
        setCsvStatusMsg({ text: `Imported ${count} Outward Invoice records from CSV successfully!`, isError: false });
      }

      if (csvFileRef.current) csvFileRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 p-3 sm:p-5 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Module A: Consignor / Origin Location Configuration Header */}
        <OriginConfigHeader sender={sender} onUpdateSender={handleUpdateSender} />

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab('orderTab')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orderTab' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>📤 New Outward Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab('previewPrintTab')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'previewPrintTab' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Tax Invoice Preview & Print</span>
          </button>

          <button
            onClick={() => setActiveTab('editInvoiceTab')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'editInvoiceTab' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-4 h-4 text-cyan-300" />
            <span>✏️ Edit & Delete Invoices</span>
          </button>

          <button
            onClick={() => setActiveTab('reportTab')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reportTab' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-purple-300" />
            <span>📋 Billing & Dispatch Report</span>
          </button>

          <button
            onClick={() => setActiveTab('demandSupplyTab')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'demandSupplyTab' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-orange-300" />
            <span>📊 Demand vs. Supply Report</span>
          </button>

          <button
            onClick={() => setActiveTab('inwardTab')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inwardTab' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Warehouse className="w-4 h-4 text-emerald-300" />
            <span>📥 Inward Management & Stock</span>
          </button>

          <button
            onClick={() => setActiveTab('masterTab')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'masterTab' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-indigo-300" />
            <span>📦 Masters & CSV Templates</span>
          </button>
        </div>

        {/* ========================================================
            MODULE C: ORDER ENTRY & NEW OUTWARD INVOICE
            ======================================================== */}
        {activeTab === 'orderTab' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            {/* Out-of-Stock Alert Banner if no products have stock */}
            {availableProducts.length === 0 && (
              <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Notice: All products currently have zero available stock (`stock === 0`). Add stock via Inward Management to proceed with outward invoicing.</span>
              </div>
            )}

            {/* Monthly Demand Advisory Warning Banner */}
            {monthlyDemandValidation.hasDemandWarning && (
              <div className="p-3 bg-orange-50 text-orange-800 border border-orange-200 rounded-lg text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-orange-600" />
                <span><b>Demand Advisory Limit Exceeded:</b> {monthlyDemandValidation.demandWarningMessage}</span>
              </div>
            )}

            {/* Header Fields (Strict ICHIND/26-27 series numbering) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Invoice Number (FY 26-27 Series):</label>
                <input
                  type="text"
                  readOnly
                  value={ordInvNo}
                  className="w-full bg-slate-200 border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-blue-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Invoice Date: *</label>
                <input
                  type="date"
                  value={ordDate}
                  onChange={(e) => setOrdDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sold To Party (Client): *</label>
                <select
                  value={ordPartyName}
                  onChange={(e) => setOrdPartyName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 outline-none cursor-pointer"
                >
                  {parties.map((p, idx) => (
                    <option key={idx} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client Address Banner */}
            {ordPartyName && (
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-500 block">Client Billing Address:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{parties.find(p => p.name === ordPartyName)?.address}</p>
                </div>
                <div className="text-right font-mono text-slate-600">
                  <b>GSTIN:</b> {parties.find(p => p.name === ordPartyName)?.gstin}
                </div>
              </div>
            )}

            {/* Line Items Table with Zero-Stock Filtering & Weight/CFT Side-by-Side (Rate only) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">Product Line Items</span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                    In-Stock Items Only (Zero-Stock Hidden)
                  </span>
                </div>
                <button
                  onClick={addOrderLine}
                  disabled={availableProducts.length === 0}
                  className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition ${
                    availableProducts.length === 0 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer shadow-xs'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3">Product Description (In-Stock Only)</th>
                      <th className="py-2.5 px-3 text-right">Locked Rate (₹)</th>
                      <th className="py-2.5 px-3 text-right">Quantity</th>
                      <th className="py-2.5 px-3 text-right">Weight (kg)</th>
                      <th className="py-2.5 px-3 text-right">CFT</th>
                      <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                      <th className="py-2.5 px-3 text-right">GST (18%)</th>
                      <th className="py-2.5 px-3 text-right font-bold">Total (₹)</th>
                      <th className="py-2.5 px-3 text-center">X</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderLines.map(line => {
                      const calc = orderCalculations.lines.find(c => c.id === line.id);
                      const prod = products.find(p => p.id === line.productId) || 
                                   products.find(p => p.name === line.productName) || 
                                   products[0];

                      return (
                        <tr key={line.id} className={calc?.isInvalidMultiple ? 'bg-red-50/50' : 'hover:bg-slate-50'}>
                          <td className="py-2 px-3">
                            <select
                              value={prod?.id || line.productId}
                              onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedProd = products.find(p => p.id === selectedId) || products[0];
                                setOrderLines(prev => prev.map(l => l.id === line.id ? { 
                                  ...l, 
                                  productId: selectedProd.id,
                                  productName: selectedProd.name,
                                  qty: selectedProd.packSizeMultiple || 10
                                } : l));
                              }}
                              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-900 w-full outline-none cursor-pointer"
                            >
                              {/* Only display products that currently have available stock > 0 */}
                              {availableProducts.map((p) => {
                                const stock = getProductStock(p);
                                return (
                                  <option key={p.id} value={p.id}>
                                    {p.name} (Available: {stock} pcs)
                                  </option>
                                );
                              })}
                            </select>
                            <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                              Pack: {prod.packSize} (Multiple: {prod.packSizeMultiple})
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-700">
                            <div className="flex items-center justify-end gap-1">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>₹{prod.price.toFixed(2)}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              min={prod.packSizeMultiple}
                              step={prod.packSizeMultiple}
                              value={line.qty}
                              onChange={(e) => {
                                const v = e.target.value === '' ? '' : Number(e.target.value);
                                setOrderLines(prev => prev.map(l => l.id === line.id ? { ...l, qty: v } : l));
                              }}
                              className={`w-24 text-right border rounded px-2 py-1 font-mono font-bold outline-none ${
                                calc?.isInvalidMultiple ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-300 text-slate-900'
                              }`}
                            />
                            {calc?.isInvalidMultiple && (
                              <span className="text-[10px] text-red-600 font-bold block">Must be ×{prod.packSizeMultiple}</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-blue-600 font-semibold">
                            {calc?.weight.toFixed(2)} kg
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-purple-600 font-semibold">
                            {calc?.cft.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">₹{calc?.taxableValue.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono">₹{calc?.gstValue.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono font-extrabold text-blue-700">
                            ₹{calc?.totalValue.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => removeOrderLine(line.id)}
                              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition"
                              title="Remove Line"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold border-t border-slate-200">
                      <td className="py-2.5 px-3">Cumulative Totals</td>
                      <td></td>
                      <td className="py-2.5 px-3 text-right font-mono text-blue-700">{orderCalculations.totalQty} Pcs</td>
                      <td className="py-2.5 px-3 text-right font-mono text-blue-700">{orderCalculations.totalWeight} kg</td>
                      <td className="py-2.5 px-3 text-right font-mono text-purple-700">{orderCalculations.totalCft} CFT</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{orderCalculations.totalTaxable}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{orderCalculations.totalGst}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-extrabold text-sm">
                        ₹{orderCalculations.grandTotal}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Specs & Amount in Words display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-600" />
                    <span>Calculated Totals:</span>
                  </span>
                  <div className="space-x-3 font-mono font-bold text-slate-800">
                    <span>Weight: <b className="text-blue-700">{orderCalculations.totalWeight} kg</b></span>
                    <span>Volume: <b className="text-purple-700">{orderCalculations.totalCft} CFT</b></span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase">Amount in Words:</span>
                  <span className="font-bold text-slate-900 italic text-[11px]">{orderCalculations.amountInWords}</span>
                </div>
              </div>
            </div>

            {/* Dispatch & Transport Credentials (With E-way Bill Number) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Transport Name:</label>
                <select
                  value={ordTransName}
                  onChange={(e) => setOrdTransName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 outline-none cursor-pointer"
                >
                  {transporters.map((t, idx) => (
                    <option key={idx} value={t.name}>{t.name} ({t.gstin})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">LR Number:</label>
                <input
                  type="text"
                  value={ordLrNo}
                  onChange={(e) => setOrdLrNo(e.target.value)}
                  placeholder="e.g. LR-99881"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">LR Date:</label>
                <input
                  type="date"
                  value={ordLrDate}
                  onChange={(e) => setOrdLrDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vehicle Number:</label>
                <input
                  type="text"
                  value={ordVehicle}
                  onChange={(e) => setOrdVehicle(e.target.value)}
                  placeholder="MP09-AB-1234"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 uppercase outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">E-way Bill Number:</label>
                <input
                  type="text"
                  value={ordEwayBill}
                  onChange={(e) => setOrdEwayBill(e.target.value)}
                  placeholder="EWB-231908..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-blue-700 outline-none"
                />
              </div>
            </div>

            {/* Error or Success notification */}
            {orderMsg && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                orderMsg.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {orderMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{orderMsg.text}</span>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveOutwardInvoice}
              disabled={orderCalculations.hasPackSizeError}
              className={`w-full py-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
                orderCalculations.hasPackSizeError 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Generate & Save Invoice Line ({ordInvNo}) & Deduct Inventory Stock</span>
            </button>
          </div>
        )}

        {/* ========================================================
            MODULE D: TAX INVOICE PREVIEW & PRINT
            ======================================================== */}
        {activeTab === 'previewPrintTab' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Select Invoice to View & Print:</span>
                <select
                  value={selectedPreviewInv}
                  onChange={(e) => setSelectedPreviewInv(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-mono font-bold text-blue-700 outline-none cursor-pointer"
                >
                  {invoices.map((inv) => (
                    <option key={inv.invNo} value={inv.invNo}>
                      {inv.invNo} - {inv.partyName} (₹{inv.grandTotal})
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Total Generated Invoices: {invoices.length}
              </span>
            </div>

            {activePreviewInvoice && (
              <TaxInvoiceModal invoice={activePreviewInvoice} isInline={true} />
            )}
          </div>
        )}

        {/* ========================================================
            MODULE E: INVOICE CORRECTION, EDITING & DELETION (✏️ Edit & Delete Invoices)
            ======================================================== */}
        {activeTab === 'editInvoiceTab' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Select Invoice to Correct or Delete:</span>
                <select
                  value={editInvNo}
                  onChange={(e) => setEditInvNo(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-mono font-bold text-blue-700 outline-none cursor-pointer"
                >
                  {invoices.map((inv) => (
                    <option key={inv.invNo} value={inv.invNo}>
                      {inv.invNo} - {inv.partyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Strict FY 26-27 Series Continuity Active</span>
                {editForm && (
                  <button
                    onClick={() => handleDeleteInvoice(editForm.invNo)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                    title="Delete entire invoice and restore inventory levels"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Entire Invoice</span>
                  </button>
                )}
              </div>
            </div>

            {editForm && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Client Name:</label>
                    <input
                      type="text"
                      value={editForm.partyName}
                      onChange={(e) => setEditForm({ ...editForm, partyName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Transporter:</label>
                    <input
                      type="text"
                      value={editForm.transName}
                      onChange={(e) => setEditForm({ ...editForm, transName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Vehicle Number:</label>
                    <input
                      type="text"
                      value={editForm.vehicleNo}
                      onChange={(e) => setEditForm({ ...editForm, vehicleNo: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono uppercase font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">E-way Bill Number:</label>
                    <input
                      type="text"
                      value={editForm.ewayBillNo || ''}
                      onChange={(e) => setEditForm({ ...editForm, ewayBillNo: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-blue-700"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                        <th className="py-2 px-3">Product Description</th>
                        <th className="py-2 px-3">Pack Size</th>
                        <th className="py-2 px-3 text-right">Quantity</th>
                        <th className="py-2 px-3 text-right">Rate (₹)</th>
                        <th className="py-2 px-3 text-right">Taxable (₹)</th>
                        <th className="py-2 px-3 text-right">GST (18%)</th>
                        <th className="py-2 px-3 text-right font-bold">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editForm.items.map(it => (
                        <tr key={it.id}>
                          <td className="py-2 px-3 font-semibold text-slate-900">
                            {it.productName}
                          </td>
                          <td className="py-2 px-3 text-slate-600">{it.packSize}</td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              min="1"
                              value={it.qty}
                              onChange={(e) => updateEditItem(it.id, 'qty', e.target.value)}
                              className="w-20 text-right border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-900"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={it.rate}
                              onChange={(e) => updateEditItem(it.id, 'rate', e.target.value)}
                              className="w-20 text-right border border-slate-300 rounded px-2 py-1 font-mono text-slate-900"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-mono">₹{it.taxableValue.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono">₹{it.gstValue.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-blue-700">₹{it.totalValue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-bold border-t border-slate-200">
                        <td colSpan={2} className="py-2 px-3">Recalculated Grand Total</td>
                        <td className="py-2 px-3 text-right font-mono text-blue-700">{editForm.totalQty} Pcs</td>
                        <td></td>
                        <td className="py-2 px-3 text-right font-mono">₹{editForm.totalTaxable}</td>
                        <td className="py-2 px-3 text-right font-mono">₹{editForm.totalGst}</td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-700 font-extrabold">₹{editForm.grandTotal}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {editMsg && (
                  <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                    editMsg.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editMsg.text}</span>
                  </div>
                )}

                <button
                  onClick={handleSaveInvoiceCorrection}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  Save & Update Invoice Corrections
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            MODULE F: BILLING & DISPATCH REPORT (📋 Billing & Dispatch Report)
            ======================================================== */}
        {activeTab === 'reportTab' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReportView('summary')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    reportView === 'summary' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Summary Report
                </button>
                <button
                  onClick={() => setReportView('detailed')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    reportView === 'detailed' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Detailed Item-Level Report
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={reportSearch}
                    onChange={(e) => setReportSearch(e.target.value)}
                    placeholder="Search invoice, client, e-way bill..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none"
                  />
                </div>
                <button
                  onClick={reportView === 'summary' ? exportSummaryCsv : exportDetailedCsv}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {reportView === 'summary' ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3">Invoice No</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Client Name</th>
                      <th className="py-2.5 px-3">Transporter</th>
                      <th className="py-2.5 px-3">LR / Vehicle</th>
                      <th className="py-2.5 px-3">E-way Bill No</th>
                      <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                      <th className="py-2.5 px-3 text-right">GST (₹)</th>
                      <th className="py-2.5 px-3 text-right font-extrabold">Total Value (₹)</th>
                      <th className="py-2.5 px-3 text-center">Print / Export</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map(inv => (
                      <tr key={inv.invNo} className="hover:bg-slate-50 transition">
                        <td className="py-2 px-3 font-mono font-bold text-blue-700">{inv.invNo}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{inv.date}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{inv.partyName}</td>
                        <td className="py-2 px-3 text-slate-700">{inv.transName}</td>
                        <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">
                          {inv.lrNo} / {inv.vehicleNo}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-blue-600">{inv.ewayBillNo || '-'}</td>
                        <td className="py-2 px-3 text-right font-mono">₹{inv.totalTaxable}</td>
                        <td className="py-2 px-3 text-right font-mono">₹{inv.totalGst}</td>
                        <td className="py-2 px-3 text-right font-mono font-extrabold text-emerald-700">
                          ₹{inv.grandTotal}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedPreviewInv(inv.invNo);
                              setActiveTab('previewPrintTab');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3">Invoice No</th>
                      <th className="py-2.5 px-3">Client</th>
                      <th className="py-2.5 px-3">Product Description</th>
                      <th className="py-2.5 px-3 text-right">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Weight (kg)</th>
                      <th className="py-2.5 px-3 text-right">CFT</th>
                      <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.flatMap(inv => 
                      inv.items.map(it => (
                        <tr key={inv.invNo + '_' + it.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono text-blue-700">{inv.invNo}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900">{inv.partyName}</td>
                          <td className="py-2 px-3">
                            {it.productName} ({it.packSize})
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">{it.qty}</td>
                          <td className="py-2 px-3 text-right font-mono">₹{it.rate.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono">{it.weight}</td>
                          <td className="py-2 px-3 text-right font-mono">{it.cft}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-blue-700">₹{it.totalValue.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            MODULE G: DEMAND VS. SUPPLY REPORT (📊 Demand vs. Supply Report)
            ======================================================== */}
        {activeTab === 'demandSupplyTab' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                  <span>Client Monthly Demand vs. Actual Supply (Dispatched Qty)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitoring client-wise product quotas against actual dispatches with red/green threshold variance indicators.
                </p>
              </div>

              <button
                onClick={exportDemandSupplyCsv}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Demand vs. Supply Report as CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3">Client Name</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3 text-right">Allotted Monthly Demand</th>
                    <th className="py-2.5 px-3 text-right">Total Dispatched Qty</th>
                    <th className="py-2.5 px-3 text-right">Remaining Demand</th>
                    <th className="py-2.5 px-3 text-center">Status / Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demandVsSupplyData.map((row, idx) => {
                    const isExceeded = row.status === 'Exceeded';
                    return (
                      <tr key={idx} className={isExceeded ? 'bg-red-50/40' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{row.partyName}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{row.productName}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">{row.monthlyLimit} Pcs</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">{row.dispatched} Pcs</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">{row.remaining} Pcs</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold font-mono ${
                            isExceeded ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isExceeded ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            <span>{row.status}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE H: INWARD MANAGEMENT & STOCK (📥 Inward Management & Stock)
            ======================================================== */}
        {activeTab === 'inwardTab' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setInwardSubTab('stock')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inwardSubTab === 'stock' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Available Stock Status (Excel Spreadsheet Grid)
                </button>
                <button
                  onClick={() => setInwardSubTab('detail')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inwardSubTab === 'detail' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Date-Wise Inward History
                </button>
                <button
                  onClick={() => setInwardSubTab('addGrid')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inwardSubTab === 'addGrid' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  + Add Inward Stock (Grid)
                </button>
              </div>

              {inwardSubTab === 'stock' && (
                <button
                  onClick={exportStockReportCsv}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Available Stock Report as CSV</span>
                </button>
              )}
            </div>

            {inwardSubTab === 'stock' && (
              <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white font-bold border-b border-slate-700 text-[11px]">
                      <th className="py-3 px-3">Product Name</th>
                      <th className="py-3 px-3 text-right">Rate (₹)</th>
                      <th className="py-3 px-3">Pack Size</th>
                      <th className="py-3 px-3 text-right">Available Stock</th>
                      <th className="py-3 px-3 text-right">Weight / Unit (kg)</th>
                      <th className="py-3 px-3 text-right">Total Weight Shifting</th>
                      <th className="py-3 px-3 text-right font-bold">Total Volume (CFT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {products.map(prod => {
                      const currentStock = getProductStock(prod);
                      const totalWtKg = (currentStock * prod.weight).toFixed(2);
                      const totalWtMt = (Number(totalWtKg) / 1000).toFixed(3);
                      const totalCftVol = (currentStock * prod.cft).toFixed(2);

                      return (
                        <tr key={prod.id || prod.name} className="hover:bg-blue-50/40 transition">
                          <td className="py-2.5 px-3 font-extrabold text-slate-900">{prod.name}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">₹{prod.price.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-slate-600">{prod.packSize} (Mult: {prod.packSizeMultiple})</td>
                          <td className={`py-2.5 px-3 text-right font-mono font-extrabold text-sm ${
                            currentStock > 0 ? 'text-emerald-700' : 'text-red-600'
                          }`}>
                            {currentStock} Pcs
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">{prod.weight} kg</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                            {totalWtKg} kg <span className="text-[10px] text-slate-500 font-normal">({totalWtMt} MT)</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-extrabold text-purple-700">{totalCftVol} CFT</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {inwardSubTab === 'detail' && (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">GR No</th>
                      <th className="py-2.5 px-3">Supplier Inv</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Pack Size</th>
                      <th className="py-2.5 px-3 text-right">Inward Qty</th>
                      <th className="py-2.5 px-3 text-right">Available Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-center">GST %</th>
                      <th className="py-2.5 px-3">Transporter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inwards.map(inw => (
                      <tr key={inw.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono text-slate-600">{inw.receiveDate}</td>
                        <td className="py-2 px-3 font-mono font-bold text-blue-700">{inw.grNo}</td>
                        <td className="py-2 px-3 font-mono">{inw.invNo}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {inw.productName}
                        </td>
                        <td className="py-2 px-3 text-slate-600">{inw.packSize}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-700">{inw.initialQty}</td>
                        <td className="py-2 px-3 text-right font-mono font-extrabold text-emerald-700">{inw.availableQty}</td>
                        <td className="py-2 px-3 text-right font-mono">₹{inw.price.toFixed(2)}</td>
                        <td className="py-2 px-3 text-center font-mono text-slate-500 font-bold">18%</td>
                        <td className="py-2 px-3 text-slate-600">{inw.transName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {inwardSubTab === 'addGrid' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Enter Incoming Lot Rows</span>
                  <button
                    onClick={addInwardRow}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                        <th className="py-2 px-2">GR No</th>
                        <th className="py-2 px-2">Date</th>
                        <th className="py-2 px-2">Supplier Inv</th>
                        <th className="py-2 px-2">Product Name</th>
                        <th className="py-2 px-2 text-right">Quantity</th>
                        <th className="py-2 px-2 text-right">Rate (₹)</th>
                        <th className="py-2 px-2 text-center">GST %</th>
                        <th className="py-2 px-2">Transporter</th>
                        <th className="py-2 px-2">LR No</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inwardGridRows.map(row => (
                        <tr key={row.id}>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.grNo}
                              onChange={(e) => {
                                const v = e.target.value;
                                setInwardGridRows(prev => prev.map(r => r.id === row.id ? { ...r, grNo: v } : r));
                              }}
                              className="border rounded px-1.5 py-1 text-xs font-mono font-bold text-blue-700 w-24"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="date"
                              value={row.receiveDate}
                              onChange={(e) => {
                                const v = e.target.value;
                                setInwardGridRows(prev => prev.map(r => r.id === row.id ? { ...r, receiveDate: v } : r));
                              }}
                              className="border rounded px-1.5 py-1 text-xs w-28"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.invNo}
                              onChange={(e) => {
                                const v = e.target.value;
                                setInwardGridRows(prev => prev.map(r => r.id === row.id ? { ...r, invNo: v } : r));
                              }}
                              className="border rounded px-1.5 py-1 text-xs w-24"
                            />
                          </td>
                          <td className="p-1.5">
                            <select
                              value={row.productName}
                              onChange={(e) => {
                                const v = e.target.value;
                                const prod = products.find(p => p.name === v);
                                setInwardGridRows(prev => prev.map(r => r.id === row.id ? { 
                                  ...r, 
                                  productName: v,
                                  packSize: prod?.packSize || '',
                                  price: prod?.price || r.price
                                } : r));
                              }}
                              className="border rounded px-1.5 py-1 text-xs font-semibold text-slate-800"
                            >
                              {Array.from(new Set(products.map(p => p.name))).map((pName, idx) => (
                                <option key={idx} value={pName}>{pName}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-1.5 text-right">
                            <input
                              type="number"
                              value={row.qty}
                              onChange={(e) => {
                                const v = e.target.value === '' ? '' : Number(e.target.value);
                                setInwardGridRows(prev => prev.map(r => r.id === row.id ? { ...r, qty: v } : r));
                              }}
                              className="border rounded px-1.5 py-1 text-xs text-right font-mono font-bold text-emerald-700 w-20"
                            />
                          </td>
                          <td className="p-1.5 text-right">
                            <input
                              type="number"
                              value={row.price}
                              onChange={(e) => {
                                const v = e.target.value === '' ? '' : Number(e.target.value);
                                setInwardGridRows(prev => prev.map(r => r.id === row.id ? { ...r, price: v } : r));
                              }}
                              className="border rounded px-1.5 py-1 text-xs text-right font-mono w-20"
                            />
                          </td>
                          <td className="p-1.5 text-center font-mono font-bold text-slate-500 bg-slate-50">
                            18%
                          </td>
                          <td className="p-1.5">
                            <select
                              value={row.transName}
                              onChange={(e) => {
                                const v = e.target.value;
                                setInwardGridRows(prev => prev.map(r => r.id === row.id ? { ...r, transName: v } : r));
                              }}
                              className="border rounded px-1.5 py-1 text-xs"
                            >
                              {transporters.map((t, idx) => (
                                <option key={idx} value={t.name}>{t.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.lrNo}
                              onChange={(e) => {
                                const v = e.target.value;
                                setInwardGridRows(prev => prev.map(r => r.id === row.id ? { ...r, lrNo: v } : r));
                              }}
                              className="border rounded px-1.5 py-1 text-xs font-mono w-24"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleSaveInwardGrid}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Save Inward Lot Entries
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            MODULE I: MASTER MANAGEMENT & CSV BULK IMPORT (📦 Masters & CSV Templates)
            ======================================================== */}
        {activeTab === 'masterTab' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Master Data Management & CSV Bulk Templates</span>
            </h3>
            <p className="text-xs text-slate-500">
              Download standard CSV templates and upload populated bulk files for all core business masters (Product Master, Customer / Party Master, Transporter Master, Client Monthly Demands, Outward Invoices, and Inward Logs).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => downloadSampleTemplate('product')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer border border-slate-200"
              >
                <span>Product Master Template</span>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>
              <button
                onClick={() => downloadSampleTemplate('party')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer border border-slate-200"
              >
                <span>Customer / Party Template</span>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>
              <button
                onClick={() => downloadSampleTemplate('transporter')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer border border-slate-200"
              >
                <span>Transporter Master Template</span>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>
              <button
                onClick={() => downloadSampleTemplate('demand')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer border border-slate-200"
              >
                <span>Client Monthly Demand Template</span>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>
              <button
                onClick={() => downloadSampleTemplate('outward')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer border border-slate-200"
              >
                <span>Outward Invoices Template</span>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>
              <button
                onClick={() => downloadSampleTemplate('inward')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer border border-slate-200"
              >
                <span>Inward Logs Template</span>
                <Download className="w-4 h-4 text-indigo-600" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Select Master / Ingestion Type:</span>
                <select
                  value={csvType}
                  onChange={(e) => setCsvType(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="product">Product Master CSV</option>
                  <option value="party">Customer / Party Master CSV</option>
                  <option value="transporter">Transporter Master CSV</option>
                  <option value="demand">Client Monthly Demands CSV</option>
                  <option value="outward">Outward Invoices CSV</option>
                  <option value="inward">Inward Logs CSV</option>
                </select>
              </div>

              <input
                type="file"
                ref={csvFileRef}
                accept=".csv"
                className="text-xs block"
              />

              <button
                onClick={handleUploadCsv}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Upload & Ingest Master CSV Data
              </button>
            </div>

            {csvStatusMsg && (
              <div className={`p-3 rounded-lg text-xs font-semibold ${
                csvStatusMsg.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {csvStatusMsg.text}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
