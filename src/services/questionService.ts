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
import { Question, QnAnswer } from '../types';

const QUESTIONS_COLLECTION = 'questions';

/**
 * Send automated email notification via /api/send-mail
 */
async function sendNotificationEmail(payload: { to: string; subject: string; html: string; cc?: string }) {
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
  question: string;
  authorName: string;
  authorEmail?: string;
  userId?: string;
  lang?: 'de' | 'nl';
}): Promise<Question> {
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
  if (params.businessEmail) newQuestionData.businessEmail = params.businessEmail;
  if (params.authorEmail && params.authorEmail.trim()) newQuestionData.authorEmail = params.authorEmail.trim();
  if (params.userId) newQuestionData.userId = params.userId;

  const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), newQuestionData);
  const created: Question = { id: docRef.id, ...newQuestionData };

  // Trigger email notification
  if (params.type === 'business' && params.businessName) {
    const profileUrl = `https://www.winterberg-verzeichnis.de${params.businessSlug ? `/${params.businessSlug}` : ''}`;
    const targetEmail = params.businessEmail || 'info@sichtbar-online.com';
    const isOwnerKnown = !!params.businessEmail;

    sendNotificationEmail({
      to: targetEmail,
      cc: isOwnerKnown ? 'info@sichtbar-online.com' : undefined,
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

          <div style="margin: 25px 0;">
            <a href="${profileUrl}" style="background-color: #0F4C2E; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Frage jetzt beantworten &rarr;
            </a>
          </div>

          <hr style="border: 0; border-top: 1px solid #EDE8E0; margin: 25px 0;" />
          <p style="font-size: 12px; color: #8A928B;">Diese E-Mail wurde automatisch vom Winterberg Verzeichnis (winterberg-verzeichnis.de) versendet.</p>
        </div>
      `
    });
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
  if (questionData.authorEmail && questionData.authorEmail !== params.authorEmail) {
    const roleLabel = params.isOwner 
      ? 'vom Inhaber' 
      : params.isAdmin 
        ? 'vom Winterberg Verzeichnis Team' 
        : `von ${escapeHtml(newAnswer.authorName)}`;

    sendNotificationEmail({
      to: questionData.authorEmail,
      subject: `Neue Antwort auf Ihre Frage zu ${questionData.businessName || 'Winterberg'}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1B211D; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EDE8E0; border-radius: 8px;">
          <h2 style="color: #0F4C2E; margin-top: 0;">Neue Antwort auf Ihre Frage</h2>
          <p>Hallo ${escapeHtml(questionData.authorName)},</p>
          <p>auf Ihre Frage:</p>
          <p style="background: #F3F0EA; padding: 10px 14px; border-radius: 6px; font-weight: bold;">„${escapeHtml(questionData.question)}“</p>
          <p>wurde soeben eine Antwort ${roleLabel} veröffentlicht:</p>
          <div style="background-color: #FAF8F5; border-left: 4px solid #0F4C2E; padding: 14px 18px; margin: 18px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 15px; color: #1B211D;">„${escapeHtml(params.text)}“</p>
          </div>
          <p><a href="https://www.winterberg-verzeichnis.de${questionData.businessSlug ? `/${questionData.businessSlug}` : '/faq'}" style="color: #0F4C2E; font-weight: bold;">Auf der Webseite ansehen &rarr;</a></p>
        </div>
      `
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
