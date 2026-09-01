import { Business, NewsArticle, AdBanner } from '../types';

/**
 * High-quality Dutch dictionary and phrase mapping for business directories and news in Winterberg.
 */

const SERVICES_DICTIONARY: Record<string, string> = {
  // Retail & Sports
  'schuhe': 'schoenen',
  'schuhverkauf': 'schoenenverkoop',
  'sportschuhe': 'sportschoenen',
  'wanderschuhe': 'wandelschoenen',
  'stiefel': 'laarzen',
  'schuhreparatur': 'schoenreparatie',
  'bekleidung': 'kleding',
  'mode': 'mode',
  'damenmode': 'damesmode',
  'herrenmode': 'herenmode',
  'kindermode': 'kindermode',
  'sportbekleidung': 'sportkleding',
  'outdoor-bekleidung': 'outdoorkleding',
  'outdoor': 'outdoor',
  'winterbekleidung': 'winterkleding',
  'ski-verleih': 'skiverhuur',
  'skiverleih': 'skiverhuur',
  'snowboard-verleih': 'snowboardverhuur',
  'snowboardverleih': 'snowboardverhuur',
  'skiservice': 'skiservice',
  'skipässe': 'skipassen',
  'skischule': 'skischool',
  'fahrradverleih': 'fietsverhuur',
  'e-bike verleih': 'e-bike verhuur',
  'e-bike verkauf': 'e-bike verkoop',
  'fahrradwerkstatt': 'fietsenmaker',
  'souvenirs': 'souvenirs',
  'geschenkartikel': 'cadeauartikelen',
  'lebensmittel': 'levensmiddelen',
  'supermarkt': 'supermarkt',
  'bäckerei': 'bakkerij',
  'frühstück': 'ontbijt',
  'frische brötchen': 'verse broodjes',
  'kaffee & kuchen': 'koffie & gebak',
  'konditorei': 'banketbakkerij',
  'metzgerei': 'slagerij',
  'fleischerei': 'slagerij',
  'fleischwaren': 'vleeswaren',
  'apotheke': 'apotheek',
  'arzneimittel': 'geneesmiddelen',
  'kosmetik': 'cosmetica',
  'parfümerie': 'parfumerie',
  'optiker': 'opticien',
  'sehtest': 'oogmeting',
  'brillen': 'brillen',
  'schmuck': 'sieraden',
  'uhren': 'horloges',
  'elektronik': 'elektronica',
  'computer & it': 'computer & it',
  'handy-reparatur': 'telefoonreparatie',

  // Gastronomy & Accommodation
  'restaurant': 'restaurant',
  'speisen & getränke': 'eten & drinken',
  'regionale küche': 'regionale keuken',
  'gutbürgerliche küche': 'traditionele keuken',
  'biergarten': 'biertuin',
  'terrasse': 'terras',
  'hausbrauerei': 'huisbrouwerij',
  'frisch gezapftes bier': 'vers getapt bier',
  'pizza & pasta': 'pizza & pasta',
  'hotel': 'hotel',
  'übernachtung': 'overnachting',
  'unterkunft': 'accommodatie',
  'ferienwohnung': 'vakantiewoning',
  'ferienhaus': 'vakantiehuis',
  'zimmervermietung': 'kamerverhuur',
  'wellness': 'wellness',
  'sauna': 'sauna',
  'hallenbad': 'binnenzwembad',
  'schwimmbad': 'zwembad',
  'massage': 'massage',
  'massagen': 'massages',
  'spa': 'spa',

  // Crafts & Trades
  'handwerk': 'ambacht',
  'dachdecker': 'dakdekker',
  'dachdeckerarbeiten': 'dakdekkerswerkzaamheden',
  'dachsanierung': 'dakrenovatie',
  'schieferarbeiten': 'leisteenwerk',
  'flachdach': 'plat dak',
  'bauklempnerei': 'loodgieterswerk',
  'zimmerei': 'timmerbedrijf',
  'holzbau': 'houtbouw',
  'dachstühle': 'dakconstructies',
  'carports': 'carports',
  'elektroinstallation': 'elektrotechnische installatie',
  'elektroservice': 'elektroservice',
  'photovoltaik': 'zonnepanelen & fotovoltaïsche systemen',
  'solaranlagen': 'zonne-energie installaties',
  'stromspeicher': 'thuisbatterijen',
  'wallbox-installation': 'laadpaal installatie',
  'smarthome': 'smart home systemen',
  'heizungsbau': 'verwarmingsinstallatie',
  'heizungswartung': 'verwarmingsonderhoud',
  'wärmepumpen': 'warmtepompen',
  'pelletheizung': 'pelletverwarming',
  'gas- und wasserinstallation': 'gas- en waterinstallatie',
  'badsanierung': 'badkamerrenovatie',
  'barrierefreie bäder': 'toegankelijke badkamers',
  'malerbetrieb': 'schildersbedrijf',
  'malerarbeiten': 'schilderwerk',
  'fassadengestaltung': 'gevelafwerking & renovatie',
  'tapezierarbeiten': 'behangwerk',
  'bodenbeläge': 'vloerbedekking & laminaat',
  'fliesenleger': 'tegelzetter',
  'fliesenverlegung': 'tegelwerk',
  'tischlerei': 'meubelmakerij & schrijnwerkerij',
  'schreinerei': 'schrijnwerkerij',
  'möbel nach maß': 'maatwerk meubels',
  'fenster & türen': 'ramen & deuren',
  'metallbau': 'metaalbewerking',
  'schlosserei': 'slotenmakerij & metaalconstructie',
  'tore & zäune': 'poorten & hekwerk',
  'baugewerbe': 'bouwbedrijf',
  'neubau': 'nieuwbouw',
  'umbau': 'verbouwing',
  'sanierung': 'renovatie & modernisering',
  'tiefbau': 'grond- en wegenbouw',
  'pflasterarbeiten': 'bestrating',
  'garten- und landschaftsbau': 'tuin- en landschapsverzorging',
  'gartenpflege': 'tuinonderhoud',
  'baumfällung': 'bomen kappen',
  'winterdienst': 'winterdienst & sneeuwruimen',

  // Services & Health
  'kfz-werkstatt': 'autogarage',
  'kfz-reparatur': 'autoreparatie',
  'hauptuntersuchung (tüv)': 'periodieke voertuiginspectie (apk/tüv)',
  'inspektion': 'onderhoudsbeurt',
  'ölwechsel': 'olieverversing',
  'reifenservice': 'bandenservice',
  'reifenwechsel': 'bandenwissel',
  'klimaservice': 'aircoservice',
  'unfallinstandsetzung': 'schadeherstel',
  'lackierung': 'autospuiterij',
  'autovermietung': 'autoverhuur',
  'abschleppdienst': 'sleepdienst',
  'physiotherapie': 'fysiotherapie',
  'krankengymnastik': 'fysiotherapeutische oefeningen',
  'osteopathie': 'osteopathie',
  'manuelle therapie': 'manuele therapie',
  'lymphdrainage': 'lymfedrainage',
  'ergotherapie': 'ergotherapie',
  'logopädie': 'logopedie',
  'zahnarzt': 'tandarts',
  'hausarzt': 'huisarts',
  'tierarzt': 'dierenarts',
  'friseur': 'kapper',
  'haarschnitt': 'knippen & stylen',
  'haarverlängerung': 'haarextensions',
  'kosmetikstudio': 'schoonheidssalon',
  'fußpflege': 'pedicure',
  'nagelstudio': 'nagelsalon',
  'fitnessstudio': 'sportschool',
  'personal training': 'personal training',
  'steuerberater': 'belastingadviseur',
  'steuerberatung': 'belastingadvies',
  'finanzbuchhaltung': 'financiële administratie',
  'lohnsteuer': 'loonbelasting',
  'jahresabschluss': 'jaarrekening',
  'rechtsanwalt': 'advocaat',
  'rechtsberatung': 'juridisch advies',
  'notar': 'notaris',
  'immobilienmakler': 'makelaar',
  'immobilienverkauf': 'verkoop van vastgoed',
  'immobilienvermietung': 'verhuur van vastgoed',
  'werbeagentur': 'reclamebureau',
  'webdesign': 'webdesign',
  'seo-optimierung': 'seo optimalisatie',
  'drucksachen': 'drukwerk',
  'fotograf': 'fotograaf',
  'eventlocation': 'evenementenlocatie',
  'reinigungsservice': 'schoonmaakdienst',
  'gebäudereinigung': 'gebouwenreiniging',
  'fensterreinigung': 'glazenwasserij',
};

