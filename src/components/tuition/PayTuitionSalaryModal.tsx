import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Copy, 
  Check, 
  ShieldCheck, 
  Receipt, 
  AlertCircle,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { TuitionConfirmation, PaymentRecord } from '../../types';
import { store } from '../../services/store';
import { useApp } from '../../context/AppContext';

interface PayTuitionSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirmations: TuitionConfirmation[];
  defaultGuardianId: string;
  defaultGuardianName: string;
  onPaymentSuccess?: (payment: PaymentRecord) => void;
}

export const PayTuitionSalaryModal: React.FC<PayTuitionSalaryModalProps> = ({
  isOpen,
  onClose,
  confirmations,
  defaultGuardianId,
  defaultGuardianName,
  onPaymentSuccess
}) => {
  const { language, settings } = useApp();

  const activeConfirmations = confirmations.filter(c => c.status === 'confirmed');

  const [selectedConfId, setSelectedConfId] = useState<string>(activeConfirmations[0]?.id || '');
  const [month, setMonth] = useState<string>('মার্চ ২০২৬ (March 2026)');
  const [amount, setAmount] = useState<number>(activeConfirmations[0]?.monthlyFee || 7500);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank' | 'cash'>('bkash');
  const [transactionId, setTransactionId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedConf = confirmations.find(c => c.id === selectedConfId) || activeConfirmations[0];

  const handleConfChange = (id: string) => {
    setSelectedConfId(id);
    const target = confirmations.find(c => c.id === id);
    if (target) {
      setAmount(target.monthlyFee);
    }
  };

  const handleCopyNumber = (num: string, key: string) => {
    navigator.clipboard.writeText(num);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConf) return;

    setSubmitting(true);

    const record = store.recordTuitionPayment({
      confId: selectedConf.id,
      tutorId: selectedConf.tutorId,
      tutorName: selectedConf.tutorName,
      guardianId: defaultGuardianId,
      guardianName: defaultGuardianName,
      studentName: selectedConf.studentName,
      jobId: selectedConf.jobId,
      amount: Number(amount),
      month,
      paymentMethod,
      transactionId: transactionId || (paymentMethod === 'cash' ? 'CASH-HANDOVER' : `TRX${Math.random().toString(36).substring(2, 8).toUpperCase()}`),
      notes: notes || `${month} মাসের সম্মানী পরিশোধিত।`
    });

    setTimeout(() => {
      setSubmitting(false);
      onClose();
      if (onPaymentSuccess) {
        onPaymentSuccess(record);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs text-slate-800 space-y-4 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-100 text-pink-900 font-bold">
              <CreditCard className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-blue-950">
                {language === 'bn' ? 'টিউশন ফি ও বেতন পরিশোধ' : 'Pay Tuition Salary'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'ডিজিটাল মানি রিসিট ও সুরক্ষিত পেমেন্ট' : 'Secure Salary & Instant Receipt'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Payment Gateway & Instructions Card */}
        <div className="p-4 bg-gradient-to-r from-pink-50 via-amber-50 to-blue-50 rounded-2xl border border-pink-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span>💳 পেমেন্ট অ্যাকাউন্ট (Send Money):</span>
            </span>
            <span className="text-[10px] text-pink-700 font-bold bg-pink-100 px-2 py-0.5 rounded-full">
              Personal Accounts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* bKash */}
            <div className="p-2.5 bg-white rounded-xl border border-pink-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-pink-700 block text-[11px]">বিকাশ (Personal)</span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {settings.paymentAccounts?.bkashNumber || '01610582917'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyNumber(settings.paymentAccounts?.bkashNumber || '01610582917', 'bkash')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                title="Copy bKash Number"
              >
                {copiedAccount === 'bkash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-pink-600" />}
              </button>
            </div>

            {/* Nagad */}
            <div className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-700 block text-[11px]">নগদ (Personal)</span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {settings.paymentAccounts?.nagadNumber || '01610582917'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyNumber(settings.paymentAccounts?.nagadNumber || '01610582917', 'nagad')}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                title="Copy Nagad Number"
              >
                {copiedAccount === 'nagad' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-600 leading-relaxed">
            {settings.paymentAccounts?.paymentInstructionsBn || 'বিকাশ অথবা নগদ Send Money অপশন ব্যবহার করে নম্বরে পরিশোধ করুন এবং ট্রানজেকশন আইডি নিচে প্রদান করুন।'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Tuition Select */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              {language === 'bn' ? 'কোন শিক্ষকের টিউশন বেতন? *' : 'Select Tuition / Tutor *'}
            </label>
            {activeConfirmations.length === 0 ? (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                {language === 'bn' ? 'কোনো সক্রিয় টিউশন পাওয়া যায়নি।' : 'No active tuition found.'}
              </div>
            ) : (
              <select
                value={selectedConfId}
                onChange={(e) => handleConfChange(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-blue-800 outline-hidden"
              >
                {activeConfirmations.map((c) => (
                  <option key={c.id} value={c.id}>
                    শিক্ষক: {c.tutorName} · ছাত্র: {c.studentName} (৳{c.monthlyFee.toLocaleString()}/মাস)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Month & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'বেতনের মাস *' : 'Payment Month *'}
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white outline-hidden"
              >
                <option value="মার্চ ২০২৬ (March 2026)">মার্চ ২০২৬ (March 2026)</option>
                <option value="এপ্রিল ২০২৬ (April 2026)">এপ্রিল ২০২৬ (April 2026)</option>
                <option value="মে ২০২৬ (May 2026)">মে ২০২৬ (May 2026)</option>
                <option value="জুন ২০২৬ (June 2026)">জুন ২০২৬ (June 2026)</option>
                <option value="ফেব্রুয়ারি ২০২৬ (February 2026)">ফেব্রুয়ারি ২০২৬ (February 2026)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'টাকার পরিমাণ (BDT) *' : 'Amount (BDT) *'}
              </label>
              <input
                type="number"
                required
                min={500}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white outline-hidden"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              {language === 'bn' ? 'পরিশোধের মাধ্যম *' : 'Payment Method *'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'bkash', label: 'বিকাশ (bKash)', color: 'text-pink-700 bg-pink-50 border-pink-400' },
                { id: 'nagad', label: 'নগদ (Nagad)', color: 'text-amber-700 bg-amber-50 border-amber-400' },
                { id: 'rocket', label: 'রকেট (Rocket)', color: 'text-purple-700 bg-purple-50 border-purple-400' },
                { id: 'cash', label: 'ক্যাশ (নগদ)', color: 'text-emerald-700 bg-emerald-50 border-emerald-400' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPaymentMethod(item.id as any)}
                  className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                    paymentMethod === item.id 
                      ? `${item.color} ring-2 ring-blue-900 shadow-xs` 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID */}
          {paymentMethod !== 'cash' ? (
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID) *' : 'Transaction ID (TrxID) *'}
              </label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="যেমন: BK9X28M7QL"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase focus:bg-white focus:ring-2 focus:ring-blue-800 outline-hidden"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                মোবাইলে প্রাপ্ত ৮-১০ ডিজিটের ট্রানজেকশন কোড লিখুন।
              </span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
              💵 আপনি শিক্ষককে সরাসরি হাতে নগদ প্রদান করেছেন। এটি নিশ্চিত করলে শিক্ষকের নিকট স্বীকৃতি চাওয়া হবে এবং মানি রিসিট প্রস্তুত হবে।
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              {language === 'bn' ? 'মন্তব্য / রিসিট নোট' : 'Receipt Note'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: মার্চ মাসের নিয়মিত বেতন পরিশোধ করা হলো।' : 'e.g. Regular March tuition remuneration.'}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedConf}
              className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              <span>{language === 'bn' ? 'পেমেন্ট নিশ্চিত ও রিসিট নিন' : 'Confirm & Generate Receipt'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
