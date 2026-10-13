import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageCircle, Heart, Shield } from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { CallButton } from '../common/CallButton';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { TRANSLATIONS } from '../../constants/translations';
import { AdminAuthBarrier } from '../admin/AdminAuthBarrier';

export const Footer: React.FC = () => {
  const { settings, language, navigateTo } = useApp();
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const quickLinks: { label: string; view: AppView }[] = [
    { label: t.findTutor, view: 'find-tutor' },
    { label: t.tuitionJobs, view: 'tuition-jobs' },
    { label: language === 'bn' ? 'টিউশন ফি ক্যালকুলেটর' : 'Fee Calculator', view: 'fee-calculator' },
    { label: t.becomeTutor, view: 'become-a-tutor' },
    { label: t.howItWorks, view: 'how-it-works' },
    { label: t.aboutUs, view: 'about' },
    { label: t.contact, view: 'contact' },
    { label: 'FAQ', view: 'faq' },
    { label: 'Privacy Policy', view: 'privacy' },
    { label: 'Terms & Conditions', view: 'terms' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="bg-white/95 inline-block p-2 rounded-xl">
              <BrandLogo size="md" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'TutorHat বাংলাদেশের অগ্রণী ও বিশ্বস্ত অনলাইন টিউটর মার্কেটপ্লেস। মানসম্মত শিক্ষক ও শিক্ষার্থীদের নির্ভরযোগ্য সংযোগস্থল।'
                : 'TutorHat is Bangladesh’s premier trusted tutor marketplace connecting qualified university tutors with aspiring students nationwide.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 pt-1">
              <Shield className="w-4 h-4" />
              <span>{language === 'bn' ? '১০০% ভেরিফাইড শিক্ষক নেটওয়ার্ক' : '100% Verified Tutor Network'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {language === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.slice(0, 5).map((item) => (
                <li key={item.view}>
                  <button
                    type="button"
                    onClick={() => navigateTo(item.view)}
                    className="text-slate-400 hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Support & Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {language === 'bn' ? 'সহায়তা ও নীতিমালা' : 'Support & Legal'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.slice(5).map((item) => (
                <li key={item.view}>
                  <button
                    type="button"
                    onClick={() => navigateTo(item.view)}
                    className="text-slate-400 hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Central Contact Area & Direct Actions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {language === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact & Support'}
            </h4>
            
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{settings.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.supportEmail}`} className="text-xs hover:text-white transition-colors">
                  {settings.supportEmail}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <CallButton variant="outline" className="w-full bg-slate-800 text-white border-slate-700 hover:bg-slate-700 justify-start" />
              <WhatsAppButton variant="green" className="w-full justify-start" />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TutorHat. {t.allRightsReserved}</p>
          <div className="flex items-center gap-3">
            <span>Currency: <strong className="text-slate-300 font-mono">BDT ({settings.defaultCurrency})</strong></span>
            <span aria-hidden="true">·</span>
            <span>Bangladesh</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            {/* Secret unobtrusive Admin Access monogram: small letter 'A' */}
            <button
              type="button"
              onClick={() => setAdminAuthOpen(true)}
              aria-label="Administration"
              className="w-4 h-4 rounded text-[10px] font-mono text-slate-700 hover:text-slate-400 hover:bg-slate-800/80 transition-colors flex items-center justify-center select-none cursor-pointer focus:outline-none"
              title=""
            >
              A
            </button>
          </div>
        </div>
      </div>

      {/* Secret Admin Authentication Barrier Modal */}
      {adminAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-8 bg-slate-950/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md my-auto">
            <AdminAuthBarrier
              isModal={true}
              onCancel={() => setAdminAuthOpen(false)}
              onSuccess={() => {
                setAdminAuthOpen(false);
                navigateTo('admin-dashboard');
              }}
            />
          </div>
        </div>
      )}
    </footer>
  );
};