const PHRASE_REPLACEMENTS: [RegExp, string][] = [
  // Greetings and introductions
  [/Herzlich willkommen bei/gi, 'Van harte welkom bij'],
  [/Herzlich willkommen im/gi, 'Van harte welkom in'],
  [/Herzlich willkommen in der/gi, 'Van harte welkom in de'],
  [/Willkommen bei/gi, 'Welkom bij'],
  [/Willkommen im/gi, 'Welkom in'],
  [/Willkommen in der/gi, 'Welkom in de'],
  [/Ihr zuverlässiger Partner für/gi, 'Uw betrouwbare partner voor'],
  [/Ihr Spezialist für/gi, 'Uw specialist voor'],
  [/Ihr Experte für/gi, 'Uw expert voor'],
  [/Ihr Fachbetrieb für/gi, 'Uw vakbedrijf voor'],
  [/Ihr Meisterbetrieb für/gi, 'Uw erkend meesterbedrijf voor'],
  [/Ihr Ansprechpartner für/gi, 'Uw aanspreekpunt voor'],
  [/Ihre erste Adresse für/gi, 'Uw eerste adres voor'],
  [/Tradition und Qualität seit/gi, 'Traditie en kwaliteit sinds'],
  [/Seit über (\d+) Jahren/gi, 'Al meer dan $1 jaar'],
  [/Seit vielen Jahren/gi, 'Al vele jaren'],
  [/Familienbetrieb in der (\d+)\. Generation/gi, 'Familiebedrijf in de $1e generatie'],
  [/Familienunternehmen/gi, 'familiebedrijf'],
  [/Familienbetrieb/gi, 'familiebedrijf'],
  
  // Offerings & Services
  [/Wir bieten Ihnen/gi, 'Wij bieden u'],
  [/Wir bieten/gi, 'Wij bieden'],
  [/Wir stehen für/gi, 'Wij staan voor'],
  [/Wir legen großen Wert auf/gi, 'Wij hechten veel waarde aan'],
  [/Unser Angebot umfasst/gi, 'Ons aanbod omvat'],
  [/Unser Leistungsspektrum/gi, 'Ons dienstenpakket'],
  [/Unsere Leistungen/gi, 'Onze diensten'],
  [/Unsere Angebote/gi, 'Onze aanbiedingen'],
  [/Unser Team/gi, 'Ons team'],
  [/Unsere Mitarbeiter/gi, 'Onze medewerkers'],
  [/in Winterberg und Umgebung/gi, 'in Winterberg en omgeving'],
  [/in Winterberg und im Sauerland/gi, 'in Winterberg en het Sauerland'],
  [/im Herzen von Winterberg/gi, 'in het hart van Winterberg'],
  [/direkt am Skilift/gi, 'direct bij de skilift'],
  [/direkt an der Piste/gi, 'direct aan de skipiste'],
  [/in ruhiger Lage/gi, 'op een rustige locatie'],
  [/zentral gelegen/gi, 'centraal gelegen'],
  [/für die ganze Familie/gi, 'voor het hele gezin'],
  [/Große Auswahl an/gi, 'Grote keuze aan'],
  [/große Auswahl an/gi, 'grote keuze aan'],
  [/große Auswahl/gi, 'ruime keuze'],
  [/Beste Qualität/gi, 'Beste kwaliteit'],
  [/höchste Qualität/gi, 'hoogste kwaliteit'],
  [/fachgerechte Beratung/gi, 'deskundig advies'],
  [/kompetente Beratung/gi, 'deskundig advies'],
  [/persönliche Beratung/gi, 'persoonlijk advies'],
  [/individuelle Beratung/gi, 'persoonlijk advies'],
  [/schnelle und zuverlässige Ausführung/gi, 'snelle en betrouwbare uitvoering'],
  [/zu fairen Preisen/gi, 'tegen eerlijke prijzen'],
  [/faire Preise/gi, 'eerlijke prijzen'],
  [/Besuchen Sie uns/gi, 'Bezoek ons'],
  [/Kommen Sie vorbei/gi, 'Kom gezellig langs'],
  [/Wir freuen uns auf Ihren Besuch/gi, 'Wij kijken uit naar uw bezoek'],
  [/Wir freuen uns auf Sie/gi, 'Wij heten u van harte welkom'],
  [/Kontaktieren Sie uns gerne/gi, 'Neem gerust contact met ons op'],
  [/Rufen Sie uns an/gi, 'Bel ons gerust'],
  [/Vereinbaren Sie einen Termin/gi, 'Maak een afspraak'],
  [/Kostenlose Beratung/gi, 'Gratis advies'],
  [/Unverbindliches Angebot/gi, 'Vrijblijvende offerte'],
  
  // Specific domains & Gas Stations / Shops
  [/24\/7 geöffnet/gi, '24/7 geopend'],
  [/Rund um die Uhr geöffnet/gi, '24 uur per dag geopend'],
  [/Sitzplätze im Freien/gi, 'Zitplaatsen buiten'],
  [/Hunde sind erlaubt/gi, 'Honden zijn toegestaan'],
  [/Hunde erlaubt/gi, 'Honden toegestaan'],
  [/Live-Veranstaltungen/gi, 'Live-evenementen'],
  [/Tanzen und Quizabenden/gi, 'dansen en quizavonden'],
  [/Beliebter Treffpunkt/gi, 'Populaire ontmoetingsplek'],
  [/Beliebte Kneipe/gi, 'Populair café'],
  [/traditioneller Einrichtung/gi, 'traditionele inrichting'],
  [/irischen Bieren vom Fass/gi, 'Ierse bieren van de tap'],
  [/auf Großbildleinwand/gi, 'op groot scherm'],
  [/KFZ-Reparaturen aller Art/gi, 'alle soorten autoreparaties'],
  [/Ihre freundliche Autofachwerkstatt/gi, 'Uw vriendelijke gespecialiseerde autogarage'],
  [/Schnell, Preiswert & Zuverlässig/gi, 'Snel, voordelig & betrouwbaar'],
  [/Frische Backwaren/gi, 'Verse bakkerijproducten'],
  [/Täglich frische Brötchen/gi, 'Dagelijks verse broodjes'],
  [/Großes Frühstücksangebot/gi, 'Uitgebreid ontbijtaanbod'],
  [/Hausgemachte Kuchen und Torten/gi, 'Huisgemaakt gebak en taarten'],
  [/Moderne Zimmer/gi, 'Moderne kamers'],
  [/Gemütliche Ferienwohnungen/gi, 'Gezellige vakantiewoningen'],
  [/Reichhaltiges Frühstücksbuffet/gi, 'Rijk gevarieerd ontbijtbuffet'],
  [/Erholung und Entspannung/gi, 'Rust en ontspanning'],
  [/Sport- und Freizeitangebote/gi, 'Sport- en recreatieaanbod'],
  [/Hochwertige Ausrüstung/gi, 'Hoogwaardige uitrusting'],
  [/Verleih von Skiern und Snowboards/gi, 'Verhuur van ski’s en snowboards'],
  [/Modernste Maschinen und Werkzeuge/gi, 'Moderne machines en gereedschappen'],
  [/Sämtliche Arbeiten rund um/gi, 'Alle werkzaamheden rondom'],
  [/Von der Planung bis zur Fertigstellung/gi, 'Van ontwerp tot oplevering'],
  [/Alles aus einer Hand/gi, 'Alles onder één dak'],
  [/Meisterhafte Handwerksarbeit/gi, 'Vakmanschap van het hoogste niveau'],
  [/Zuverlässiger Notdienst/gi, 'Betrouwbare spoeddienst'],
  [/24h Notdienst/gi, '24/7 pech- en spoeddienst'],
  [/Kostenlose Parkplätze/gi, 'Gratis parkeergelegenheid'],
  [/Kostenfreies WLAN/gi, 'Gratis wifi'],
  [/Barrierefreier Zugang/gi, 'Rolstoeltoegankelijk'],
  [/Hundefreundlich/gi, 'Hondvriendelijk'],

  // News specific phrases
  [/Winterberg legt bei Übernachtungen deutlich zu/gi, 'Winterberg stijgt aanzienlijk in aantal overnachtingen'],
  [/Plus von ([\d,]+) Prozent bis Juni/gi, 'Plus van $1 procent tot juni'],
  [/SauerlandRundfahrt macht Winterberg zum Ziel der Königsetappe/gi, 'SauerlandRundfahrt maakt van Winterberg finish van de koninginnenrit'],
  [/Das Rennen zählt seit dieser Saison zum internationalen UCI-Kalender/gi, 'De wielerwedstrijd maakt vanaf dit seizoen deel uit van de internationale UCI-kalender'],
  [/und endet am 6\. September 2026 auf 841 Metern Höhe \/ Helfer gesucht/gi, 'en finisht op 6 september 2026 op 841 meter hoogte / Vrijwilligers gezocht'],
  [/Raum für neue Ideen: Freistehende Ladenlokale & Gewerbeflächen/gi, 'Ruimte voor nieuwe ideeën: Beschikbare winkelpanden & bedrijfsruimtes'],
  [/Zielort mit Gewicht/gi, 'Een finishplaats van formaat'],
  [/Aufnahme in den UCI-Kalender/gi, 'Opname in de UCI-kalender'],
  [/Was das Rennen der Region bringt/gi, 'Wat de wedstrijd de regio brengt'],
  [/Etappenübersicht 2026/gi, 'Etappeoverzicht 2026'],
  [/Jedermannrennen am Finaltag/gi, 'Toertocht voor recreanten op de finaledag'],
  [/Helfer gesucht/gi, 'Vrijwilligers gezocht'],
  [/Hinweise für Anwohnerinnen und Anwohner/gi, 'Informatie voor omwonenden'],
  [/Januar und Mai treiben das Wachstum/gi, 'Januari en mei stuwen de groei'],
  [/Positive Entwicklung über Winter und Sommer hinweg/gi, 'Positieve ontwikkeling over winter en zomer heen'],
  [/Ansprechpartner & Beratung/gi, 'Contactpersoon & Advies'],
  [/Pressemitteilung/gi, 'Persbericht'],
  [/Symbolbild · KI-generiert/gi, 'Symboolafbeelding · AI-gegenereerd'],
  [/Symbolbild · KI/gi, 'Symboolafbeelding · AI'],
  [/Quelle:/gi, 'Bron:'],
];

