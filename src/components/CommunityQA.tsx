import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  HelpCircle, 
  Plus, 
  Send, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ShieldCheck, 
  Star, 
  User, 
  X, 
  CornerDownRight, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Business, Question, QnAnswer } from '../types';
import { useAuth } from '../AuthContext';
import { useTranslation } from '../i18n';
import { 
  fetchQuestionsByBusiness, 
  fetchGeneralQuestions, 
  createQuestion, 
  createAnswer, 
  likeQuestion 
} from '../services/questionService';
import { getBusinessPath } from '../utils/routes';

interface CommunityQAProps {
  type: 'business' | 'general';
  business?: Business;
  title?: string;
  subtitle?: string;
}

export default function CommunityQA({ type, business, title, subtitle }: CommunityQAProps) {
  const { lang } = useTranslation();
  const isNl = lang === 'nl';
  const { currentUser, userProfile } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);
  const [activeAnswerQuestionId, setActiveAnswerQuestionId] = useState<string | null>(null);

  // Ask Question Form State
  const [askQuestionText, setAskQuestionText] = useState('');
  const [askAuthorName, setAskAuthorName] = useState(currentUser?.displayName || '');
  const [askAuthorEmail, setAskAuthorEmail] = useState(currentUser?.email || '');
  const [askHoneypot, setAskHoneypot] = useState(''); // Anti-bot honeypot
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [questionSuccessMessage, setQuestionSuccessMessage] = useState(false);

  // Answer Form State
  const [answerText, setAnswerText] = useState('');
  const [answerAuthorName, setAnswerAuthorName] = useState(currentUser?.displayName || '');
  const [answerAuthorEmail, setAnswerAuthorEmail] = useState(currentUser?.email || '');
  const [answerHoneypot, setAnswerHoneypot] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Liked tracking (client-side prevention of multiple clicks)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Determine if current user is owner or admin
  const isBusinessOwner = useMemo(() => {
    if (!currentUser || !business) return false;
    return business.ownerId === currentUser.uid || (userProfile?.ownedBusinessId === business.id);
  }, [currentUser, business, userProfile]);

  const isAdmin = useMemo(() => {
    return userProfile?.role === 'admin';
  }, [userProfile]);

  // Load questions
  const loadQuestions = async () => {
    setLoading(true);
    try {
      if (type === 'business' && business) {
        const data = await fetchQuestionsByBusiness(business.id);
        setQuestions(data);
      } else {
        const data = await fetchGeneralQuestions();
        setQuestions(data);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [type, business?.id]);

  // Handle Question Submit
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (askHoneypot) return; // Silent discard for spambots
    if (!askQuestionText.trim() || askQuestionText.trim().length < 5) {
      alert(isNl ? 'Voer een vraag in van minimaal 5 tekens.' : 'Bitte geben Sie eine Frage mit mindestens 5 Zeichen ein.');
      return;
    }

    setIsSubmittingQuestion(true);
    try {
      const businessSlug = business ? getBusinessPath(business, lang).replace(/^\//, '') : undefined;
      const targetBusinessEmail = business?.ownerEmail || business?.email;
      const isClaimed = !!(business?.ownerId || business?.ownerEmail);
      const newQ = await createQuestion({
        type,
        businessId: business?.id,
        businessName: business?.name,
        businessSlug,
        businessEmail: targetBusinessEmail,
        isClaimed,
        question: askQuestionText,
        authorName: askAuthorName.trim() || (isNl ? 'Bezoeker' : 'Besucher'),
        authorEmail: askAuthorEmail.trim() || undefined,
        userId: currentUser?.uid,
        lang
      });

      setQuestions(prev => [newQ, ...prev]);
      setAskQuestionText('');
      if (!currentUser) {
        setAskAuthorName('');
        setAskAuthorEmail('');
      }
      setShowAskModal(false);
      setQuestionSuccessMessage(true);
      setTimeout(() => setQuestionSuccessMessage(false), 6000);
    } catch (err) {
      console.error('Error submitting question:', err);
      alert(isNl ? 'Fout bij het versturen van uw vraag.' : 'Fehler beim Absenden Ihrer Frage.');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // Handle Answer Submit
  const handleAnswerSubmit = async (questionId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (answerHoneypot) return;
    if (!answerText.trim() || answerText.trim().length < 3) {
      alert(isNl ? 'Voer een antwoord in.' : 'Bitte geben Sie eine Antwort ein.');
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      const isOwnerAnswering = isBusinessOwner;
      const isAdminAnswering = isAdmin && !isOwnerAnswering;

      const fallbackName = isOwnerAnswering 
        ? (business?.name || (isNl ? 'Eigenaar' : 'Inhaber'))
        : isAdminAnswering 
          ? 'Winterberg Verzeichnis Team' 
          : (isNl ? 'Bezoeker' : 'Besucher');

      const newAns = await createAnswer(questionId, {
        authorName: answerAuthorName.trim() || fallbackName,
        authorEmail: answerAuthorEmail.trim() || undefined,
        userId: currentUser?.uid,
        isOwner: isOwnerAnswering,
        isAdmin: isAdminAnswering,
        text: answerText
      });

      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...(q.answers || []), newAns]
          };
        }
        return q;
      }));

      setAnswerText('');
      setActiveAnswerQuestionId(null);
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert(isNl ? 'Fout bij het plaatsen van uw antwoord.' : 'Fehler beim Veröffentlichen Ihrer Antwort.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Handle Like Question
  const handleLike = async (questionId: string) => {
    if (likedIds.has(questionId)) return;
    setLikedIds(prev => new Set(prev).add(questionId));

    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return { ...q, likes: (q.likes || 0) + 1 };
      }
      return q;
    }));

    try {
      await likeQuestion(questionId);
    } catch (err) {
      console.error('Error liking question:', err);
    }
  };

  // Formatted title and subtitle
  const defaultTitle = type === 'business'
    ? (isNl ? `Vragen & antwoorden over ${business?.name}` : `Fragen & Antworten zu ${business?.name}`)
    : (isNl ? 'Winterberg Community Vragen & Antwoorden' : 'Winterberg Community-Fragen & Antworten');

  const defaultSubtitle = type === 'business'
    ? (isNl ? 'Heeft u een vraag over dit bedrijf? Stel uw vraag hier en ontvang antwoord van het bedrijf of de community.' : 'Haben Sie eine Frage an den Betrieb oder die Community? Hier können Sie Fragen stellen und Antworten erhalten.')
    : (isNl ? 'Stel uw vraag over uitstapjes, tips of activiteiten in Winterberg aan de community.' : 'Haben Sie eine Frage zu Ausflugszielen, Gastronomie oder Tipps in Winterberg? Fragen Sie die Community!');

  return (
    <section className="mt-8 pt-8 border-t border-[#EDE8E0]">
      {/* Header with Title and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[#0F4C2E] font-bold text-xs uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4 text-[#F2761B]" />
            <span>{isNl ? 'Community & Q&A' : 'Community & Q&A'}</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1B211D] m-0">
            {title || defaultTitle}
          </h2>
          <p className="text-sm text-[#5F6B63] mt-1 max-w-2xl">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentUser) {
              if (!askAuthorName) setAskAuthorName(currentUser.displayName || '');
              if (!askAuthorEmail) setAskAuthorEmail(currentUser.email || '');
            }
            setShowAskModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C2E] hover:bg-[#15603A] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{isNl ? 'Vraag stellen' : 'Frage stellen'}</span>
        </button>
      </div>

      {/* Success Banner */}
      {questionSuccessMessage && (
        <div className="mb-5 p-4 bg-[#E8F1EB] border border-[#C5DCCE] rounded-xl flex items-start gap-3 text-sm text-[#0F4C2E] animate-fade-in">
          <Check className="w-5 h-5 shrink-0 text-[#0F4C2E] mt-0.5" />
          <div>
            <strong className="block font-semibold">
              {isNl ? 'Hartelijk dank voor uw vraag!' : 'Vielen Dank für Ihre Frage!'}
            </strong>
            <span className="text-[#344038]">
              {type === 'business'
                ? (isNl 
                    ? 'De vraag is gepubliceerd en de eigenaar is op de hoogte gebracht. Zodra er een antwoord is, ontvangt u automatisch een e-mail.' 
                    : 'Die Frage wurde veröffentlicht und der Betriebsinhaber wurde per E-Mail benachrichtigt. Sobald eine Antwort eingeht, werden Sie automatisch per E-Mail informiert.')
                : (isNl 
                    ? 'Uw vraag is gepubliceerd in het FAQ-gedeelte. U ontvangt automatisch een e-mail bij nieuwe antwoorden.' 
                    : 'Ihre Frage wurde in der Community-Übersicht veröffentlicht. Sie erhalten automatisch eine E-Mail, sobald eine Antwort vorliegt.')}
            </span>
          </div>
        </div>
      )}

      {/* Questions List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-[#5F6B63]">
          <div className="inline-block w-6 h-6 border-2 border-[#0F4C2E] border-t-transparent rounded-full animate-spin mb-2" />
          <p>{isNl ? 'Vragen laden...' : 'Fragen werden geladen...'}</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-dashed border-[#D8D2C8] rounded-xl p-8 text-center">
          <HelpCircle className="w-10 h-10 mx-auto text-[#8A928B] mb-2.5 opacity-60" />
          <p className="font-semibold text-base text-[#1B211D] mb-1">
            {isNl ? 'Nog geen vragen gesteld' : 'Noch keine Fragen vorhanden'}
          </p>
          <p className="text-sm text-[#5F6B63] max-w-md mx-auto mb-4">
            {type === 'business'
              ? (isNl ? `Wees de eerste die een vraag stelt over ${business?.name || 'dit bedrijf'}.` : `Seien Sie der Erste, der eine Frage zu ${business?.name || 'diesem Unternehmen'} stellt.`)
              : (isNl ? 'Stel als eerste een vraag aan de Winterberg Community!' : 'Stellen Sie als Erster eine Frage an die Winterberg-Community!')}
          </p>
          <button
            type="button"
            onClick={() => setShowAskModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0F4C2E] text-white text-xs font-semibold hover:bg-[#15603A] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isNl ? 'Nu eerste vraag stellen' : 'Jetzt erste Frage stellen'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const isAnsweringThis = activeAnswerQuestionId === q.id;
            const answersCount = (q.answers || []).length;
            const isLiked = likedIds.has(q.id);

            return (
              <div 
                key={q.id}
                className="bg-white border border-[#EDE8E0] rounded-xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(27,33,29,0.02)] hover:border-[#0F4C2E]/30 transition-all"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center font-bold text-[#0F4C2E] text-xs uppercase shrink-0 mt-0.5">
                      {q.authorName ? q.authorName.charAt(0) : '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[16px] text-[#1B211D] leading-snug m-0">
                        {q.question}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#8A928B] flex-wrap">
                        <span>{q.authorName}</span>
                        <span>•</span>
                        <span>{new Date(q.createdAt).toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        {q.type === 'business' && q.businessName && type === 'general' && (
                          <>
                            <span>•</span>
                            <span className="text-[#0F4C2E] font-medium">zu {q.businessName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <button
                    type="button"
                    onClick={() => handleLike(q.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                      isLiked 
                        ? 'bg-[#E8F1EB] text-[#0F4C2E] border-[#0F4C2E]/30 font-semibold' 
                        : 'bg-[#FAF8F5] text-[#5F6B63] border-[#EDE8E0] hover:bg-[#F3F0EA]'
                    }`}
                    title={isNl ? 'Vind deze vraag nuttig' : 'Diese Frage ist hilfreich'}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'text-[#0F4C2E]' : 'text-gray-400'}`} />
                    <span>{q.likes || 0}</span>
                  </button>
                </div>

                {/* Answers Section */}
                <div className="mt-4 pt-3.5 border-t border-[#F3F0EA]">
                  {answersCount > 0 ? (
                    <div className="space-y-3 pl-3 sm:pl-6 border-l-2 border-[#E7E2DA]">
                      {q.answers.map((ans) => (
                        <div key={ans.id} className="text-sm bg-[#FAF8F5] p-3.5 rounded-lg border border-[#EDE8E0]">
                          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-[#1B211D] text-[13.5px]">
                                {ans.authorName}
                              </span>

                              {/* Owner Badge */}
                              {ans.isOwner && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0F4C2E] text-white shadow-2xs">
                                  <Star className="w-3 h-3 text-[#F2761B] fill-[#F2761B]" />
                                  <span>{isNl ? 'Officiële eigenaarsreactie' : 'Offizielle Inhaber-Antwort'}</span>
                                </span>
                              )}

                              {/* Admin Badge */}
                              {ans.isAdmin && !ans.isOwner && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E8F1EB] text-[#0F4C2E] border border-[#0F4C2E]/30">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C2E]" />
                                  <span>Winterberg Verzeichnis Team</span>
                                </span>
                              )}

                              {!ans.isOwner && !ans.isAdmin && (
                                <span className="text-[11px] text-[#8A928B] bg-white px-1.5 py-0.5 rounded border border-[#EDE8E0]">
                                  {isNl ? 'Community' : 'Community'}
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] text-[#8A928B]">
                              {new Date(ans.createdAt).toLocaleDateString(isNl ? 'nl-NL' : 'de-DE', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          <p className="text-[#344038] text-[13.5px] leading-relaxed m-0 whitespace-pre-line">
                            {ans.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8A928B] italic mb-2">
                      {isNl ? 'Nog geen antwoorden op deze vraag.' : 'Noch keine Antworten vorhanden.'}
                    </p>
                  )}

                  {/* Answer Trigger Button / Form */}
                  <div className="mt-3 flex items-center justify-between">
                    {!isAnsweringThis ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveAnswerQuestionId(q.id);
                          if (currentUser) {
                            if (isBusinessOwner) {
                              setAnswerAuthorName(business?.name || currentUser.displayName || '');
                            } else {
                              setAnswerAuthorName(currentUser.displayName || '');
                            }
                            setAnswerAuthorEmail(currentUser.email || '');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C2E] hover:text-[#15603A] hover:underline cursor-pointer"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>
                          {isBusinessOwner 
                            ? (isNl ? 'Als eigenaar antwoorden' : 'Als Inhaber antworten') 
                            : (isNl ? 'Antwoord geven' : 'Antwort verfassen')}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveAnswerQuestionId(null)}
                        className="text-xs text-[#8A928B] hover:text-[#1B211D] cursor-pointer"
                      >
                        {isNl ? 'Annuleren' : 'Abbrechen'}
                      </button>
                    )}
                  </div>

                  {/* Inline Answer Form */}
                  {isAnsweringThis && (
                    <form 
                      onSubmit={(e) => handleAnswerSubmit(q.id, e)}
                      className="mt-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-3.5 space-y-3"
                    >
                      {/* Honeypot */}
                      <input 
                        type="text" 
                        value={answerHoneypot} 
                        onChange={(e) => setAnswerHoneypot(e.target.value)} 
                        tabIndex={-1} 
                        autoComplete="off" 
                        style={{ display: 'none' }} 
                      />

                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                          <label className="block text-[11px] font-bold text-[#5F6B63] mb-1 uppercase tracking-wider">
                            {isBusinessOwner ? (isNl ? 'Naam (Bedrijf / Eigenaar)' : 'Name (Inhaber / Betrieb)') : (isNl ? 'Uw naam' : 'Ihr Name')}
                          </label>
                          <input
                            type="text"
                            required
                            value={answerAuthorName}
                            onChange={(e) => setAnswerAuthorName(e.target.value)}
                            placeholder={isBusinessOwner ? (business?.name || 'Inhaber') : (isNl ? 'bijv. Lisa M.' : 'z.B. Lisa M.')}
                            className="w-full bg-white border border-[#D5D0C5] rounded-md px-3 py-1.5 text-xs text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[11px] font-bold text-[#5F6B63] mb-1 uppercase tracking-wider">
                            {isNl ? 'E-mail (optioneel, niet openbaar)' : 'E-Mail (optional, nicht öffentlich)'}
                          </label>
                          <input
                            type="email"
                            value={answerAuthorEmail}
                            onChange={(e) => setAnswerAuthorEmail(e.target.value)}
                            placeholder="name@beispiel.de"
                            className="w-full bg-white border border-[#D5D0C5] rounded-md px-3 py-1.5 text-xs text-[#1B211D] focus:outline-none focus:border-[#0F4C2E]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#5F6B63] mb-1 uppercase tracking-wider">
                          {isNl ? 'Uw antwoord' : 'Ihre Antwort'}
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder={isNl ? 'Schrijf hier uw antwoord...' : 'Geben Sie hier Ihre Antwort ein...'}
                          className="w-full bg-white border border-[#D5D0C5] rounded-md p-3 text-xs text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] resize-y"
                        />
                      </div>

                      <div className="flex justify-end gap-2 items-center pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveAnswerQuestionId(null)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#5F6B63] hover:text-[#1B211D] cursor-pointer"
                        >
                          {isNl ? 'Annuleren' : 'Abbrechen'}
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingAnswer}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#0F4C2E] text-white text-xs font-semibold hover:bg-[#15603A] disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSubmittingAnswer ? (isNl ? 'Plaatsen...' : 'Wird gesendet...') : (isNl ? 'Antwoord plaatsen' : 'Antwort veröffentlichen')}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Ask Question */}
      {showAskModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#EDE8E0] relative animate-scale-up">
            <button
              type="button"
              onClick={() => setShowAskModal(false)}
              className="absolute top-4 right-4 text-[#8A928B] hover:text-[#1B211D] p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#0F4C2E] font-bold text-xs uppercase tracking-wider mb-1.5">
              <MessageSquare className="w-4 h-4 text-[#F2761B]" />
              <span>{isNl ? 'Nieuwe vraag' : 'Neue Frage stellen'}</span>
            </div>
            
            <h3 className="font-display text-xl font-bold text-[#1B211D] mb-1">
              {type === 'business'
                ? (isNl ? `Vraag stellen over ${business?.name}` : `Frage zu ${business?.name} stellen`)
                : (isNl ? 'Vraag aan de Winterberg Community' : 'Frage an die Winterberg-Community stellen')}
            </h3>

            <p className="text-xs text-[#5F6B63] mb-5">
              {type === 'business'
                ? (isNl ? 'De eigenaar en lokale bezoekers kunnen uw vraag direct beantwoorden.' : 'Der Inhaber und andere Gäste können Ihre Frage direkt beantworten. Sie können optional eine E-Mail für Benachrichtigungen angeben.')
                : (isNl ? 'Lokale kenners en de community helpen u graag verder.' : 'Einheimische und Urlauber helfen Ihnen gerne mit aktuellen Tipps und Erfahrungen.')}
            </p>

            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              {/* Honeypot */}
              <input 
                type="text" 
                value={askHoneypot} 
                onChange={(e) => setAskHoneypot(e.target.value)} 
                tabIndex={-1} 
                autoComplete="off" 
                style={{ display: 'none' }} 
              />

              <div>
                <label className="block text-xs font-bold text-[#1B211D] mb-1">
                  {isNl ? 'Uw vraag *' : 'Ihre Frage *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={askQuestionText}
                  onChange={(e) => setAskQuestionText(e.target.value)}
                  placeholder={type === 'business'
                    ? (isNl ? 'bijv. Zijn honden toegestaan op het terras?' : 'z.B. Sind Hunde im Restaurant oder Außenbereich erlaubt?')
                    : (isNl ? 'bijv. Waar kan men het beste rodelen met kleine kinderen?' : 'z.B. Wo kann man in Winterberg am besten mit Kleinkindern rodeln?')}
                  className="w-full bg-[#FAF8F5] border border-[#D5D0C5] rounded-lg p-3 text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] focus:bg-white resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1B211D] mb-1">
                    {isNl ? 'Uw naam / bijnaam' : 'Ihr Name / Pseudonym'}
                  </label>
                  <input
                    type="text"
                    value={askAuthorName}
                    onChange={(e) => setAskAuthorName(e.target.value)}
                    placeholder={isNl ? 'bijv. Sandra K.' : 'z.B. Sandra K.'}
                    className="w-full bg-[#FAF8F5] border border-[#D5D0C5] rounded-lg px-3 py-2 text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1B211D] mb-1 flex items-center justify-between">
                    <span>{isNl ? 'E-mailadres' : 'E-Mail-Adresse'}</span>
                    <span className="text-[11px] font-normal text-[#8A928B]">{isNl ? 'optioneel' : 'optional'}</span>
                  </label>
                  <input
                    type="email"
                    value={askAuthorEmail}
                    onChange={(e) => setAskAuthorEmail(e.target.value)}
                    placeholder="name@beispiel.de"
                    className="w-full bg-[#FAF8F5] border border-[#D5D0C5] rounded-lg px-3 py-2 text-sm text-[#1B211D] focus:outline-none focus:border-[#0F4C2E] focus:bg-white"
                  />
                  <span className="flex items-center gap-1.5 text-[11.5px] text-[#0F4C2E] mt-1 font-medium leading-tight">
                    <span>🔔</span>
                    <span>{isNl ? 'U wordt per e-mail geïnformeerd zodra een antwoord binnenkomt.' : 'Sie werden automatisch per E-Mail informiert, sobald eine Antwort vorliegt.'}</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#5F6B63] hover:text-[#1B211D] cursor-pointer"
                >
                  {isNl ? 'Annuleren' : 'Abbrechen'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuestion}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F4C2E] hover:bg-[#15603A] text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingQuestion ? (isNl ? 'Verzenden...' : 'Wird gesendet...') : (isNl ? 'Vraag plaatsen' : 'Frage absenden')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
