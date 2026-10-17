import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  CheckCheck, 
  ShieldCheck, 
  Phone, 
  Copy, 
  Check, 
  Sparkles, 
  User, 
  Clock, 
  GraduationCap, 
  Calendar,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { ChatConversation, ChatMessage } from '../../types';

interface ChatHubSectionProps {
  userRole: 'guardian' | 'tutor' | 'admin';
  currentUserId: string;
}

export const ChatHubSection: React.FC<ChatHubSectionProps> = ({
  userRole,
  currentUserId
}) => {
  const { language, storeState } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // User's conversations (Admin sees all platform conversations)
  const conversations = userRole === 'admin' 
    ? store.getAllConversations() 
    : store.getConversationsForUser(currentUserId);

  // Filtered conversations
  const filteredConversations = conversations.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const guardianMatch = c.guardianName.toLowerCase().includes(q);
    const tutorMatch = c.tutorName.toLowerCase().includes(q);
    const subject = (c.subjectOrContext || '').toLowerCase();
    const lastMsg = c.lastMessageText.toLowerCase();
    return guardianMatch || tutorMatch || subject.includes(q) || lastMsg.includes(q);
  });

  // Select first conversation if none selected
  useEffect(() => {
    if (!selectedConvId && conversations.length > 0) {
      setSelectedConvId(conversations[0].id);
    }
  }, [conversations, selectedConvId]);

  // Active conversation
  const activeConversation = conversations.find(c => c.id === selectedConvId) || conversations[0] || null;

  // Mark active conversation read
  useEffect(() => {
    if (activeConversation) {
      store.markConversationAsRead(activeConversation.id, currentUserId);
    }
  }, [activeConversation?.id, currentUserId]);

  // Messages for active conversation
  const activeMessages = activeConversation 
    ? store.getMessagesForConversation(activeConversation.id)
    : [];

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages.length, selectedConvId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const isAdmin = userRole === 'admin';
    const isGuardian = userRole === 'guardian';
    const receiverId = isGuardian ? activeConversation.tutorId : activeConversation.guardianId;
    const receiverName = isGuardian ? activeConversation.tutorName : activeConversation.guardianName;

    store.sendChatMessage({
      conversationId: activeConversation.id,
      senderId: currentUserId,
      senderName: isAdmin ? (language === 'bn' ? 'অ্যাডমিন মডারেশন' : 'Admin Moderation') : (isGuardian ? activeConversation.guardianName : activeConversation.tutorName),
      senderRole: userRole,
      receiverId,
      receiverName,
      text: inputText.trim(),
      messageType: isAdmin ? 'system' : 'text'
    });

    setInputText('');
  };

  const handleCopyPhone = (phone?: string) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const quickTemplates = [
    language === 'bn' 
      ? 'আসসালামু আলাইকুম, আজকের ক্লাসের নির্ধারিত সময় ঠিক আছে তো?'
      : 'Assalamu Alaikum, is today class schedule confirmed?',
    language === 'bn'
      ? 'শিক্ষার্থীর বাড়ির কাজ (Homework) প্রস্তুত রয়েছে।'
      : 'The student homework assignments are ready.',
    language === 'bn'
      ? 'আগামী সপ্তাহের ক্লাসের দিন পরিবর্তন করা সম্ভব কি?'
      : 'Is it possible to reschedule next week sessions?',
    language === 'bn'
      ? 'আজকের সিলেবাস টপিক সংক্রান্ত কিছু জানার ছিল।'
      : 'I had questions regarding today syllabus topics.'
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[720px] max-h-[85vh]">
      
      {/* LEFT PANEL: Conversation Directory */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
        
        {/* Left Header */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
                <MessageSquare className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-blue-950">
                  {language === 'bn' ? 'ইন-অ্যাপ লাইভ চ্যাট' : 'Direct Messages'}
                </h3>
                <span className="text-[10px] text-slate-500">
                  {conversations.length} টি কথোপকথন
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {language === 'bn' ? 'সরাসরি চ্যাট' : 'Live Chat'}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'নাম বা বিষয় দিয়ে খুঁজুন...' : 'Search messages...'}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-1">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-600">কোনো চ্যাট পাওয়া যায়নি</p>
              <p className="text-[11px]">টিউশন জব বা টিউটর প্রোফাইল থেকে নতুন মেসেজ পাঠান।</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConversation?.id === conv.id;
              const otherPartyName = userRole === 'admin' 
                ? `${conv.guardianName} ↔ ${conv.tutorName}`
                : (userRole === 'guardian' ? conv.tutorName : conv.guardianName);
              const unreadCount = userRole === 'admin'
                ? ((conv.unreadCountGuardian || 0) + (conv.unreadCountTutor || 0))
                : (userRole === 'guardian' ? conv.unreadCountGuardian : conv.unreadCountTutor);
              const formattedTime = new Date(conv.lastMessageTime).toLocaleDateString([], { month: 'short', day: 'numeric' });

              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full p-3.5 text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-50/80 border-l-4 border-blue-900' 
                      : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-900 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {userRole === 'admin' ? '💬' : otherPartyName.charAt(0)}
                    </div>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {otherPartyName}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{formattedTime}</span>
                    </div>

                    <p className="text-[11px] text-blue-950 font-medium truncate mb-0.5">
                      {conv.subjectOrContext || conv.jobTitle || 'টিউশন আলোচনা'}
                    </p>

                    <p className="text-[11px] text-slate-500 truncate">
                      {conv.lastMessageText}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

      </div>

      {/* RIGHT PANEL: Active Chat Thread */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Thread Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {userRole === 'admin' ? '🛡️' : (userRole === 'guardian' ? activeConversation.tutorName : activeConversation.guardianName).charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-slate-900">
                    {userRole === 'admin' 
                      ? `${activeConversation.guardianName} (অভিভাবক) ও ${activeConversation.tutorName} (শিক্ষক)`
                      : (userRole === 'guardian' ? activeConversation.tutorName : activeConversation.guardianName)}
                  </h3>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {userRole === 'admin' ? 'লাইভ সেশন' : (userRole === 'guardian' ? 'শিক্ষক' : 'অভিভাবক')}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 truncate max-w-sm">
                  {activeConversation.subjectOrContext || activeConversation.jobTitle}
                </p>
              </div>
            </div>

            {/* Phone/Shortcut Actions */}
            <div className="flex items-center gap-2">
              {userRole === 'admin' ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 hidden lg:inline">
                    অভিভাবক: {activeConversation.guardianPhone || 'N/A'} • শিক্ষক: {activeConversation.tutorPhone || 'N/A'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      store.deleteConversation(activeConversation.id);
                      setSelectedConvId(null);
                    }}
                    className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer shadow-2xs text-xs font-semibold flex items-center gap-1"
                    title="চ্যাট মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">মুছুন</span>
                  </button>
                </div>
              ) : (
                (userRole === 'guardian' ? activeConversation.tutorPhone : activeConversation.guardianPhone) && (
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(userRole === 'guardian' ? activeConversation.tutorPhone : activeConversation.guardianPhone)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="ফোন নম্বর কপি করুন"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-900" />
                    <span className="hidden sm:inline">
                      {copiedPhone ? 'কপি হয়েছে!' : (userRole === 'guardian' ? activeConversation.tutorPhone : activeConversation.guardianPhone)}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Safety Notice Banner */}
          <div className="bg-amber-50/70 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-[11px] text-amber-900 shrink-0">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <p className="truncate">
              {language === 'bn'
                ? 'প্ল্যাটফর্ম সতর্কতা: সকল আলোচনা ও টিউশন শর্তাদি চ্যাট লগে সংরক্ষিত থাকে। কোনো বিভ্রান্তিকর তথ্যের জন্য হেল্পলাইনে জানান।'
                : 'Safety Guarantee: All communication logs are saved under platform policy for transparency and trust.'}
            </p>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/60">
            {activeMessages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {isMe ? 'আপনি' : msg.senderName} • {formattedTime}
                    </span>
                  </div>

                  <div 
                    className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
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
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Templates */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {language === 'bn' ? 'দ্রুত উত্তর:' : 'Templates:'}
            </span>
            {quickTemplates.map((template, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(template)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 text-[11px] whitespace-nowrap border border-slate-200 transition-colors shrink-0 cursor-pointer"
              >
                {template.length > 32 ? template.substring(0, 32) + '...' : template}
              </button>
            ))}
          </div>

          {/* Text Input Row */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'bn' ? 'বার্তা লিখুন (যেমন: আগামী ক্লাসের সময় ও পড়াশোনা সংক্রান্ত)...' : 'Type your message...'}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-2xl bg-blue-900 hover:bg-blue-950 disabled:opacity-40 text-white font-bold text-xs transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-2 shadow-xs"
            >
              <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
          <p>কোনো সক্রিয় কথোপকথন নির্বাচিত নেই</p>
        </div>
      )}

    </div>
  );
};