const VOCABULARY_REPLACEMENTS: [RegExp, string][] = [
  // Words & Common Terms
  [/\bUnternehmen\b/gi, 'bedrijf'],
  [/\bBetrieb\b/gi, 'bedrijf'],
  [/\bBetriebe\b/gi, 'bedrijven'],
  [/\bKunden\b/gi, 'klanten'],
  [/\bKundinnen und Kunden\b/gi, 'klanten'],
  [/\bGäste\b/gi, 'gasten'],
  [/\bBesucher\b/gi, 'bezoekers'],
  [/\bAngebot\b/gi, 'aanbod'],
  [/\bAngebote\b/gi, 'aanbiedingen'],
  [/\bLeistungen\b/gi, 'diensten'],
  [/\bProdukte\b/gi, 'producten'],
  [/\bQualität\b/gi, 'kwaliteit'],
  [/\bErfahrung\b/gi, 'ervaring'],
  [/\bBeratung\b/gi, 'advies'],
  [/\bService\b/gi, 'service'],
  [/\bAuswahl\b/gi, 'selectie'],
  [/\bVielfalt\b/gi, 'veelzijdigheid'],
  [/\bÖffnungszeiten\b/gi, 'openingstijden'],
  [/\bAdresse\b/gi, 'adres'],
  [/\bKontakt\b/gi, 'contact'],
  [/\bTelefon\b/gi, 'telefoon'],
  [/\bOrtsteil\b/gi, 'dorp / wijk'],
  [/\bOrtsteile\b/gi, 'dorpen & wijken'],
  [/\bKernstadt\b/gi, 'stadscentrum'],
  [/\bSchuhe\b/gi, 'schoenen'],
  [/\bStiefel\b/gi, 'laarzen'],
  [/\bBekleidung\b/gi, 'kleding'],
  [/\bFrühstück\b/gi, 'ontbijt'],
  [/\bZimmer\b/gi, 'kamers'],
  [/\bFerienwohnung\b/gi, 'vakantiewoning'],
  [/\bFerienwohnungen\b/gi, 'vakantiewoningen'],
  [/\bFerienhaus\b/gi, 'vakantiehuis'],
  [/\bFerienhäuser\b/gi, 'vakantiehuizen'],
  [/\bWerkstatt\b/gi, 'werkplaats'],
  [/\bReparatur\b/gi, 'reparatie'],
  [/\bReparaturen\b/gi, 'reparaties'],
  [/\bWartung\b/gi, 'onderhoud'],
  [/\bMontage\b/gi, 'montage'],
  [/\bInstallation\b/gi, 'installatie'],
  [/\bRenovierung\b/gi, 'renovatie'],
  [/\bSanierung\b/gi, 'renovatie'],
  [/\bHandwerker\b/gi, 'vakmensen'],
  [/\bSpezialist\b/gi, 'specialist'],
  [/\bSpezialisten\b/gi, 'specialisten'],
  [/\bMeisterbetrieb\b/gi, 'erkend vakbedrijf'],
  [/\bPartner\b/gi, 'partner'],
  [/\bTankstelle\b/gi, 'tankstation'],
  [/\bTankstellen\b/gi, 'tankstations'],
  [/\bKraftstoffen\b/gi, 'brandstoffen'],
  [/\bKraftstoffe\b/gi, 'brandstoffen'],
  [/\binklusive\b/gi, 'inclusief'],
  [/\bWaschanlage\b/gi, 'wasstraat'],
  [/\bKaffeespezialitäten\b/gi, 'koffiespecialiteiten'],
  [/\bSnacks\b/gi, 'snacks'],
  [/\bKneipe\b/gi, 'café'],
  [/\bGastrokneipe\b/gi, 'eetcafé'],
  [/\bCocktailbar\b/gi, 'cocktailbar'],
  [/\bÜbernachtungen\b/gi, 'overnachtingen'],
  [/\bÜbernachtung\b/gi, 'overnachting'],
  [/\bTourismus\b/gi, 'toerisme'],
  [/\bEntwicklung\b/gi, 'ontwikkeling'],
  [/\bSommersaison\b/gi, 'zomerseizoen'],
  [/\bWintersaison\b/gi, 'winterseizoen'],
  [/\bEtappe\b/gi, 'etappe'],
  [/\bEtappen\b/gi, 'etappes'],
  [/\bRundfahrt\b/gi, 'ronde'],
  [/\bRadrennen\b/gi, 'wielerwedstrijd'],
  [/\bEinzelzeitfahren\b/gi, 'individuele tijdrit'],
  [/\bBergzeitfahren\b/gi, 'klimtijdrit'],
  [/\bKönigsetappe\b/gi, 'koninginnenrit'],
  [/\bStrecke\b/gi, 'parcours'],
  [/\bStrecken\b/gi, 'trajecten'],
  [/\bStreckenposten\b/gi, 'baancommissarissen'],
  [/\bHelfer\b/gi, 'vrijwilligers'],
  [/\bAnwohner\b/gi, 'omwonenden'],
  [/\bAnwohnerinnen\b/gi, 'omwonenden'],
  [/\bSperrung\b/gi, 'afsluiting'],
  [/\bAbsperrung\b/gi, 'afzetting'],
  [/\bZielankunft\b/gi, 'finish'],
  [/\bStartzeiten\b/gi, 'starttijden'],
  [/\bRahmenprogramm\b/gi, 'omlijstend programma'],
  
  // Adjectives
  [/\bgroß\b/gi, 'groot'],
  [/\bgroße\b/gi, 'grote'],
  [/\bgroßes\b/gi, 'groot'],
  [/\bgroßen\b/gi, 'grote'],
  [/\bmodern\b/gi, 'modern'],
  [/\bmoderne\b/gi, 'moderne'],
  [/\bmodernes\b/gi, 'modern'],
  [/\bmodernen\b/gi, 'moderne'],
  [/\bgemütlich\b/gi, 'gezellig'],
  [/\bgemütliche\b/gi, 'gezellige'],
  [/\bgemütliches\b/gi, 'gezellig'],
  [/\btraditionell\b/gi, 'traditioneel'],
  [/\btraditionelle\b/gi, 'traditionele'],
  [/\bfreundlich\b/gi, 'vriendelijk'],
  [/\bfreundliche\b/gi, 'vriendelijke'],
  [/\bfreundliches\b/gi, 'vriendelijk'],
  [/\bprofessionell\b/gi, 'professioneel'],
  [/\bprofessionelle\b/gi, 'professionele'],
  [/\bzuverlässig\b/gi, 'betrouwbaar'],
  [/\bzuverlässige\b/gi, 'betrouwbare'],
  [/\bschnell\b/gi, 'snel'],
  [/\bschnelle\b/gi, 'snelle'],
  [/\beinfach\b/gi, 'eenvoudig'],
  [/\bkostenlos\b/gi, 'gratis'],
  [/\bkostenlose\b/gi, 'gratis'],
  [/\bherzlich\b/gi, 'hartelijk'],
  [/\bfrisch\b/gi, 'vers'],
  [/\bfrische\b/gi, 'verse'],
  [/\bfrischen\b/gi, 'verse'],
  [/\bregional\b/gi, 'regionaal'],
  [/\bregionale\b/gi, 'regionale'],
  [/\bperfekt\b/gi, 'perfect'],
  [/\bperfekte\b/gi, 'perfecte'],
  [/\bgeöffnet\b/gi, 'geopend'],
  [/\bgeschlossen\b/gi, 'gesloten'],
  [/\bbeliebt\b/gi, 'populair'],
  [/\bbeliebte\b/gi, 'populaire'],
  [/\bbeliebter\b/gi, 'populair'],
  [/\bpreiswert\b/gi, 'voordelig'],

  // Connectors & Common German Grammar Words
  [/\bDein\b/g, 'Jouw'],
  [/\bdein\b/g, 'jouw'],
  [/\bDeine\b/g, 'Jouw'],
  [/\bdeine\b/g, 'jouw'],
  [/\bIhr\b/g, 'Uw'],
  [/\bihr\b/g, 'uw'],
  [/\bIhre\b/g, 'Uw'],
  [/\bihre\b/g, 'haar'],
  [/\bIhrem\b/g, 'uw'],
  [/\bihrem\b/g, 'hun'],
  [/\bIhren\b/g, 'uw'],
  [/\bihren\b/g, 'hun'],
  [/\bUnser\b/g, 'Ons'],
  [/\bunser\b/g, 'ons'],
  [/\bUnsere\b/g, 'Onze'],
  [/\bunsere\b/g, 'onze'],
  [/\bWir\b/g, 'Wij'],
  [/\bwir\b/g, 'wij'],
  [/\bSie\b/g, 'U'],
  [/\bsie\b/g, 'ze'],
  [/\bIch\b/g, 'Ik'],
  [/\bich\b/g, 'ik'],
  [/\bund\b/g, 'en'],
  [/\boder\b/g, 'of'],
  [/\bmit\b/g, 'met'],
  [/\bfür\b/g, 'voor'],
  [/\bvon\b/g, 'van'],
  [/\bbei\b/g, 'bij'],
  [/\bim\b/g, 'in het'],
  [/\bin der\b/g, 'in de'],
  [/\bin den\b/g, 'in de'],
  [/\bam\b/g, 'aan de'],
  [/\bauf\b/g, 'op'],
  [/\baus\b/g, 'uit'],
  [/\bdurch\b/g, 'door'],
  [/\bnach\b/g, 'naar'],
  [/\büber\b/g, 'over'],
  [/\bunter\b/g, 'onder'],
  [/\bohne\b/g, 'zonder'],
  [/\bzwischen\b/g, 'tussen'],
  [/\bseit\b/g, 'sinds'],
  [/\bbis\b/g, 'tot'],
  [/\bauch\b/g, 'ook'],
  [/\bnicht\b/g, 'niet'],
  [/\bnur\b/g, 'slechts'],
  [/\bsehr\b/g, 'zeer'],
  [/\bmehr\b/g, 'meer'],
  [/\balle\b/g, 'alle'],
  [/\bviele\b/g, 'vele'],
  [/\bsind\b/g, 'zijn'],
  [/\bist\b/g, 'is'],
  [/\bhaben\b/g, 'hebben'],
  [/\bhat\b/g, 'heeft'],
  [/\bwerden\b/g, 'worden'],
  [/\bwird\b/g, 'wordt'],
  [/\bkönnen\b/g, 'kunnen'],
  [/\bkann\b/g, 'kan'],
  [/\bbieten\b/g, 'bieden'],
  [/\bbietet\b/g, 'biedt'],
  [/\bfindet\b/g, 'vindt plaats'],
  [/\bfinden\b/g, 'vinden'],
  [/\bzeigen\b/g, 'tonen'],
  [/\bzeigt\b/g, 'toont'],
  [/\bjetzt\b/g, 'nu'],
  [/\bheute\b/g, 'vandaag'],
  [/\bmorgen\b/g, 'morgen'],
  [/\bimmer\b/g, 'altijd'],
  [/\bdirekt\b/g, 'direct'],
  [/\bweiterhin\b/g, 'nog steeds'],
  [/\büberall\b/g, 'overal'],
  [/\bgemeinsam\b/g, 'samen'],
];

