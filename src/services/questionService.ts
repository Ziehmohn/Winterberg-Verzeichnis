import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Business, Question, QnAnswer } from '../types';
import { businesses as initialBusinesses } from '../data';

const QUESTIONS_COLLECTION = 'questions';

/**
 * Send automated email notification via /api/send-mail
 */
async function sendNotificationEmail(payload: { to: string; subject: string; html: string; cc?: string; bcc?: string }) {
  try {
    const res = await fetch('/api/send-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.warn('Failed to send Q&A notification email', await res.text());
    }
  } catch (err) {
    console.error('Error dispatching notification email:', err);
  }
}

/**
 * Fetch approved questions for a specific business profile
 */
export async function fetchQuestionsByBusiness(businessId: string): Promise<Question[]> {
  try {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      where('businessId', '==', businessId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    const list: Question[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data() as Omit<Question, 'id'>;
      if (!data.status || data.status === 'approved') {
        list.push({
          id: docSnap.id,
          ...data,
          answers: (data.answers || []).filter(a => !a.status || a.status === 'approved')
        });
      }
    });
    return list;
  } catch (err) {
    console.error(`Error fetching questions for business ${businessId}:`, err);
    // Fallback: fetch without complex index requirement if composite index missing
    try {
      const simpleQ = query(
        collection(db, QUESTIONS_COLLECTION),
        where('businessId', '==', businessId)
      );
      const snap = await getDocs(simpleQ);
      const list: Question[] = [];
      snap.forEach(docSnap => {
        const data = docSnap.data() as Omit<Question, 'id'>;
        if (!data.status || data.status === 'approved') {
          list.push({
            id: docSnap.id,
            ...data,
            answers: (data.answers || []).filter(a => !a.status || a.status === 'approved')
          });
        }
      });
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e2) {
      console.error('Fallback fetch failed:', e2);
      return [];
    }
  }
}

/**
 * Fetch approved general community questions (FAQ page)
 */
export async function fetchGeneralQuestions(): Promise<Question[]> {
  try {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      where('type', '==', 'general'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const snap = await getDocs(q);
    const list: Question[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data() as Omit<Question, 'id'>;
      if (!data.status || data.status === 'approved') {
        list.push({
          id: docSnap.id,
          ...data,
          answers: (data.answers || []).filter(a => !a.status || a.status === 'approved')
        });
      }
    });
    return list;
  } catch (err) {
    console.error('Error fetching general questions:', err);
    try {
      const simpleQ = query(
        collection(db, QUESTIONS_COLLECTION),
        where('type', '==', 'general')
      );
      const snap = await getDocs(simpleQ);
      const list: Question[] = [];
      snap.forEach(docSnap => {
        const data = docSnap.data() as Omit<Question, 'id'>;
        if (!data.status || data.status === 'approved') {
          list.push({
            id: docSnap.id,
            ...data,
            answers: (data.answers || []).filter(a => !a.status || a.status === 'approved')
          });
        }
      });
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e2) {
      console.error('Fallback fetch failed:', e2);
      return [];
    }
  }
}

/**
 * Fetch all questions for Admin Dashboard (includes pending and approved)
 */
export async function fetchAllQuestionsAdmin(): Promise<Question[]> {
  try {
    const snap = await getDocs(collection(db, QUESTIONS_COLLECTION));
    const list: Question[] = [];
    snap.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() } as Question);
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error fetching all questions for admin:', err);
    return [];
  }
}

/**
 * Create a new question and notify the owner/admin
 */
