import React from 'react';
import { X, Printer, Download, FileText } from 'lucide-react';
import { ThermocolInvoice } from './types';
import { numberToWords } from './utils';

interface Props {
  invoice: ThermocolInvoice;
  onClose?: () => void;
  isInline?: boolean;
}

export const TaxInvoiceModal: React.FC<Props> = ({ invoice, onClose, isInline = false }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const htmlContent = document.getElementById('taxInvoicePrintArea')?.innerHTML || '';
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax_Invoice_${invoice.invNo.replace(/\//g, '_')}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      body { margin: 0; padding: 15mm; font-size: 12px; }
      .print-hidden { display: none !important; }
      @page { size: A4; margin: 10mm; }
    }
  </style>
</head>
<body class="p-8 bg-white text-slate-900 font-sans">
  <div class="max-w-4xl mx-auto">
    ${htmlContent}
  </div>
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tax_Invoice_${invoice.invNo.replace(/\//g, '_')}.html`;
    link.click();
  };

  const grandTotalNum = parseFloat(invoice.grandTotal) || 0;
  const amountWords = numberToWords(grandTotalNum);

  const content = (
    <div className="space-y-3">
      {/* Top Header Controls (Hidden when printed) */}
      <div className="flex flex-wrap justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs print:hidden gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Tax Invoice Document: <span className="font-mono text-blue-700">{invoice.invNo}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadHtml}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-300"
            title="Download full HTML document (can be opened or saved as PDF)"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download HTML/PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            title="Print or Save as PDF using browser print dialog"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice / Save as PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Printable Invoice Document Body */}
      <div
        id="taxInvoicePrintArea"
        className="bg-white rounded-xl p-6 md:p-8 space-y-5 border border-slate-200 shadow-md text-slate-800 font-sans print:border-none print:shadow-none print:p-0 print:space-y-4"
      >
        {/* Tax Invoice Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-800 pb-4 gap-4">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase block">TAX INVOICE</span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {invoice.senderName}
            </h1>
            <p className="text-xs text-slate-600 max-w-md mt-0.5">{invoice.senderAddress}</p>
            <p className="text-xs font-mono font-bold text-slate-800 mt-1">
              <b>GSTIN:</b> {invoice.senderGstin}
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-none border-slate-200 w-full sm:w-auto">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-mono font-extrabold text-sm rounded">
              {invoice.invNo}
            </div>
            <p className="text-xs font-mono text-slate-600 mt-1"><b>Invoice Date:</b> {invoice.date}</p>
            <p className="text-xs font-mono text-slate-500">Original for Recipient</p>
          </div>
        </div>

        {/* Consignee & Dispatcher Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Consignee Box */}
          <div className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Billed To / Sold To (Party Details)
            </span>
            <p className="font-extrabold text-slate-900 text-sm">{invoice.partyName}</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">{invoice.partyAddress}</p>
            <p className="font-mono text-slate-700 font-semibold pt-1">
              <b>GSTIN / UIN:</b> {invoice.partyGstin}
            </p>
          </div>

          {/* Dispatch & Transport Box (Includes Transporter GSTIN & E-way Bill Number) */}
          <div className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Dispatch & Logistics Credentials
            </span>
            <p className="font-bold text-slate-900">
              <b>Transporter:</b> {invoice.transName}
              {invoice.transGstin && (
                <span className="font-mono font-normal text-slate-600 ml-1.5">
                  (GSTIN: {invoice.transGstin})
                </span>
              )}
            </p>
            <p className="font-mono text-slate-700">
              <b>LR Number:</b> {invoice.lrNo || 'N/A'} | <b>LR Date:</b> {invoice.lrDate || '-'}
            </p>
            <p className="font-mono text-slate-700">
              <b>Vehicle No:</b> <span className="font-bold">{invoice.vehicleNo || 'N/A'}</span>
            </p>
            <p className="font-mono font-bold text-blue-700 pt-0.5">
              <b>E-way Bill No:</b> {invoice.ewayBillNo || 'Not Generated'}
            </p>
          </div>
        </div>

        {/* Itemized Products Table (Weight & CFT Side-by-Side per product, Pack Size & MRP columns removed) */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">Description of Goods</th>
                <th className="py-2.5 px-3 text-right">Quantity</th>
                <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                <th className="py-2.5 px-3 text-right">Weight (kg)</th>
                <th className="py-2.5 px-3 text-right">CFT</th>
                <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                <th className="py-2.5 px-3 text-right">GST (18%)</th>
                <th className="py-2.5 px-3 text-right font-extrabold">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((it, idx) => (
                <tr key={it.id || idx}>
                  <td className="py-2 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">
                    {it.productName}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">{it.qty}</td>
                  <td className="py-2 px-3 text-right font-mono">₹{Number(it.rate).toFixed(2)}</td>
                  <td className="py-2 px-3 text-right font-mono text-blue-600 font-semibold">{Number(it.weight).toFixed(2)} kg</td>
                  <td className="py-2 px-3 text-right font-mono text-purple-600 font-semibold">{Number(it.cft).toFixed(2)}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700">₹{Number(it.taxableValue).toFixed(2)}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600">₹{Number(it.gstValue).toFixed(2)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-blue-700">₹{Number(it.totalValue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t border-slate-300">
                <td colSpan={2} className="py-2.5 px-3">Cumulative Totals</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900">{invoice.totalQty} Pcs</td>
                <td></td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-700">{invoice.totalWeight} kg</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-700">{invoice.totalCft} CFT</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900">₹{invoice.totalTaxable}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900">₹{invoice.totalGst}</td>
                <td className="py-2.5 px-3 text-right font-mono font-extrabold text-blue-800 text-sm">
                  ₹{invoice.grandTotal}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Amount in Words */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <span className="font-bold text-slate-500 uppercase text-[10px] block">Amount in Words:</span>
          <p className="font-bold text-slate-900 mt-0.5 italic">{amountWords}</p>
        </div>

        {/* Terms and Signature */}
        <div className="flex flex-col sm:flex-row justify-between items-end pt-6 border-t border-slate-200 text-[11px] gap-6">
          <div className="text-slate-500 space-y-0.5">
            <p className="font-bold text-slate-700">Terms & Conditions:</p>
            <p>1. Goods once sold will not be taken back or exchanged.</p>
            <p>2. Subject to Indore jurisdiction only.</p>
          </div>

          <div className="text-center sm:text-right space-y-8">
            <p className="font-bold text-slate-800">For {invoice.senderName}</p>
            <p className="border-t border-slate-400 pt-1 text-slate-500">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full my-auto">
        {content}
      </div>
    </div>
  );
};
