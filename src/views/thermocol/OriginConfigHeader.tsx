import React, { useState } from 'react';
import { Building2, Edit2, Check, MapPin, Hash } from 'lucide-react';
import { SenderConfig } from './types';

interface Props {
  sender: SenderConfig;
  onUpdateSender: (updated: SenderConfig) => void;
}

export const OriginConfigHeader: React.FC<Props> = ({ sender, onUpdateSender }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<SenderConfig>(sender);

  const handleSave = () => {
    onUpdateSender(form);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              Origin Location & Consignor Configuration
            </span>
            <h2 className="text-base font-extrabold text-slate-800">
              {sender.name || 'Origin Company Name'}
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setForm(sender);
              setIsEditing(true);
            }
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
            isEditing 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Save Origin Details</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Origin Location</span>
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Company / Sender Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. ICH Indore"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Origin Address *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Industrial Area, Sector C, Indore, MP - 452015"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Sender GSTIN *</label>
            <input
              type="text"
              value={form.gstin}
              onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
              className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. 23ICHIN1234F1Z5"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="font-semibold text-slate-800">{sender.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="truncate" title={sender.address}>{sender.address}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Hash className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><b>GSTIN:</b> {sender.gstin}</span>
          </div>
        </div>
      )}
    </div>
  );
};