export async function createQuestion(params: {
  type: 'general' | 'business';
  businessId?: string;
  businessName?: string;
  businessSlug?: string;
  businessEmail?: string;
  isClaimed?: boolean;
  question: string;
  authorName: string;
  authorEmail?: string;
  userId?: string;
  lang?: 'de' | 'nl';
}): Promise<Question> {
  // Always resolve the freshest email & claim status directly from Firestore for business questions
  let targetBusinessEmail = params.businessEmail;
  let isClaimed = !!params.isClaimed;
  let isOptedOut = false;

  if (params.type === 'business' && params.businessId) {
    try {
      const bSnap = await getDoc(doc(db, 'businesses', params.businessId));
      if (bSnap.exists()) {
        const bData = bSnap.data() as Business;
        if (bData.emailNotifications === false) {
          isOptedOut = true;
        }
        const freshEmail = bData.ownerEmail || bData.email || bData.contactPerson?.email;
        if (freshEmail) {
          targetBusinessEmail = freshEmail;
        }
        if (bData.ownerId || bData.ownerEmail) {
          isClaimed = true;
        }
      }
    } catch (err) {
      console.warn('Could not fetch business doc in createQuestion:', err);
    }

    // Fallback: check initialBusinesses if still no email
    if (!targetBusinessEmail) {
      const staticMatch = initialBusinesses.find(b => b.id === params.businessId || b.name.toLowerCase() === params.businessName?.toLowerCase());
      if (staticMatch) {
        if (staticMatch.emailNotifications === false) {
          isOptedOut = true;
        }
        targetBusinessEmail = staticMatch.ownerEmail || staticMatch.email || staticMatch.contactPerson?.email;
        if (staticMatch.ownerId) isClaimed = true;
      }
    }
  }

  const newQuestionData: any = {
    type: params.type,
    question: params.question.trim(),
    authorName: params.authorName.trim() || 'Gast',
    createdAt: new Date().toISOString(),
    status: 'approved', // Instant publish with post-moderation
    answers: [],
    likes: 0,
    lang: params.lang || 'de'
  };

  if (params.businessId) newQuestionData.businessId = params.businessId;
  if (params.businessName) newQuestionData.businessName = params.businessName;
  if (params.businessSlug) newQuestionData.businessSlug = params.businessSlug;
  if (targetBusinessEmail) newQuestionData.businessEmail = targetBusinessEmail;
  if (params.authorEmail && params.authorEmail.trim()) newQuestionData.authorEmail = params.authorEmail.trim();
  if (params.userId) newQuestionData.userId = params.userId;

  const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), newQuestionData);
  const created: Question = { id: docRef.id, ...newQuestionData };

  // Trigger email notification (if business has not opted out)
  if (params.type === 'business' && params.businessName && !isOptedOut) {
    const profileUrl = `https://www.winterberg-verzeichnis.de${params.businessSlug ? `/${params.businessSlug}` : ''}`;
    const targetEmail = targetBusinessEmail || 'info@sichtbar-online.com';
    const isOwnerKnown = !!targetBusinessEmail;
    const isNl = params.lang === 'nl';
    const unsubscribeUrl = `https://www.winterberg-verzeichnis.de/abmelden?b=${encodeURIComponent(params.businessId || '')}`;

    const claimCtaHtml = !isClaimed ? (isNl ? `
      <div style="background-color: #FAF8F5; border: 1px solid #EDE8E0; border-left: 4px solid #F2761B; border-radius: 6px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #0F4C2E;">
          💡 Bent u de eigenaar van ${escapeHtml(params.businessName)}?
        </p>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #5F6B63; line-height: 1.5;">
          Uw vermelding in het <strong>Winterberg Verzeichnis</strong> is momenteel nog niet geclaimd. Claim uw vermelding gratis om uw openingstijden en gegevens te beheren en direct officiële antwoorden te geven.
        </p>
        <a href="${profileUrl}?claim=true" style="background-color: #F2761B; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block;">
          Vermelding nu gratis claimen &rarr;
        </a>
      </div>
    ` : `
      <div style="background-color: #FAF8F5; border: 1px solid #EDE8E0; border-left: 4px solid #F2761B; border-radius: 6px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #0F4C2E;">
          💡 Sie sind Inhaber von ${escapeHtml(params.businessName)}?
        </p>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #5F6B63; line-height: 1.5;">
          Ihr Eintrag im <strong>Winterberg Verzeichnis</strong> ist aktuell noch nicht beansprucht. Übernehmen Sie Ihr Profil kostenlos, um Ihre Kontaktdaten & Öffnungszeiten selbst zu pflegen und direkt auf Kundenanfragen zu antworten.
        </p>
        <a href="${profileUrl}?claim=true" style="background-color: #F2761B; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block;">
          Eintrag jetzt kostenlos übernehmen &rarr;
        </a>
      </div>
    `) : '';

    sendNotificationEmail({
      to: targetEmail,
      bcc: isOwnerKnown ? 'info@sichtbar-online.com' : undefined,
      subject: `Neue Frage zu ${params.businessName} - Das Winterberg Verzeichnis`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1B211D; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EDE8E0; border-radius: 8px;">
          <h2 style="color: #0F4C2E; margin-top: 0;">Neue Frage zu Ihrem Eintrag</h2>
          <p>Hallo ${params.businessName},</p>
          <p>ein Besucher hat im <strong>Winterberg Verzeichnis</strong> eine Frage zu Ihrem Profil gestellt:</p>
          
          <div style="background-color: #FAF8F5; border-left: 4px solid #F2761B; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1B211D;">„${escapeHtml(params.question.trim())}“</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #5F6B63;">Gestellt von: ${escapeHtml(params.authorName.trim() || 'Besucher')}</p>
          </div>

          <p>Sie können die Frage direkt auf Ihrem Profil beantworten. Antworten des Inhabers werden als <strong>Offizielle Inhaber-Antwort</strong> hervorgehoben:</p>

          <div style="margin: 22px 0;">
            <a href="${profileUrl}" style="background-color: #0F4C2E; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Frage jetzt beantworten &rarr;
            </a>
          </div>

          ${claimCtaHtml}

          <hr style="border: 0; border-top: 1px solid #EDE8E0; margin: 25px 0;" />
          <p style="font-size: 11px; color: #8A928B; line-height: 1.4;">
            ${isNl 
              ? `Deze e-mail is automatisch verzonden door Winterberg Verzeichnis.<br />Wilt u geen automatische e-mailmeldingen meer ontvangen voor dit profiel? <a href="${unsubscribeUrl}" style="color: #5F6B63; text-decoration: underline;">Hier met één klik uitschakelen</a>.` 
              : `Diese E-Mail wurde automatisch vom Winterberg Verzeichnis (winterberg-verzeichnis.de) versendet.<br />Sie möchten keine automatischen E-Mail-Benachrichtigungen mehr für diesen Eintrag erhalten? <a href="${unsubscribeUrl}" style="color: #5F6B63; text-decoration: underline;">Hier mit einem Klick abmelden</a>.`}
          </p>
        </div>
      `
    });
  } else if (params.type === 'business' && isOptedOut) {
    console.log(`[QuestionNotification] Business ${params.businessName} has opted out of notifications. Skipping.`);
  } else {
    // General FAQ community question -> notify team
    sendNotificationEmail({
      to: 'info@sichtbar-online.com',
      subject: `Neue Community-Frage zu Winterberg: „${params.question.slice(0, 40)}...“`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1B211D; line-height: 1.5; max-width: 600px; padding: 20px;">
          <h2 style="color: #0F4C2E;">Neue Community-Frage im FAQ-Bereich</h2>
          <p>Ein Besucher hat im FAQ-Bereich eine Frage gestellt:</p>
          <blockquote style="background: #FAF8F5; border-left: 4px solid #0F4C2E; padding: 12px; margin: 15px 0;">
            <strong>${escapeHtml(params.question)}</strong><br>
            <span style="font-size: 12px; color: #5F6B63;">Von: ${escapeHtml(params.authorName)} (${escapeHtml(params.authorEmail || 'keine E-Mail')})</span>
          </blockquote>
          <p><a href="https://www.winterberg-verzeichnis.de/faq">Zum FAQ-Bereich &rarr;</a></p>
        </div>
      `
    });
  }

  return created;
}

