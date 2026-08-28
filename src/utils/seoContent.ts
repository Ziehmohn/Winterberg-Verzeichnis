export interface FAQ {
  question: string;
  answer: string;
}

export interface SeoContent {
  introTitle: string;
  introText: string;
  faqs: FAQ[];
}

export function getSeoContent(category: string, location: string, businessCount: number): SeoContent {
  const locText = location !== 'Alle' ? location : 'Winterberg und Umgebung';
  const isAll = category === 'Alle';

  let introTitle = '';
  let introText = '';
  const faqs: FAQ[] = [];

  if (isAll) {
    introTitle = `Alle Unternehmen in ${locText}`;
    introText = `Finden Sie hier alle registrierten Unternehmen, Dienstleister und Geschäfte in ${locText}. Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Betriebe. Unterstützen Sie die lokale Wirtschaft und finden Sie genau das, was Sie suchen.`;
    
    faqs.push({
      question: `Wie viele Unternehmen gibt es in ${locText}?`,
      answer: `Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Unternehmen, Handwerker und Dienstleister aus ${locText}.`
    });
    faqs.push({
      question: `Welche Branchen sind in Winterberg vertreten?`,
      answer: `Winterberg bietet eine große Vielfalt an Branchen: Von erstklassiger Gastronomie und Hotellerie über lokales Handwerk und Einzelhandel bis hin zu umfassenden Dienstleistungen.`
    });
  } else {
    // Kategoriespezifische Texte
    switch (category) {
      case 'Gastronomie':
        introTitle = `Gastronomie & Restaurants in ${locText}`;
        introText = `Entdecken Sie die kulinarische Vielfalt in ${locText}. Egal ob gemütliches Café, rustikales Gasthaus oder feines Restaurant – hier finden Sie die besten Adressen für Genießer. Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Gastronomiebetriebe.`;
        faqs.push({
          question: `Wie viele Gastronomie-Betriebe gibt es in ${locText}?`,
          answer: `Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Restaurants, Cafés und Kneipen aus ${locText}.`
        });
        faqs.push({
          question: `Haben die Restaurants in ${locText} heute geöffnet?`,
          answer: `Viele Betriebe in ${locText} haben täglich geöffnet. Nutzen Sie unsere praktische Filterfunktion, um direkt zu sehen, welche Gastronomie aktuell geöffnet hat.`
        });
        break;
      case 'Handwerk':
        introTitle = `Handwerker in ${locText} finden`;
        introText = `Auf der Suche nach einem zuverlässigen Handwerker in ${locText}? Egal ob Dachdecker, Schreiner, Elektriker oder KFZ-Werkstatt – hier finden Sie alle geprüften Handwerksbetriebe im Überblick. Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Betriebe.`;
        faqs.push({
          question: `Wie finde ich einen guten Handwerker in ${locText}?`,
          answer: `Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} qualifizierte Handwerksbetriebe aus ${locText}. Sie können sich die Profile ansehen und direkt Kontakt aufnehmen.`
        });
        faqs.push({
          question: `Welche Handwerksberufe sind in ${locText} vertreten?`,
          answer: `Von der KFZ-Werkstatt über Schreinereien und Dachdecker bis hin zu Elektrikern finden Sie in ${locText} Fachbetriebe für nahezu jedes Gewerk.`
        });
        break;
      case 'Hotels und Unterkünfte':
        introTitle = `Hotels & Unterkünfte in ${locText}`;
        introText = `Planen Sie Ihren Urlaub in ${locText}. Hier finden Sie komfortable Hotels, gemütliche Ferienwohnungen und Pensionen für Ihren Aufenthalt im Sauerland. Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Unterkünfte.`;
        faqs.push({
          question: `Wo kann man in ${locText} am besten übernachten?`,
          answer: `Es gibt eine große Auswahl: Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} verschiedene Unterkünfte in ${locText}, von luxuriösen Hotels bis hin zu familiären Pensionen.`
        });
        break;
      case 'Dienstleistungen':
        introTitle = `Dienstleister in ${locText}`;
        introText = `Von Finanzen über Gesundheit bis hin zu IT-Services: Hier finden Sie ${businessCount} professionelle Dienstleister in ${locText}, die Ihnen mit Rat und Tat zur Seite stehen.`;
        faqs.push({
          question: `Welche Dienstleistungen werden in ${locText} angeboten?`,
          answer: `Das Angebot der ${businessCount} Dienstleister reicht von Beratung und Gesundheit bis hin zu alltäglichen Services wie Friseuren oder Banken.`
        });
        break;
      case 'Einzelhandel':
        introTitle = `Einkaufen & Einzelhandel in ${locText}`;
        introText = `Lokal einkaufen in ${locText}! Entdecken Sie Geschäfte, Boutiquen und Fachmärkte. Unterstützen Sie den lokalen Handel in unserer Region. Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Einzelhandelsgeschäfte.`;
        faqs.push({
          question: `Welche Geschäfte gibt es in ${locText}?`,
          answer: `Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Einzelhandelsgeschäfte aus ${locText}, die ein vielfältiges Sortiment für den täglichen Bedarf und darüber hinaus anbieten.`
        });
        break;
      default:
        introTitle = `${category} in ${locText}`;
        introText = `Finden Sie hier die besten Dienstleister und Geschäfte für den Bereich ${category} in ${locText}. Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Einträge mit allen wichtigen Informationen, Öffnungszeiten und Kontaktdaten.`;
        faqs.push({
          question: `Wie viele Betriebe für ${category} gibt es in ${locText}?`,
          answer: `Im Winterberg-Verzeichnis befinden sich aktuell ${businessCount} Betriebe aus dem Bereich ${category} in ${locText}.`
        });
        
        const handwerkSubcategories: Record<string, {tasks: string, priceInfo: string}> = {
          'Gartenbauer': {
            tasks: 'Pflasterarbeiten, Gartengestaltung, Bepflanzung, Rasenpflege, Terrassenbau und die regelmäßige Instandhaltung von Grünanlagen.',
            priceInfo: 'Der Stundenlohn für Garten- und Landschaftsbauer in der Region (NRW) liegt durchschnittlich zwischen 40 € und 65 €.'
          },
          'Dachdecker': {
            tasks: 'Dacheindeckungen, Flachdachabdichtungen, Dachreparaturen, Einbau von Dachfenstern, Dachrinnenmontage und energetische Dachsanierungen.',
            priceInfo: 'Der Stundenlohn für Dachdecker in der Region (NRW) liegt durchschnittlich zwischen 65 € und 90 €.'
          },
          'Elektriker': {
            tasks: 'Elektroinstallationen, Smart-Home-Einrichtungen, Prüfung von elektrischen Anlagen, Reparaturen, Installation von Wallboxen und Beleuchtungskonzepten.',
            priceInfo: 'Der Stundenlohn für Elektriker in der Region (NRW) liegt durchschnittlich zwischen 55 € und 85 €.'
          },
          'Maler & Lackierer': {
            tasks: 'Tapezierarbeiten, Innen- und Außenanstriche, Lackierarbeiten, Fassadengestaltung, Schimmelbeseitigung und kreative Wandtechniken.',
            priceInfo: 'Der Stundenlohn für Maler und Lackierer in der Region (NRW) liegt durchschnittlich zwischen 45 € und 65 €.'
          },
          'Heizungstechnik': {
            tasks: 'Installation von Heizungsanlagen (z. B. Wärmepumpen, Gas/Öl), Sanitärinstallationen, Wartung, Reparaturen und Badsanierungen.',
            priceInfo: 'Der Stundenlohn für Anlagenmechaniker (SHK) in der Region (NRW) liegt durchschnittlich zwischen 60 € und 90 €.'
          },
          'Bauunternehmen': {
            tasks: 'Rohbauarbeiten, Maurer- und Betonbauerarbeiten, Erdarbeiten, Umbau- und Sanierungsmaßnahmen sowie schlüsselfertiges Bauen.',
            priceInfo: 'Der Stundenlohn im Bauhauptgewerbe in der Region (NRW) liegt durchschnittlich zwischen 55 € und 75 € (je nach Gewerk und Qualifikation).'
          },
          'KFZ-Werkstätten': {
            tasks: 'Inspektionen, Reparaturen aller Art, Reifenwechsel, HU/AU-Vorbereitung, Unfallinstandsetzung und Fehlerspeicherdiagnose.',
            priceInfo: 'Der Stundenverrechnungssatz in freien KFZ-Werkstätten in der Region (NRW) liegt durchschnittlich zwischen 70 € und 120 €.'
          },
          'Schreinereien': {
            tasks: 'Möbel nach Maß, Innenausbau, Fenster- und Türenbau, Reparatur von Holzobjekten und Verlegung von Holzböden.',
            priceInfo: 'Der Stundenlohn für Tischler und Schreiner in der Region (NRW) liegt durchschnittlich zwischen 55 € und 75 €.'
          }
        };

        if (category in handwerkSubcategories) {
          const info = handwerkSubcategories[category];
          faqs.push({
            question: `Was macht ein ${category}?`,
            answer: `Ein ${category} kümmert sich typischerweise um: ${info.tasks} und vieles mehr.`
          });
          faqs.push({
            question: `Was kostet ein ${category}?`,
            answer: `Angebote werden in der Regel individuell erstellt, je nach Aufwand, benötigten Maschinen und dem eingesetzten Material. ${info.priceInfo} Beachten Sie, dass zu den Lohnkosten meist noch Material- und Anfahrtskosten hinzukommen.`
          });
        }
    }
  }

  return { introTitle, introText, faqs };
}
