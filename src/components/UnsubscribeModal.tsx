import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BellOff, Bell, CheckCircle2, X } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Business } from '../types';
import { businesses as initialBusinesses } from '../data';

interface UnsubscribeModalProps {
  businessId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdateBusiness?: (updated: Partial<Business> & { id: string }) => void;
}

export default function UnsubscribeModal({
  businessId,
  isOpen,
  onClose,
  onUpdateBusiness
}: UnsubscribeModalProps) {
  const [businessName, setBusinessName] = useState<string>('Ihr Unternehmen');
  const [isOptedOut, setIsOptedOut] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId || !isOpen) return;

    let mounted = true;

    async function applyOptOut() {
      setIsLoading(true);
      try {
        let bName = 'Ihr Unternehmen';
        // 1. Fetch from Firestore
        const bRef = doc(db, 'businesses', businessId);
        const bSnap = await getDoc(bRef);
        if (bSnap.exists()) {
          const bData = bSnap.data() as Business;
          bName = bData.name || bName;
        } else {
          const staticMatch = initialBusinesses.find(b => b.id === businessId);
          if (staticMatch) bName = staticMatch.name;
        }

        if (mounted) setBusinessName(bName);

        // 2. Automatically apply opt-out to Firestore
        await updateDoc(bRef, {
          emailNotifications: false,
          notificationOptOutAt: new Date().toISOString()
        }).catch(async () => {
          // If doc didn't exist in Firestore, merge with static template
          const staticMatch = initialBusinesses.find(b => b.id === businessId);
          if (staticMatch) {
            const { setDoc } = await import('firebase/firestore');
            await setDoc(bRef, {
              ...staticMatch,
              emailNotifications: false,
              notificationOptOutAt: new Date().toISOString()
            }, { merge: true });
          }
        });

        if (onUpdateBusiness) {
          onUpdateBusiness({ id: businessId, emailNotifications: false });
        }

        if (mounted) {
          setIsOptedOut(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error applying email notification opt-out:', err);
        if (mounted) setIsLoading(false);
      }
    }

    applyOptOut();

    return () => {
      mounted = false;
    };
  }, [businessId, isOpen]);

  const handleToggle = async (enable: boolean) => {
    setIsLoading(true);
    try {
      const bRef = doc(db, 'businesses', businessId);
      await updateDoc(bRef, {
        emailNotifications: enable,
        ...(enable ? {} : { notificationOptOutAt: new Date().toISOString() })
      });
      setIsOptedOut(!enable);
      if (onUpdateBusiness) {
        onUpdateBusiness({ id: businessId, emailNotifications: enable });
      }
      setActionMessage(
        enable 
          ? 'Benachrichtigungen wurden wieder aktiviert.' 
          : 'Benachrichtigungen wurden deaktiviert.'
      );
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      console.error('Error toggling email notification status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EDE8E0] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${isOptedOut ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {isOptedOut ? <BellOff className="w-8 h-8" /> : <Bell className="w-8 h-8" />}
          </div>

          <h3 className="text-2xl font-bold text-[#1B211D] mb-2 font-display">
            {isOptedOut ? 'Benachrichtigungen deaktiviert' : 'Benachrichtigungen aktiv'}
          </h3>

          <p className="text-[#5F6B63] text-sm leading-relaxed mb-6">
            {isOptedOut ? (
              <>
                Für <strong>{businessName}</strong> werden ab sofort keine automatischen E-Mail-Benachrichtigungen mehr versendet (weder bei neuen Kundenfragen noch bei neuen Bewertungen).
              </>
            ) : (
              <>
                Für <strong>{businessName}</strong> sind die E-Mail-Benachrichtigungen bei neuen Kundenanfragen und Bewertungen wieder aktiv.
              </>
            )}
          </p>

          {actionMessage && (
            <div className="mb-5 p-3 rounded-lg bg-[#E8F1EB] text-[#0F4C2E] text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {actionMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isOptedOut ? (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleToggle(true)}
                className="px-5 py-2.5 rounded-lg border border-[#0F4C2E] text-[#0F4C2E] hover:bg-[#0F4C2E]/5 text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                Aus Versehen abgemeldet? Wieder aktivieren
              </button>
            ) : (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleToggle(false)}
                className="px-5 py-2.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <BellOff className="w-4 h-4" />
                Erneut deaktivieren
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#0F4C2E] hover:bg-[#06301C] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Fertig
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