/**
 * Add an answer to an existing question
 */
export async function createAnswer(
  questionId: string, 
  params: {
    authorName: string;
    authorEmail?: string;
    userId?: string;
    isOwner?: boolean;
    isAdmin?: boolean;
    text: string;
  }
): Promise<QnAnswer> {
  const qDocRef = doc(db, QUESTIONS_COLLECTION, questionId);
  const qSnap = await getDoc(qDocRef);

  if (!qSnap.exists()) {
    throw new Error('Question not found');
  }

  const questionData = qSnap.data() as Question;
  const newAnswer: any = {
    id: 'ans_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    authorName: params.authorName.trim() || 'Gast',
    isOwner: !!params.isOwner,
    isAdmin: !!params.isAdmin,
    text: params.text.trim(),
    createdAt: new Date().toISOString(),
    status: 'approved',
    likes: 0
  };

  if (params.authorEmail && params.authorEmail.trim()) newAnswer.authorEmail = params.authorEmail.trim();
  if (params.userId) newAnswer.userId = params.userId;

  const updatedAnswers = [...(questionData.answers || []), newAnswer];
  await updateDoc(qDocRef, { answers: updatedAnswers });

  // If question asker gave an email, notify them that someone answered!
  const askerEmail = (questionData.authorEmail || '').trim().toLowerCase();
  const answererEmail = (params.authorEmail || '').trim().toLowerCase();

  if (askerEmail && askerEmail !== answererEmail) {
    const isOwner = !!params.isOwner;
    const isAdmin = !!params.isAdmin;
    const isNl = questionData.lang === 'nl';

    const roleLabel = isOwner 
      ? (isNl ? 'van de ondernemer' : 'vom Inhaber') 
      : isAdmin 
        ? (isNl ? 'van het Winterberg Verzeichnis Team' : 'vom Winterberg Verzeichnis Team') 
        : (isNl ? `van ${escapeHtml(newAnswer.authorName)}` : `von ${escapeHtml(newAnswer.authorName)}`);

    const targetPath = questionData.businessSlug 
      ? (questionData.businessSlug.startsWith('/') ? questionData.businessSlug : `/${questionData.businessSlug}`) 
      : (isNl ? '/nl/faq' : '/faq');
    const profileUrl = `https://www.winterberg-verzeichnis.de${targetPath}`;
    const businessName = questionData.businessName || 'Winterberg Verzeichnis';

    const subject = isNl
      ? `Nieuw antwoord op uw vraag over ${businessName} - Winterberg Verzeichnis`
      : `Neue Antwort auf Ihre Frage zu ${businessName} - Das Winterberg Verzeichnis`;

    const html = isNl ? `
      <div style="font-family: Arial, sans-serif; color: #1B211D; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EDE8E0; border-radius: 8px;">
        <h2 style="color: #0F4C2E; margin-top: 0;">Nieuw antwoord op uw vraag</h2>
        <p>Hallo ${escapeHtml(questionData.authorName || 'Bezoeker')},</p>
        <p>op uw vraag over <strong>${escapeHtml(businessName)}</strong>:</p>
        <div style="background-color: #FAF8F5; border-left: 4px solid #F2761B; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 15px; font-weight: bold; color: #1B211D;">„${escapeHtml(questionData.question)}“</p>
        </div>
        <p>is zojuist een antwoord ${roleLabel} geplaatst:</p>
        <div style="background-color: #FAF8F5; border-left: 4px solid #0F4C2E; padding: 14px 18px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 15px; color: #1B211D; white-space: pre-line;">„${escapeHtml(params.text)}“</p>
        </div>
        <p>U kunt het volledige profiel en eventuele vervolgvragen direct bekijken:</p>
        <div style="margin: 25px 0;">
          <a href="${profileUrl}" style="background-color: #0F4C2E; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Antwoord op het profiel bekijken &rarr;
          </a>
        </div>
        <hr style="border: 0; border-top: 1px solid #EDE8E0; margin: 25px 0;" />
        <p style="font-size: 12px; color: #8A928B;">Deze e-mail is automatisch verzonden door Winterberg Verzeichnis (winterberg-verzeichnis.de).</p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; color: #1B211D; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EDE8E0; border-radius: 8px;">
        <h2 style="color: #0F4C2E; margin-top: 0;">Neue Antwort auf Ihre Frage</h2>
        <p>Hallo ${escapeHtml(questionData.authorName || 'Besucher')},</p>
        <p>auf Ihre Frage zu <strong>${escapeHtml(businessName)}</strong>:</p>
        <div style="background-color: #FAF8F5; border-left: 4px solid #F2761B; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 15px; font-weight: bold; color: #1B211D;">„${escapeHtml(questionData.question)}“</p>
        </div>
        <p>wurde soeben eine Antwort ${roleLabel} veröffentlicht:</p>
        <div style="background-color: #FAF8F5; border-left: 4px solid #0F4C2E; padding: 14px 18px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 15px; color: #1B211D; white-space: pre-line;">„${escapeHtml(params.text)}“</p>
        </div>
        <p>Sie können das Profil und alle Details direkt aufrufen:</p>
        <div style="margin: 25px 0;">
          <a href="${profileUrl}" style="background-color: #0F4C2E; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Antwort auf dem Profil ansehen &rarr;
          </a>
        </div>
        <hr style="border: 0; border-top: 1px solid #EDE8E0; margin: 25px 0;" />
        <p style="font-size: 12px; color: #8A928B;">Diese E-Mail wurde automatisch vom Winterberg Verzeichnis (winterberg-verzeichnis.de) versendet.</p>
      </div>
    `;

    sendNotificationEmail({
      to: questionData.authorEmail,
      bcc: 'info@sichtbar-online.com',
      subject,
      html
    });
  }

  return newAnswer;
}

