import React from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Receipt, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  User, 
  GraduationCap,
  CreditCard,
  Building
} from 'lucide-react';
import { PaymentRecord } from '../../types';
import { useApp } from '../../context/AppContext';

interface PaymentReceiptModalProps {
  payment: PaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  payment,
  isOpen,
  onClose
}) => {
  const { language, settings } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !payment) return null;

  const receiptNo = payment.receiptNumber || `TH-REC-${payment.id.replace('PAY-', '')}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(receiptNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getMethodBadge = (method?: string) => {
    switch (method) {
      case 'bkash':
        return { label: 'বিকাশ (bKash)', bg: 'bg-pink-100 text-pink-900 border-pink-300' };
      case 'nagad':
        return { label: 'নগদ (Nagad)', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'rocket':
        return { label: 'রকেট (Rocket)', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'bank':
        return { label: 'ব্যাংক ট্রান্সফার', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'cash':
        return { label: 'ক্যাশ / নগদ প্রদান', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      default:
        return { label: 'অনলাইন পেমেন্ট', bg: 'bg-slate-100 text-slate-900 border-slate-300' };
    }
  };

  const badge = getMethodBadge(payment.paymentMethod);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 text-xs text-slate-800 space-y-6 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-100 text-pink-900 font-bold">
              <Receipt className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-blue-950">
                {language === 'bn' ? 'অফিসিয়াল ডিজিটাল মানি রিসিট (ভাউচার)' : 'Official Digital Payment Receipt'}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Receipt: {receiptNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট / সেভ PDF' : 'Print / Save PDF'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Official Receipt Voucher */}
        <div id="payment-receipt-voucher" className="bg-gradient-to-b from-slate-50 via-white to-pink-50/20 p-6 sm:p-7 rounded-2xl border-2 border-slate-300 space-y-5 relative overflow-hidden">
          
          {/* Header Letterhead */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-dashed border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-950 text-white font-black flex items-center justify-center text-xs">
                  TH
                </div>
                <span className="font-black text-base tracking-tight text-blue-950">TutorHat Money Receipt</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                টিউশন সম্মানী পরিশোধের অফিসিয়াল ডিজিটাল প্রমাণপত্র
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-xs text-blue-950 block">
                {receiptNo}
              </span>
              <p className="text-[10px] text-slate-400">
                তারিখ: {payment.paidAt ? payment.paidAt.split('T')[0] : payment.paymentDate}
              </p>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-teal-950 to-blue-950 text-white flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                {language === 'bn' ? 'পরিশোধিত টাকার পরিমাণ' : 'Amount Received'}
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white tabular-nums">
                ৳{payment.amount.toLocaleString()}
              </h2>
              <span className="text-[11px] text-emerald-200">
                মাস: <strong className="text-white">{payment.month}</strong>
              </span>
            </div>

            <div className="text-right space-y-1">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 inline-block">
                PAID & VERIFIED ✓
              </span>
              {payment.transactionId && (
                <p className="text-[10px] font-mono text-slate-300">
                  TrxID: {payment.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* Transaction & Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Guardian (Paid By) */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'bn' ? 'প্রদানকারী (Guardian)' : 'Paid By (Guardian)'}
              </span>
              <p className="font-bold text-slate-900">{payment.guardianName}</p>
              {payment.studentName && (
                <p className="text-[11px] text-slate-600">
                  শিক্ষার্থী: {payment.studentName}
                </p>
              )}
            </div>

            {/* Tutor (Received By) */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'bn' ? 'গ্রহণকারী শিক্ষক (Tutor)' : 'Received By (Tutor)'}
              </span>
              <p className="font-bold text-slate-900">{payment.tutorName}</p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Notes / Description */}
          {payment.notes && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700">
              <span className="font-bold text-slate-900 block mb-0.5">বিবরণ / নোট:</span>
              <p>{payment.notes}</p>
            </div>
          )}

          {/* Receipt Acknowledgement & Stamp */}
          <div className="pt-4 border-t-2 border-dashed border-slate-300 flex items-center justify-between text-[11px]">
            <div>
              <p className="font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>টিউটরহ্যাট ডিজিটাল সিকিউরড ভাউচার</span>
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Auth Token: {payment.id} · Verification: SUCCESS
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-2 border-blue-900 border-dashed flex flex-col items-center justify-center text-blue-900 p-1 bg-blue-50/50">
                <span className="text-[8px] font-black uppercase">PAID</span>
                <span className="text-[7px] font-bold">TUTORHAT</span>
              </div>
              <span className="text-[8px] text-slate-400 block mt-0.5 font-mono">SEAL</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রিন্ট / রিসিট সংরক্ষণ' : 'Print / Save Receipt'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
