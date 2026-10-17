import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  CheckCheck, 
  ShieldCheck, 
  User, 
  Phone, 
  Sparkles, 
  Clock, 
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { store, tutorProfileImg } from '../../services/store';
import { TutorProfile, ChatConversation } from '../../types';

interface ChatBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTutor?: TutorProfile | null;
  targetGuardianId?: string;
  targetGuardianName?: string;
  jobId?: string;
  jobTitle?: string;
}

export const ChatBoxModal: React.FC<ChatBoxModalProps> = ({
  isOpen,
  onClose,
  targetTutor,
  targetGuardianId,
  targetGuardianName,
  jobId,
  jobTitle
}) => {
  const { currentUser, language } = useApp();
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick message template suggestions in Bengali & English
  const quickTemplates = [
    language === 'bn' 
      ? 'আসসালামু আলাইকুম, আমি টিউশনটি বিষয়ে বিস্তারিত কথা বলতে আগ্রহী।'
      : 'Assalamu Alaikum, I would like to discuss this tuition opportunity.',
    language === 'bn'
      ? 'আগামী ডেমো ক্লাসের সময়সূচি ও সুবিধাজনক দিন নির্ধারণ করতে চাই।'
      : 'I want to schedule the upcoming demo class timing.',
    language === 'bn'
      ? 'শিক্ষার্থীর বর্তমান সিলেবাস, বোর্ড ও পরীক্ষার সময়সূচি জানাবেন কি?'
      : 'Could you share the student syllabus, curriculum and exam schedule?',
    language === 'bn'
      ? 'সাপ্তাহিক কতদিন এবং কোন কোন সময়ে পড়াতে হবে?'
      : 'What days of the week and timings are preferred?'
  ];

  // Resolve or initialize conversation
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    if (currentUser.role === 'guardian' && targetTutor) {
      const conv = store.getOrCreateConversation(
        currentUser.id,
        targetTutor.id,
        jobId,
        jobTitle || `Tuition inquiry with ${targetTutor.fullName}`
      );
      setConversation(conv);
      store.markConversationAsRead(conv.id, currentUser.id);
    } else if (currentUser.role === 'tutor' && targetGuardianId) {
      const conv = store.getOrCreateConversation(
        targetGuardianId,
        currentUser.id,
        jobId,
        jobTitle || `Application inquiry from ${currentUser.name}`
      );
      setConversation(conv);
      store.markConversationAsRead(conv.id, currentUser.id);
    } else if (targetTutor) {
      // Admin or other role inspecting/communicating
      const conv = store.getOrCreateConversation(
        'user_guardian_01',
        targetTutor.id,
        jobId,
        jobTitle
      );
      setConversation(conv);
    }
  }, [isOpen, currentUser, targetTutor, targetGuardianId, jobId, jobTitle]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, store.getState().chatMessages]);

  if (!isOpen || !currentUser) return null;

  const currentMessages = conversation 
    ? store.getMessagesForConversation(conversation.id)
    : [];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !conversation) return;

    const isGuardian = currentUser.role === 'guardian';
    const receiverId = isGuardian ? conversation.tutorId : conversation.guardianId;
    const receiverName = isGuardian ? conversation.tutorName : conversation.guardianName;

    store.sendChatMessage({
      conversationId: conversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId,
      receiverName,
      text: inputText.trim(),
      messageType: 'text'
    });

    setInputText('');
  };

  const handleTemplateClick = (template: string) => {
    setInputText(template);
  };

  const otherPartyName = currentUser.role === 'guardian'
    ? (targetTutor?.fullName || conversation?.tutorName || 'শিক্ষক')
    : (targetGuardianName || conversation?.guardianName || 'অভিভাবক');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[620px] max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              {targetTutor?.photo ? (
                <img 
                  src={targetTutor.photo} 
                  alt={otherPartyName} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-800 border-2 border-white/40 flex items-center justify-center font-bold text-white text-sm">
                  {otherPartyName.charAt(0)}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-blue-950" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-[200px]">
                  {otherPartyName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-blue-950">
                  {language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}
                </span>
              </div>
              <p className="text-[11px] text-blue-200 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{language === 'bn' ? 'অনলাইন ও সক্রিয়' : 'Active Online'}</span>
                {jobTitle && <span className="opacity-70 truncate max-w-[150px]"> • {jobTitle}</span>}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Safety Warning Banner */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="truncate">
            {language === 'bn'
              ? 'নিরাপত্তা টিপস: প্রতারণা এড়াতে প্ল্যাটফর্মের বাইরের কোনো সন্দেহজনক আর্থিক লেনদেন করবেন না।'
              : 'Safety Tip: Always verify tutor credentials and keep payments inside platform guarantees.'}
          </p>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
          {currentMessages.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">
                {language === 'bn' ? 'কোনো মেসেজ নেই' : 'No messages yet'}
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {language === 'bn'
                  ? 'নিচের কুইক রিপ্লাই টেমপ্লেট নির্বাচন করুন অথবা আপনার নিজস্ব বার্তা লিখে সরাসরি কথা শুরু করুন।'
                  : 'Start the conversation by selecting a quick template below or typing your message.'}
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <span className="text-[10px] text-slate-400 font-medium px-1">
                    {isMe ? (language === 'bn' ? 'আপনি' : 'You') : msg.senderName} • {formattedTime}
                  </span>

                  <div 
                    className={`max-w-[85%] sm:max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isMe 
                        ? 'bg-blue-900 text-white rounded-br-xs' 
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Template Pills */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {language === 'bn' ? 'দ্রুত প্রশ্ন:' : 'Templates:'}
          </span>
          {quickTemplates.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTemplateClick(t)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 text-[11px] whitespace-nowrap border border-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              {t.length > 28 ? t.substring(0, 28) + '...' : t}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={language === 'bn' ? 'আপনার মেসেজ লিখুন...' : 'Type a message...'}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-2xl bg-blue-900 hover:bg-blue-950 disabled:opacity-40 text-white transition-all shrink-0 cursor-pointer active:scale-95 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
