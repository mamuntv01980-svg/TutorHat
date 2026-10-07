import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Mail, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { store } from '../services/store';
import { CallButton } from '../components/common/CallButton';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const ContactPage: React.FC = () => {
  const { settings, language } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.submitContactMessage({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || undefined,
      subject: subject.trim() || 'General Inquiry',
      message: message.trim()
    });
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-950 tracking-tight">
          {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Contact TutorHat'}
        </h1>
        <p className="text-sm text-slate-600">
          {language === 'bn'
            ? 'যেকোনো জিজ্ঞাসা, সহায়তা বা অভিযোগের জন্য আমাদের টিম সর্বদা প্রস্তুত।'
            : 'Get in touch with our team for questions, platform assistance, or feedback.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-bold text-lg text-blue-950">
              {language === 'bn' ? 'সরাসরি যোগাযোগ মাধ্যম' : 'Direct Channels'}
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block text-xs">
                    {language === 'bn' ? 'হেল্পলাইন ফোন' : 'Official Phone Support'}
                  </span>
                  <a href={`tel:${settings.publicPhone}`} className="text-sm font-bold text-blue-900 tabular-nums">
                    {settings.publicPhone}
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">Everyday 9:00 AM – 10:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block text-xs">
                    {language === 'bn' ? 'হোয়াটসঅ্যাপ সাপোর্ট' : 'Official WhatsApp'}
                  </span>
                  <span className="text-sm font-bold text-emerald-700 tabular-nums font-mono">
                    {settings.whatsAppRaw}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Direct 24/7 Chat Available</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block text-xs">Email</span>
                  <a href={`mailto:${settings.supportEmail}`} className="text-blue-900 font-medium">
                    {settings.supportEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block text-xs">Office Address</span>
                  <p className="text-slate-600 leading-relaxed">{settings.officeAddress}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <CallButton variant="primary" className="w-full" />
              <WhatsAppButton variant="green" className="w-full" />
            </div>

          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-blue-950">
                  {language === 'bn' ? 'বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {language === 'bn'
                    ? 'আমাদের কাস্টমার কেয়ার টিম অতি শীঘ্রই আপনার মোবাইল নম্বরে যোগাযোগ করবে।'
                    : 'Our customer care team will review your message and reach out shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-blue-900 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-bold text-lg text-blue-950 mb-2">
                  {language === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send Us a Message'}
                </h3>

                <div>
                  <label className="font-semibold text-slate-900 block mb-1">
                    {language === 'bn' ? 'আপনার নাম' : 'Your Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Farhana Begum"
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">
                      {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-900 block mb-1">
                    {language === 'bn' ? 'বিষয় (Subject)' : 'Subject'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Tuition query, Tutor complaint, Partnership..."
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-900 block mb-1">
                    {language === 'bn' ? 'বার্তা বা জিজ্ঞাসা' : 'Message / Inquiry'} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your question or request..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Submit Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