/**
 * Delete a whole question
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  await deleteDoc(doc(db, QUESTIONS_COLLECTION, questionId));
}

/**
 * Delete a specific answer from a question
 */
export async function deleteAnswer(questionId: string, answerId: string): Promise<void> {
  const qDocRef = doc(db, QUESTIONS_COLLECTION, questionId);
  const qSnap = await getDoc(qDocRef);
  if (!qSnap.exists()) return;

  const data = qSnap.data() as Question;
  const filtered = (data.answers || []).filter(a => a.id !== answerId);
  await updateDoc(qDocRef, { answers: filtered });
}

/**
 * Update question status (approved / pending)
 */
export async function updateQuestionStatus(questionId: string, status: 'approved' | 'pending'): Promise<void> {
  const qDocRef = doc(db, QUESTIONS_COLLECTION, questionId);
  await updateDoc(qDocRef, { status });
}

/**
 * Upvote / like a question
 */
export async function likeQuestion(questionId: string): Promise<void> {
  const qDocRef = doc(db, QUESTIONS_COLLECTION, questionId);
  const qSnap = await getDoc(qDocRef);
  if (!qSnap.exists()) return;

  const data = qSnap.data() as Question;
  const currentLikes = data.likes || 0;
  await updateDoc(qDocRef, { likes: currentLikes + 1 });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
