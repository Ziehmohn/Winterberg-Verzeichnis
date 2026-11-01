import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, VAPID_KEY, getFirebaseMessaging } from '../firebase';

const STORAGE_KEY = 'winterberg_news_push_subscribed';
const DISMISSED_KEY = 'winterberg_news_push_prompt_dismissed_until';

export interface PushSubscriptionResult {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Check if Web Push & Service Workers are supported in the current browser
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'serviceWorker' in navigator &&
    'Notification' in window &&
    'PushManager' in window
  );
}

/**
 * Returns current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isPushNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Check if the user has already subscribed on this device
 */
export function isUserSubscribedToPush(): boolean {
  if (!isPushNotificationSupported()) return false;
  return (
    Notification.permission === 'granted' &&
    localStorage.getItem(STORAGE_KEY) === 'true'
  );
}

/**
 * Check if user dismissed the prompt recently
 */
export function isPromptDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  const dismissedUntil = localStorage.getItem(DISMISSED_KEY);
  if (!dismissedUntil) return false;
  return Date.now() < parseInt(dismissedUntil, 10);
}

/**
 * Dismiss prompt for 14 days
 */
export function dismissPrompt(days = 14): void {
  if (typeof window === 'undefined') return;
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(DISMISSED_KEY, until.toString());
}

/**
 * Subscribe user to FCM Push Notifications for Winterberg News
 */
export async function subscribeToNewsPush(): Promise<PushSubscriptionResult> {
  if (!isPushNotificationSupported()) {
    return { success: false, error: 'Push-Benachrichtigungen werden von diesem Browser leider nicht unterstützt.' };
  }

  try {
    // 1. Request browser permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { 
        success: false, 
        error: permission === 'denied' 
          ? 'Benachrichtigungen wurden blockiert. Du kannst sie in den Browser-Einstellungen erlauben.' 
          : 'Berechtigung wurde nicht erteilt.' 
      };
    }

    // 2. Register Service Worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    try {
      await registration.update();
    } catch (_) {}
    await navigator.serviceWorker.ready;

    // 3. Get Firebase Messaging instance
    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      return { success: false, error: 'Firebase Messaging konnte nicht initialisiert werden.' };
    }

    // 4. Retrieve FCM Token
    const { getToken } = await import('firebase/messaging');
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      return { success: false, error: 'Kein Push-Token erhalten.' };
    }

    // 5. Detect platform
    const ua = navigator.userAgent;
    const platform = /iPhone|iPad|iPod/.test(ua) 
      ? 'ios' 
      : /Android/.test(ua) 
        ? 'android' 
        : /Macintosh|Mac OS/.test(ua) 
          ? 'macos' 
          : 'windows_desktop';

    // 6. Save token to Firestore collection 'push_subscriptions'
    // Encode token or use a safe docId
    const safeDocId = token.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 120);
    const docRef = doc(db, 'push_subscriptions', safeDocId);

    await setDoc(docRef, {
      token,
      topic: 'news',
      platform,
      userAgent: ua.slice(0, 300),
      createdAt: new Date().toISOString(),
      active: true
    }, { merge: true });

    // Store in localStorage
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.removeItem(DISMISSED_KEY);

    return { success: true, token };
  } catch (err: any) {
    console.error('Error subscribing to news push:', err);
    return { 
      success: false, 
      error: err?.message || 'Fehler beim Anmelden für Push-Benachrichtigungen.' 
    };
  }
}

/**
 * Unsubscribe user from push notifications
 */
export async function unsubscribeFromNewsPush(): Promise<boolean> {
  try {
    const messaging = await getFirebaseMessaging();
    if (messaging) {
      const { deleteToken } = await import('firebase/messaging');
      await deleteToken(messaging);
    }
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Error unsubscribing:', err);
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}