/**
 * Translates a single service or keyword into Dutch.
 */
export function translateServiceToDutch(service: string): string {
  if (!service) return '';
  const trimmed = service.trim();
  const lower = trimmed.toLowerCase();

  if (SERVICES_DICTIONARY[lower]) {
    const match = SERVICES_DICTIONARY[lower];
    return match.charAt(0).toUpperCase() + match.slice(1);
  }

  for (const [key, translation] of Object.entries(SERVICES_DICTIONARY)) {
    if (lower.includes(key)) {
      const replaced = lower.replace(new RegExp(key, 'gi'), translation);
      return replaced.charAt(0).toUpperCase() + replaced.slice(1);
    }
  }

  return trimmed;
}

/**
 * Translates a German business or news text (description, Markdown content) into fluent Dutch.
 */
export function translateTextToDutch(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let translated = text;

  // 1. High-priority full phrase matches
  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    translated = translated.replace(pattern, replacement);
  }

  // 2. Vocabulary & keyword substitutions
  for (const [pattern, replacement] of VOCABULARY_REPLACEMENTS) {
    translated = translated.replace(pattern, replacement);
  }

  return translated;
}

/**
 * Localizes a NewsArticle for the given language.
 */
export function getLocalizedNewsArticle(article: NewsArticle, lang: 'de' | 'nl'): NewsArticle {
  if (!article) return article;
  if (lang === 'de') return article;

  return {
    ...article,
    title: translateTextToDutch(article.title),
    content: translateTextToDutch(article.content),
    imageSource: article.imageSource ? translateTextToDutch(article.imageSource) : undefined,
  };
}

