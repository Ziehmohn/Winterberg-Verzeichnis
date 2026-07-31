import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <a href="/" className="block">
          <Logo />
        </a>
      </div>
      <div className="text-center max-w-lg mb-8 mt-16 md:mt-0">
        <h1 className="text-8xl md:text-9xl font-display font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Seite nicht gefunden</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
          Die angegebene URL stimmt mit keinem bekannten Unternehmen oder einer Kategorie in Winterberg überein.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-black/80 transition-colors shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Zurück zur Startseite
        </a>
      </div>
    </div>
  );
}
