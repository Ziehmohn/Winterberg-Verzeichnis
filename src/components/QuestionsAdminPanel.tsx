import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Filter, 
  CornerDownRight, 
  Send, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Question, QnAnswer } from '../types';
import { 
  fetchAllQuestionsAdmin, 
  updateQuestionStatus, 
  deleteQuestion, 
  deleteAnswer, 
  createAnswer 
} from '../services/questionService';

export default function QuestionsAdminPanel() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'general' | 'business'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingQuestionId, setReplyingQuestionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllQuestionsAdmin();
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching admin questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (q: Question) => {
    const nextStatus = q.status === 'approved' ? 'pending' : 'approved';
    try {
      await updateQuestionStatus(q.id, nextStatus);
      setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, status: nextStatus } : item));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Fehler beim Aktualisieren des Status.');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Möchten Sie diese Frage und alle zugehörigen Antworten wirklich löschen?')) return;
    try {
      await deleteQuestion(questionId);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('Fehler beim Löschen der Frage.');
    }
  };

  const handleDeleteAnswer = async (questionId: string, answerId: string) => {
    if (!confirm('Möchten Sie diese Antwort wirklich löschen?')) return;
    try {
      await deleteAnswer(questionId, answerId);
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return { ...q, answers: (q.answers || []).filter(a => a.id !== answerId) };
        }
        return q;
      }));
    } catch (err) {
      console.error('Error deleting answer:', err);
      alert('Fehler beim Löschen der Antwort.');
    }
  };

  const handleSendAdminReply = async (questionId: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      const newAns = await createAnswer(questionId, {
        authorName: 'Winterberg Verzeichnis Team',
        isAdmin: true,
        text: replyText.trim()
      });

      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return { ...q, answers: [...(q.answers || []), newAns] };
        }
        return q;
      }));

      setReplyText('');
      setReplyingQuestionId(null);
    } catch (err) {
      console.error('Error sending admin reply:', err);
      alert('Fehler beim Veröffentlichen der Antwort.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filterType === 'general' && q.type !== 'general') return false;
    if (filterType === 'business' && q.type !== 'business') return false;

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      const matchQ = q.question.toLowerCase().includes(lower);
      const matchAuthor = (q.authorName || '').toLowerCase().includes(lower);
      const matchBus = (q.businessName || '').toLowerCase().includes(lower);
      const matchAns = (q.answers || []).some(a => a.text.toLowerCase().includes(lower) || a.authorName.toLowerCase().includes(lower));
      return matchQ || matchAuthor || matchBus || matchAns;
    }

    return true;
  });

  return (
    <div className="bg-white border border-[#EDE8E0] rounded-xl p-6 shadow-[0_10px_30px_rgba(27,33,29,0.06)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#EDE8E0]">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1B211D] flex items-center gap-2 m-0">
            <MessageSquare className="w-5 h-5 text-[#F2761B]" />
            <span>Community Fragen & Antworten (Q&A Moderation)</span>
          </h2>
          <p className="text-xs text-[#5F6B63] mt-1">
            Verwalten, prüfen, beantworten und moderieren Sie alle eingereichten Fragen zu Winterberg und zu den Betrieben.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E7E2DA] bg-[#FAF8F5] hover:bg-[#EDE8E0] text-xs font-semibold text-[#1B211D] transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Aktualisieren</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Frage, Autor oder Unternehmen suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#D5D0C5] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#5F6B63]" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-[#FAF8F5] border border-[#D5D0C5] rounded-lg px-3 py-2 text-xs text-[#1B211D] font-medium focus:outline-none focus:border-[#0F4C2E] cursor-pointer"
          >
            <option value="all">Alle Bereiche ({questions.length})</option>
            <option value="general">Nur FAQ / Allgemein ({questions.filter(q => q.type === 'general').length})</option>
            <option value="business">Nur Unternehmen ({questions.filter(q => q.type === 'business').length})</option>
          </select>
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="py-16 text-center text-sm text-[#5F6B63]">
          <div className="inline-block w-6 h-6 border-2 border-[#0F4C2E] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Fragen werden geladen...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="py-12 text-center text-sm text-[#5F6B63] bg-[#FAF8F5] rounded-lg border border-dashed border-[#E7E2DA]">
          Keine passenden Fragen gefunden.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isApproved = q.status !== 'pending';
            const isReplying = replyingQuestionId === q.id;

            return (
              <div 
                key={q.id}
                className={`border rounded-xl p-4 transition-colors ${
                  isApproved ? 'bg-white border-[#EDE8E0]' : 'bg-[#FFF8F0] border-[#F2761B]/30'
                }`}
              >
                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs text-[#5F6B63]">
                  <div className="flex items-center gap-2 flex-wrap">
                    {q.type === 'business' ? (
                      <span className="px-2 py-0.5 rounded bg-[#E8F1EB] text-[#0F4C2E] font-semibold text-[11px]">
                        🏢 {q.businessName || 'Unternehmen'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        🌐 Winterberg FAQ Community
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isApproved ? 'Freigegeben' : 'Ausstehend'}
                    </span>

                    <span>von <strong>{q.authorName}</strong></span>
                    {q.authorEmail && <span className="text-[#8A928B]">({q.authorEmail})</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#8A928B]">
                      {new Date(q.createdAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(q)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                          isApproved 
                            ? 'bg-gray-100 hover:bg-gray-200 text-[#1B211D]' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title={isApproved ? 'Auf ausstehend setzen' : 'Freigeben'}
                      >
                        {isApproved ? 'Verstecken' : 'Freigeben'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Frage unwiderruflich löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-[15px] font-semibold text-[#1B211D] mb-3">
                  „{q.question}“
                </div>

                {/* Answers Section */}
                <div className="space-y-2 pt-2 border-t border-[#F3F0EA]">
                  <div className="text-xs font-bold text-[#5F6B63] flex items-center justify-between">
                    <span>Antworten ({(q.answers || []).length})</span>
                    {!isReplying && (
                      <button
                        type="button"
                        onClick={() => { setReplyingQuestionId(q.id); setReplyText(''); }}
                        className="inline-flex items-center gap-1 text-[#0F4C2E] hover:underline cursor-pointer font-semibold"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Als Team antworten</span>
                      </button>
                    )}
                  </div>

                  {q.answers && q.answers.length > 0 ? (
                    <div className="space-y-2 pl-3 border-l-2 border-[#E7E2DA]">
                      {q.answers.map(ans => (
                        <div key={ans.id} className="bg-[#FAF8F5] p-3 rounded-lg text-xs flex justify-between gap-3 items-start border border-[#EDE8E0]">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#1B211D]">{ans.authorName}</span>
                              {ans.isOwner && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0F4C2E] text-white">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  Inhaber
                                </span>
                              )}
                              {ans.isAdmin && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8F1EB] text-[#0F4C2E]">
                                  <ShieldCheck className="w-2.5 h-2.5" />
                                  Team
                                </span>
                              )}
                              <span className="text-[#8A928B]">
                                {new Date(ans.createdAt).toLocaleDateString('de-DE')}
                              </span>
                            </div>
                            <p className="text-[#344038] text-[13px] leading-relaxed m-0">{ans.text}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteAnswer(q.id, ans.id)}
                            className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                            title="Antwort löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-[#8A928B] italic">Noch keine Antworten eingegangen.</div>
                  )}

                  {/* Team Reply Box */}
                  {isReplying && (
                    <div className="mt-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg p-3 space-y-2">
                      <div className="text-xs font-bold text-[#0F4C2E] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Offizielle Antwort als Winterberg Verzeichnis Team verfassen:</span>
                      </div>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Ihre Antwort eingeben..."
                        className="w-full bg-white border border-[#D5D0C5] rounded p-2 text-xs text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                      />
                      <div className="flex justify-end gap-2 items-center">
                        <button
                          type="button"
                          onClick={() => setReplyingQuestionId(null)}
                          className="px-2.5 py-1 text-xs text-[#5F6B63] hover:text-[#1B211D] cursor-pointer"
                        >
                          Abbrechen
                        </button>
                        <button
                          type="button"
                          disabled={isSubmittingReply}
                          onClick={() => handleSendAdminReply(q.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#0F4C2E] text-white text-xs font-semibold hover:bg-[#15603A] disabled:opacity-50 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isSubmittingReply ? 'Wird gesendet...' : 'Antwort veröffentlichen'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