/**
 * Returns the localized business details based on the current language.
 * Prefers manual translations saved in the business object, falling back to real-time auto-translation.
 */
export function getLocalizedBusiness(business: Business, lang: 'de' | 'nl'): {
  description: string;
  extendedDescription?: string;
  services: string[];
  products: string[];
} {
  if (!business) {
    return { description: '', services: [], products: [] };
  }

  if (lang === 'de') {
    return {
      description: business.description || '',
      extendedDescription: business.extendedDescription || '',
      services: business.services || [],
      products: business.products || [],
    };
  }

  // Language is NL: Check if manual Dutch translation is present
  const customNl = business.translations?.nl;
  const customDesc = customNl?.description || business.description_nl;
  const customExtended = customNl?.extendedDescription || business.extendedDescription_nl;
  const customServices = customNl?.services || business.services_nl;
  const customProducts = customNl?.products || business.products_nl;

  const description = (customDesc && customDesc.trim().length > 0)
    ? customDesc
    : translateTextToDutch(business.description || '');

  const extendedDescription = (customExtended && customExtended.trim().length > 0)
    ? customExtended
    : (business.extendedDescription ? translateTextToDutch(business.extendedDescription) : undefined);

  let services: string[] = [];
  if (customServices && customServices.length > 0) {
    services = customServices;
  } else if (business.services && business.services.length > 0) {
    services = business.services.map(s => translateServiceToDutch(s));
  }

  let products: string[] = [];
  if (customProducts && customProducts.length > 0) {
    products = customProducts;
  } else if (business.products && business.products.length > 0) {
    products = business.products.map(p => translateServiceToDutch(p));
  }

  return {
    description,
    extendedDescription,
    services,
    products,
  };
}

/**
 * Returns the localized ad banner details based on the current language.
 * Prefers manual translations saved in the ad object, falling back to real-time auto-translation.
 */
export function getLocalizedAdBanner(ad?: AdBanner | null, lang: 'de' | 'nl' = 'de'): {
  title: string;
  badgeText: string;
  ctaText: string;
  imageUrl: string;
} {
  if (!ad) {
    return { title: '', badgeText: 'Anzeige', ctaText: 'Mehr erfahren', imageUrl: '' };
  }

  if (lang === 'de') {
    return {
      title: ad.title || '',
      badgeText: ad.badgeText || 'Anzeige',
      ctaText: ad.ctaText || 'Mehr erfahren',
      imageUrl: ad.imageUrl || '',
    };
  }

  // Language is NL: Check if manual Dutch translation is present, else auto-translate
  const customTitle = ad.title_nl;
  const customBadge = ad.badgeText_nl;
  const customCta = ad.ctaText_nl;
  const customImage = ad.imageUrl_nl;

  const title = (customTitle && customTitle.trim().length > 0)
    ? customTitle.trim()
    : translateTextToDutch(ad.title || '');

  let defaultBadge = 'Advertentie';
  if (ad.badgeText === 'Werbung') defaultBadge = 'Reclame';
  else if (ad.badgeText === 'Sponsor' || ad.badgeText === 'Gesponsert') defaultBadge = 'Gesponsord';
  else if (ad.badgeText && ad.badgeText !== 'Anzeige') defaultBadge = translateTextToDutch(ad.badgeText);

  const badgeText = (customBadge && customBadge.trim().length > 0)
    ? customBadge.trim()
    : defaultBadge;

  const ctaText = (customCta && customCta.trim().length > 0)
    ? customCta.trim()
    : (ad.ctaText ? translateTextToDutch(ad.ctaText) : 'Meer informatie');

  const imageUrl = (customImage && customImage.trim().length > 0)
    ? customImage.trim()
    : (ad.imageUrl || '');

  return {
    title,
    badgeText,
    ctaText,
    imageUrl,
  };
}
