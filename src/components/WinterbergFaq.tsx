import React, { useState, useMemo } from 'react';
import { ThemeConfig } from '../types';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  Utensils, 
  Snowflake, 
  Compass, 
  ShoppingBag, 
  Car, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export type FaqCategoryKey = 'Essen & Trinken' | 'Wintersport & Schnee' | 'Freizeit & Natur' | 'Einkaufen & Shopping' | 'Anreise & Parken';

export interface FaqLocalizedContent {
  question: string;
  quickSummary: string;
  answerHtml: React.ReactNode;
  plainAnswer: string;
  relatedCategoryLinks?: {
    label: string;
    category: string;
    subcategory?: string;
  }[];
}

export interface FaqItem {
  id: string;
  categoryGroup: FaqCategoryKey;
  de: FaqLocalizedContent;
  nl: FaqLocalizedContent;
}

export const FAQ_DATA: FaqItem[] = [
  // ── 1. Wat te doen / Was kann man machen (Google Autosuggest Core) ──
  {
    id: 'wat-te-doen-in-winterberg',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Was kann man in Winterberg machen?',
      quickSummary: 'Winterberg bietet zu jeder Jahreszeit erstklassige Erlebnisse: Im Winter das Skiliftkarussell und Rodelhänge, im Frühling und Sommer den Erlebnisberg Kappe (Bikepark, Sommerrodelbahn, Panorama Brücke), traumhafte Wanderwege wie den Rothaarsteig, Wassersport am Hillebachsee sowie eine lebendige Gastronomie.',
      plainAnswer: 'Winterberg ist ganzjährig ein Erlebnis: Im Winter locken 27,5 Pistenkilometer im Skiliftkarussell und beleuchtete Rodelhänge. Im Sommer begeistern der Erlebnisberg Kappe mit Bikepark, Sommerrodelbahn und Kletterwald, der Aussichtspunkt Kahler Asten, Wasserski am Hillebachsee sowie das vielseitige Shopping- und Gastronomieangebot.',
      answerHtml: (
        <div className="space-y-3">
          <p>Winterberg ist das führende Ganzjahres-Reiseziel im Sauerland mit abwechslungsreichen Aktivitäten für jede Jahreszeit:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Wintersport (Dezember bis März):</strong> 27,5 km Skipisten im <em>Skiliftkarussell Winterberg</em>, Flutlicht-Skifahren, Rodellifte am Bremberg und Herrloh sowie 150 km gespurte Loipen.</li>
            <li><strong>Action & Outdoor am Erlebnisberg Kappe:</strong> Der <em>Bikepark Winterberg</em> (einer der bekanntesten Downhill-Parks Europas), die <em>Panorama Erlebnis Brücke</em> mit Kletterelementen, <em>Fly-Line</em>, <em>Sommerrodelbahn</em> und der <em>Kletterwald</em>.</li>
            <li><strong>Wandern & Natur:</strong> Panoramablick auf dem <em>Kahlen Asten (841 m)</em> mit Astenturm, Premiumwanderwege auf dem <em>Rothaarsteig</em>, die urwüchsige <em>Schlucht im Helletal</em> und die <em>Hochheide Niedersfeld</em>.</li>
            <li><strong>Baden, Wassersport & Entspannung:</strong> Wasserski, Wakeboarden und Baden am <em>Hillebachsee Niedersfeld</em> oder Entspannung im Hallenbad & Saunabereich des <em>Oversum Vital Resorts</em>.</li>
            <li><strong>Essen, Trinken & Ausgehen:</strong> Gemütliche Hütten, urige Sauerländer Gasthäuser, trendige Cafés an der Flaniermeile Am Waltenberg und legendäres Après-Ski.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Freizeitanbieter am Erlebnisberg Kappe', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
        { label: 'Gastronomie & Restaurants', category: 'Gastronomie' }
      ]
    },
    nl: {
      question: 'Wat te doen in Winterberg?',
      quickSummary: 'Winterberg is het hele jaar door de populairste bestemming in het Sauerland: In de winter skiën en rodelen in het Skiliftkarussell, en in het voorjaar en de zomer volop actie op de Erlebnisberg Kappe (Bikepark, zomerrodelbaan, panoramabrug), wandelen op de Kahler Asten en watersporten op de Hillebachsee.',
      plainAnswer: 'In Winterberg is altijd wat te doen: In de winter 27,5 km skipistes en verlichte rodelhellingen. In de zomer de Erlebnisberg Kappe met bikepark, zomerrodelbaan en klimbos, het uitzichtpunt Kahler Asten (841 m), waterskiën op de Hillebachsee en gezellige winkels en restaurants.',
      answerHtml: (
        <div className="space-y-3">
          <p>Winterberg is zowel in de zomer als winter een ideale bestemming op slechts enkele uren rijden van Nederland en België:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Wintersport (december t/m maart):</strong> 27,5 km pistes in de <em>Skiliftkarussell Winterberg</em>, avondskiën onder kunstlicht, rodelbanen met transportbanden en 150 km langlaufloipes.</li>
            <li><strong>Erlebnisberg Kappe (voorjaar t/m herfst):</strong> Het beroemde <em>Bikepark Winterberg</em> voor mountainbikers, de <em>Panorama Belevenisbrug</em>, de <em>zomerrodelbaan</em>, de <em>Fly-Line</em> door de bomen en het <em>Klimbos (Kletterwald)</em>.</li>
            <li><strong>Wandelen & Natuur:</strong> Schitterend uitzicht vanaf de <em>Kahler Asten (841 m)</em> met de Astentoren, wandelroutes over de <em>Rothaarsteig</em>, de ongerepte <em>Helletal-kloof</em> en de <em>Hoogheide bij Niedersfeld</em>.</li>
            <li><strong>Zwemmen & Watersport:</strong> Waterskiën, wakeboarden en zwemmen bij de <em>Hillebachsee</em> in Niedersfeld of ontspannen in het zwemparadijs en de sauna van <em>Oversum Vital Resort</em>.</li>
            <li><strong>Gezelligheid & Terrassen:</strong> Gezellig lunchen, dineren en borrelen aan de wandelpromenade <em>Am Waltenberg</em> of genieten van een drankje in de almhutten.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Vrijetijdsactiviteiten Erlebnisberg Kappe', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
        { label: 'Restaurants & Horeca', category: 'Gastronomie' }
      ]
    }
  },

  // ── 2. Wat te doen in de zomer (Google Autosuggest) ──
  {
    id: 'wat-te-doen-in-de-zomer',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Was kann man im Sommer in Winterberg machen?',
      quickSummary: 'Im Sommer verwandelt sich Winterberg in ein Outdoor-Mekka: Bikepark Winterberg, Sommerrodelbahn, Panorama Erlebnis Brücke, Kletterwald, das beheizte Freibad Siedlinghausen, Wasserski am Hillebachsee, Wandern auf dem Kahlen Asten sowie sommerliche Biergärten und Sonnenterrassen.',
      plainAnswer: 'Im Sommer locken der Erlebnisberg Kappe (Bikepark, Sommerrodelbahn, Kletterwald, Fly-Line, Erlebnisbrücke), das beheizte Freibad Siedlinghausen mit Sprungturm und großer Liegewiese, Wassersport und Schwimmen am Hillebachsee Niedersfeld, Bergabenteuer an der Ruhrquelle (Mountaincart), Panoramawanderungen auf dem Rothaarsteig sowie lebendige Straßencafés.',
      answerHtml: (
        <div className="space-y-3">
          <p>Der Sommer in Winterberg bietet eine perfekte Mischung aus Nervenkitzel, Familienausflügen, Badespaß und Naturgenuss:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Erlebnisberg Kappe:</strong> Sommerrodelbahn, <em>Fly-Line</em> (schwebend durch die Baumkronen), <em>Panorama Erlebnis Brücke</em> mit Riesenrutsche und der <em>Kletterwald</em> für Groß und Klein.</li>
            <li><strong>Bikepark Winterberg:</strong> Einer der größten und modernsten Mountainbike- und Downhill-Parks Europas mit Strecken für Anfänger bis Worldcup-Profis.</li>
            <li><strong>Baden im Freibad Siedlinghausen:</strong> Das beliebte beheizte Freibad im Ortsteil Siedlinghausen bietet ein 25-Meter-Sportbecken, Sprunganlage, Nichtschwimmerbereich und eine sonnige Liegewiese – ideal für warme Sommertage.</li>
            <li><strong>Hillebachsee Niedersfeld:</strong> Wasserski- und Wakeboardanlage, Badestrand, Beachvolleyballfeld, Tretbootverleih und kinderfreundlicher Wasserspielplatz.</li>
            <li><strong>Mountaincarten & Sommerrodeln an der Ruhrquelle:</strong> Mit dreirädrigen Funsport-Carts rasant den Grashang hinabsausen.</li>
            <li><strong>Wandern & Bike-Touren:</strong> Über 400 km markierte Wander- und E-Bike-Routen rund um den Kahlen Asten, Neuer Hagen und das Ruhrtal.</li>
            <li><strong>Sommerterrassen & Biergärten:</strong> Eisdielen, Pizzerien und Cafés mit Außenplätzen entlang der Flaniermeile <em>Am Waltenberg</em> und am Marktplatz.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Outdoor- und Freizeitangebote', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
        { label: 'Cafés & Gastronomie', category: 'Gastronomie' }
      ]
    },
    nl: {
      question: 'Wat te doen in Winterberg in de zomer?',
      quickSummary: 'In de zomer is Winterberg een waar outdoor-paradijs: het Bikepark Winterberg, de zomerrodelbaan, de Panoramabrug, het klimbos, het verwarmde openluchtzwembad in Siedlinghausen, waterskiën op de Hillebachsee, wandelen over de Kahler Asten en gezellige terrassen in het centrum.',
      plainAnswer: 'Zomeractiviteiten in Winterberg: Erlebnisberg Kappe (Bikepark, zomerrodelbaan, klimbos, Fly-Line, panoramabrug), zwemmen in het verwarmde openluchtbad Freibad Siedlinghausen, waterskiën bij de Hillebachsee in Niedersfeld, mountaincarten bij de Ruhrquelle, panoramawandelingen over de Rothaarsteig en gezellige terrassen.',
      answerHtml: (
        <div className="space-y-3">
          <p>In de zomermaanden (mei t/m oktober) barst Winterberg van de gezelligheid en outdoor-activiteiten:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Erlebnisberg Kappe:</strong> De 700 meter lange <em>zomerrodelbaan</em>, de zwevende <em>Fly-Line</em>, de <em>Panorama Belevenisbrug</em> met uitzicht over het dal en het uitdagende <em>Klimbos</em>.</li>
            <li><strong>Bikepark Winterberg:</strong> Het toonaangevende downhill- en mountainbikepark van Duitsland met spectaculaire tracks voor elk niveau en materiaalverhuur ter plaatse.</li>
            <li><strong>Openluchtzwembad Siedlinghausen:</strong> Het heerlijke verwarmde openluchtbad in Siedlinghausen met een 25m sportbad, duiktoren, peuterbad en een grote groene ligweide.</li>
            <li><strong>Hillebachsee Niedersfeld:</strong> Heerlijk zwemmeer met kabelwaterskibaan, wakeboarden, ligweide, beachvolleybal en gezellige horeca aan het water.</li>
            <li><strong>Mountaincarten bij de Ruhrquelle:</strong> Met stoere driewielers over het gras naar beneden sjezen.</li>
            <li><strong>Wandelen en E-biken:</strong> Schitterende tochten over de heide van de <em>Kahler Asten</em>, de <em>Rothaarsteig</em> en langs de bron van de rivier de Ruhr.</li>
            <li><strong>Gezellige terrassen & biergartens:</strong> Genieten van een Duits biertje, ijsje of diner in de zon aan de promenade <em>Am Waltenberg</em>.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Outdoor & Vrije Tijd Erlebnisberg Kappe', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
        { label: 'Horeca & Terrassen', category: 'Gastronomie' }
      ]
    }
  },

  // ── 3. Wat te doen met regen (Google Autosuggest - 100% REINE INDOOR-AKTIVITÄTEN) ──
  {
    id: 'wat-te-doen-met-regen',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Was kann man in Winterberg bei Regen machen?',
      quickSummary: 'Bei Regenwetter bietet Winterberg erstklassige 100% überdachte Indoor-Erlebnisse: Das Hallen- und Wellnessbad im Oversum Vital Resort, Bowling, Billard & Darts im Bowlhaus Winterberg, Kinobesuche im Filmtheater, rasante Indoor-Kartbahn in Neuastenberg, das Westdeutsche Wintersportmuseum sowie gemütliche Cafés.',
      plainAnswer: 'Bei Regenwetter empfehlen sich wetterunabhängige Indoor-Aktivitäten: 1. Schwimmen & Wellness im Hallenbad des Oversum Vital Resorts, 2. Bowling, Billard & Darts im Bowlhaus Winterberg, 3. Aktuelle Blockbuster im Filmtheater Winterberg, 4. Indoor-Kartbahn bei Kartfun Neuastenberg, 5. Westdeutsches Wintersportmuseum in Neuastenberg, 6. Gemütliche Café- und Restaurantbesuche mit warmen Waffeln.',
      answerHtml: (
        <div className="space-y-3">
          <p>Selbst bei Schmuddelwetter wird es in Winterberg dank abwechslungsreicher und komplett überdachter Indoor-Angebote garantiert nicht langweilig:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Schwimmen & Sauna im Oversum:</strong> Großzügiges Hallenbad mit 25-Meter-Sportbecken, Erlebnisbecken, Whirlpool sowie exklusiver Saunalandschaft mit Panoramablick.</li>
            <li><strong>Bowling, Darts & Billard:</strong> Das <em>Bowlhaus Winterberg</em> bietet moderne Bowlingbahnen, Disco-Bowling mit Lightshow, Billardtische, Airhockey und ein gemütliches Restaurant.</li>
            <li><strong>Kinoabend im Filmtheater Winterberg:</strong> Modern ausgestattetes Kino im Stadtzentrum mit aktuellen Blockbustern, Popcorn und Snacks.</li>
            <li><strong>Indoor-Karting bei Kartfun Neuastenberg:</strong> Wetterunabhängiger Fahrspaß auf der überdachten Kartbahn für Kinder, Jugendliche und Erwachsene.</li>
            <li><strong>Kultur & Museen:</strong> Das <em>Westdeutsche Wintersportmuseum</em> in Neuastenberg (Geschichte des Skilaufs seit über 120 Jahren) oder die <em>Borgs Scheune</em> in Züschen.</li>
            <li><strong>Ausgiebig schlemmen & Kaffeetrinken:</strong> Warme Sauerländer Waffeln mit Kirschen, frischer Kuchen und Kaffeespezialitäten in den gemütlichen Cafés im Stadtkern.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Bowling im Bowlhaus', category: 'Freizeit', subcategory: 'Bowling' },
        { label: 'Cafés & Gastronomie', category: 'Gastronomie' }
      ]
    },
    nl: {
      question: 'Wat te doen in Winterberg met regen?',
      quickSummary: 'Ook op regenachtige dagen is er volop overdekt plezier in Winterberg: Ontspannen in het overdekte zwem- en wellnessparadijs van het Oversum, bowlen bij Bowlhaus Winterberg, naar de nieuwste bioscoopfilms, indoor karten bij Kartfun Neuastenberg of gezellig koffiedrinken met warme Sauerländer wafels.',
      plainAnswer: 'Bij slecht weer in Winterberg (100% overdekte indoor-activiteiten): 1. Zwemmen en saunabezoek in het overdekte Oversum Vital Resort, 2. Bowlen en poolen in Bowlhaus Winterberg, 3. Film kijken in het Filmtheater Winterberg, 4. Indoor karten bij Kartfun Neuastenberg, 5. Bezoek aan het Wintersportmuseum in Neuastenberg, 6. Gezellig koffiedrinken met warme wafels en streekgerechten.',
      answerHtml: (
        <div className="space-y-3">
          <p>Regent het een dagje in Winterberg? Dit zijn de leukste 100% overdekte indoor-uitstapjes:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Zwemmen & Sauna in het Oversum:</strong> Heerlijk overdekt zwemmen in het 25m sportbad, ontspannen in het belevingsbad en opwarmen in de luxe Finse sauna\'s en stoombaden.</li>
            <li><strong>Bowlen bij Bowlhaus Winterberg:</strong> Gezellig met familie of vrienden bowlen (ook met discolampen), darten, poolbiljart spelen en hapjes eten in de sportbar.</li>
            <li><strong>Bioscoop (Filmtheater Winterberg):</strong> Knus filmtheater in het centrum waar de nieuwste films worden gedraaid met popcorn en drankjes.</li>
            <li><strong>Indoor Karten (Kartfun Neuastenberg):</strong> Snelle indoor kartbaan voor adrenaline en raceplezier, volledig overdekt.</li>
            <li><strong>West-Duits Wintersportmuseum (Neuastenberg):</strong> Ontdek hoe het skiën in het Sauerland meer dan 120 jaar geleden begon.</li>
            <li><strong>Koffie & Verse Wafels:</strong> Schuif aan in een van de traditionele Konditoreien voor warme Belgische/Duitse wafels met warme kersen en slagroom.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Bowlen in Winterberg', category: 'Freizeit', subcategory: 'Bowling' },
        { label: 'Cafés & Bakkerijen', category: 'Gastronomie' }
      ]
    }
  },

  // ── 4. Wat te doen vandaag (Google Autosuggest) ──
  {
    id: 'wat-te-doen-vandaag',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Was kann man heute in Winterberg machen?',
      quickSummary: 'Für einen perfekten Tag in Winterberg: Morgens gemütlich frühstücken, vormittags Action im Skigebiet oder am Erlebnisberg Kappe, nachmittags Ausblick vom Kahlen Asten oder Bummel durchs Zentrum, abends lecker Essen gehen und Après-Ski.',
      plainAnswer: 'Perfekter Tagesplan für heute: 1. Start mit Frühstück im Cafe Extrablatt oder Bäckerei Isken, 2. Live-Webcams checken und ab auf die Piste (Winter) bzw. in den Bikepark/Sommerrodelbahn (Sommer), 3. Einkehr zum Mittagessen in einer Hütte, 4. Panoramablick auf dem Kahlen Asten, 5. Dinner in einem Sauerländer Restaurant und Kneipenabend.',
      answerHtml: (
        <div className="space-y-3">
          <p>Hier ist die ideale Inspiration für Ihren heutigen Tag in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>09:00 Uhr – Frühstück & Stärkung:</strong> Großes Frühstücksbuffet im <em>Cafe Extrablatt</em> oder frische Handwerksbrötchen bei der <em>Bäckerei Isken</em>.</li>
            <li><strong>10:30 Uhr – Outdoor-Erlebnis:</strong> Im Winter ins <em>Skiliftkarussell</em> (Skipass online oder an der Kasse); im Sommer auf den <em>Erlebnisberg Kappe</em> (Rodelbahn & Panoramabrücke).</li>
            <li><strong>13:30 Uhr – Hüttenzauber zum Mittag:</strong> Herzhafte Brotzeit oder Kaiserschmarrn in <em>Möppi’s Hütte</em> oder im <em>Panorama Café</em>.</li>
            <li><strong>15:30 Uhr – Natur pur & Panorama:</strong> Hoch auf den <em>Kahlen Asten</em> – Aufstieg auf den Astenturm mit Rundumblick über hunderte Sauerländer Berggipfel.</li>
            <li><strong>17:30 Uhr – Flaniermeile & Shopping:</strong> Gemütlicher Bummel durch die Fußgängerzone <em>Am Waltenberg</em>.</li>
            <li><strong>19:30 Uhr – Dinner & Ausklang:</strong> Gemütliches Abendessen bei <em>Schneider’s</em>, in der <em>Kupferpfanne</em> oder <em>Dorf Alm</em>.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Restaurants für heute Abend', category: 'Gastronomie', subcategory: 'Restaurant' },
        { label: 'Freizeitangebote', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
      ]
    },
    nl: {
      question: 'Wat te doen in Winterberg vandaag?',
      quickSummary: 'De ideale dagplanning voor vandaag in Winterberg: Begin met een uitgebreid ontbijt, ga daarna skiën of naar de Erlebnisberg Kappe, geniet \'s middags van het uitzicht op de Kahler Asten en sluit de dag af met een heerlijk diner en een drankje in het centrum.',
      plainAnswer: 'Dagprogramma voor vandaag: 1. Ontbijtbuffet bij Cafe Extrablatt of Bäckerei Isken, 2. Pistes van het Skiliftkarussell (winter) of Bikepark & Rodelbaan op de Kappe (zomer), 3. Lunchen in een gezellige almhut, 4. Wandeling en uitzicht vanaf de Kahler Asten, 5. Dineren in een restaurant en borrelen in de Dorf Alm of Irish Pub.',
      answerHtml: (
        <div className="space-y-3">
          <p>Haal vandaag het maximale uit uw dag in Winterberg met deze beproefde dagplanning:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>09:00 uur – Goed ontbijten:</strong> Schuif aan bij het ontbijtbuffet van <em>Cafe Extrablatt</em> of haal vers belegde broodjes bij <em>Bäckerei Isken</em>.</li>
            <li><strong>10:30 uur – De berg op:</strong> In het wintersportseizoen direct de pistes op in het <em>Skiliftkarussell</em>; in de lente/zomer naar de <em>Erlebnisberg Kappe</em> (rodelen, klimmen en de panoramabrug).</li>
            <li><strong>13:30 uur – Lunchen in een almhut:</strong> Genieten van een echte Schnitzel, Currywurst of Kaiserschmarrn bij <em>Möppi’s Hütte</em> of het <em>Panorama Café</em>.</li>
            <li><strong>15:30 uur – Uitzicht op de Kahler Asten:</strong> Rij naar de top van de <em>Kahler Asten (841 m)</em> en beklim de historische uitkijktoren voor een 360-graden uitzicht.</li>
            <li><strong>17:30 uur – Winkelen & Flaneren:</strong> Slenteren langs de boetieks, sportwinkels en souvenirshops aan de promenade <em>Am Waltenberg</em>.</li>
            <li><strong>19:30 uur – Diner & Gezelligheid:</strong> Tafelen in een sfeervol restaurant (zoals <em>Schneider’s</em> of <em>Kupferpfanne</em>) en afsluiten met livemuziek in de pub.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Restaurants voor vanavond', category: 'Gastronomie', subcategory: 'Restaurant' },
        { label: 'Attracties & Activiteiten', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
      ]
    }
  },

  // ── 5. Wat te doen met kinderen / in de zomer met kinderen (Google Autosuggest) ──
  {
    id: 'wat-te-doen-met-kinderen',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Was kann man in Winterberg mit Kindern machen?',
      quickSummary: 'Winterberg ist ein Paradies für Familien: Sommerrodelbahnen, Panorama Erlebnis Brücke mit Riesenrutsche, Kletterwald, Wasserspielplatz am Hillebachsee, kindgerechte Skischulen mit Förderbändern, Rodellifte und der gigantische Aventura-Spielplatz im nahen Medebach.',
      plainAnswer: 'Top-Ausflugsziele für Familien mit Kindern: 1. Sommerrodelbahn & Fly-Line am Erlebnisberg Kappe, 2. Panorama Erlebnis Brücke mit Kletterelementen, 3. Hillebachsee mit Spielplatz & Badestrand, 4. Im Winter die Rodelparadiese Herrloh & Bremberg, 5. Kinderskischulen im Skiliftkarussell, 6. Europas längstes Spielgerät AVENTURA Spielberg (Medebach, 15 Min), 7. Freizeitpark FORT FUN (20 Min).',
      answerHtml: (
        <div className="space-y-3">
          <p>Winterberg ist besonders kinder- und familienfreundlich ausgebaut:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Erlebnisberg Kappe:</strong> Sommerrodelbahn mit Geschwindigkeitsmessung, <em>Panorama Erlebnis Brücke</em> mit Hängebrücken und Riesenrutschen zurück ins Tal sowie Kinder-Kletterparcours im <em>Kletterwald</em>.</li>
            <li><strong>Badespaß am Hillebachsee:</strong> Flacher, sicherer Sand-Badestrand für Kleinkinder, großer Piratenspielplatz und Tretbootfahren.</li>
            <li><strong>AVENTURA – Der Spielberg (Medebach, ca. 15 Min):</strong> Europas längstes Spiel- und Klettergerät (160 Meter lang) – komplett kostenlos zugänglich auf einem Berggipfel!</li>
            <li><strong>Freizeitpark FORT FUN Abenteuerland (Bestwig, ca. 20 Min):</strong> Der große Western-Freizeitpark für die ganze Familie mit Achterbahnen, Wildwasserbahn, Rodelbahn und Shows.</li>
            <li><strong>Winterurlaub mit Kids:</strong> Eigene Kinderländer mit Zauberteppichen (Förderbändern) an fast allen Skischulen sowie gesicherte Rodelhänge am Herrloh und Bremberg.</li>
            <li><strong>Minigolf & Spielplätze:</strong> Minigolfanlagen im Kurpark Winterberg und in den Ortsteilen.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Familien- & Freizeitangebote', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
        { label: 'Hotels & Familienunterkünfte', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
      ]
    },
    nl: {
      question: 'Wat te doen in Winterberg met kinderen?',
      quickSummary: 'Winterberg is de ideale familiebestemming: Zomerrodelbanen, de Panoramabrug met reuzenglijbaan, het klimbos, het zandstrand bij de Hillebachsee, kinderskischolen met lopende banden (tovertapijten) en het langste gratis speeltoestel van Europa (AVENTURA Spielberg).',
      plainAnswer: 'Beste kinderactiviteiten in Winterberg: 1. Zomerrodelbaan & Fly-Line op de Kappe, 2. Panorama Belevenisbrug met klimnetten en glijbanen, 3. Hillebachsee met zandstrand en waterspeeltuin, 4. AVENTURA Spielberg in Medebach (gratis speelparadijs op 15 min), 5. Pretpark FORT FUN Abenteuerland (20 min), 6. Rodelen met rodelliften bij Herrloh & Bremberg, 7. Kinderskiles met Nederlandstalige skileraren.',
      answerHtml: (
        <div className="space-y-3">
          <p>Voor gezinnen met kinderen van alle leeftijden heeft Winterberg enorm veel te bieden:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Erlebnisberg Kappe:</strong> De <em>zomerrodelbaan</em>, de <em>Fly-Line</em> zweefbaan door het bos, de 435m lange <em>Panorama Belevenisbrug</em> met touwbruggen en een 40 meter lange overdekte glijbaan omlaag, plus een kindvriendelijk <em>Klimbos</em>.</li>
            <li><strong>Zwemmen & Spelen bij de Hillebachsee:</strong> Ondiepe, veilige zwembaai met fijn zandstrand, grote speeltuin en waterfietsen.</li>
            <li><strong>AVENTURA – De Spielberg in Medebach (15 min rijden):</strong> Het langste gratis speeltoestel van Europa (160 meter lang) met talloze klimtorens, tunnels en glijbanen tegen een berghelling.</li>
            <li><strong>Pretpark FORT FUN Abenteuerland (20 min rijden):</strong> Geweldig pretpark in Wildwest-thema met achtbanen, wildwaterbaan, zweefmolen en familieshows.</li>
            <li><strong>Winter met kinderen:</strong> Veilige kinderlanden met lopende banden (\'tovertapijten\') en veel skischolen met Nederlandssprekende leraren, plus speciale rodelhellingen met rodelliften bij Herrloh en Bremberg.</li>
            <li><strong>Minigolf & Bowling:</strong> Minigolfbanen in het kuurpark en kindvriendelijk bowlen met hekjes (bumpers) bij <em>Bowlhaus Winterberg</em>.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Gezinsactiviteiten Kappe', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
        { label: 'Hotels & Vakantieparken', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
      ]
    }
  },

  // ── 6. Wat te doen met hond (Google Autosuggest) ──
  {
    id: 'wat-te-doen-met-hond',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Was kann man in Winterberg mit Hund machen?',
      quickSummary: 'Winterberg ist sehr hundefreundlich: Herrliche Wanderwege ohne Straßenverkehr (Rothaarsteig, Kahler Asten, Rundweg Hillebachsee), zahlreiche hundefreundliche Restaurants & Hütten mit Wassernäpfen sowie Unterkünfte, die Vierbeiner herzlich willkommen heißen.',
      plainAnswer: 'Mit Hund in Winterberg: 1. Traumhafte Wanderungen auf dem Rothaarsteig, Kahlen Asten und der Hochheide Niedersfeld, 2. Spaziergänge um den Hillebachsee (Leinenpflicht), 3. Hundefreundliche Gastronomie (Dorf Alm, Möppi\'s Hütte, Cafe Extrablatt erlauben Hunde), 4. Winterspaziergänge auf geräumten Wegen abseits der Skipisten. Hinweis: Auf den präparierten Skipisten sind Hunde aus Sicherheitsgründen nicht gestattet.',
      answerHtml: (
        <div className="space-y-3">
          <p>Urlaub mit dem besten Freund des Menschen ist in Winterberg unkompliziert und abwechslungsreich:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Wandern & Naturgenuss:</strong> Weitläufige Wanderwege direkt ab der Haustür. Besonders schön: Der Rundweg um den <em>Kahlen Asten</em>, die <em>Hochheide Niedersfeld</em> und schattige Pfade im <em>Kurpark</em> und <em>Helletal</em>.</li>
            <li><strong>Spaziergang am Hillebachsee:</strong> Der befestigte 1,6 km lange Seerundweg eignet sich hervorragend für Gassirunden (Hunde müssen im Parkbereich an der Leine geführt werden; an der Badestelle herrscht Hundeverbot).</li>
            <li><strong>Hundefreundliche Restaurants & Cafés:</strong> In den meisten Gasthöfen, Almen und Cafés (u. a. <em>Dorf Alm</em>, <em>Möppi’s Hütte</em>, <em>Cafe Extrablatt</em>) sind wohlerzogene Hunde gern gesehene Gäste – oft wird unaufgefordert ein frischer Wassernapf bereitgestellt.</li>
            <li><strong>Hunde im Schnee:</strong> Winterwanderungen auf den gewalzten Winterwanderwegen machen Vierbeinern riesigen Spaß. Wichtig: Auf den alpinen Skipisten und Rodelhängen sind Hunde zur Sicherheit von Skifahrern und Tieren untersagt.</li>
            <li><strong>Unterkünfte für Hundebesitzer:</strong> Viele Hotels und Ferienwohnungen in Winterberg sind speziell als „Hundefreundlich“ gekennzeichnet.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Hundefreundliche Gastronomie', category: 'Gastronomie' },
        { label: 'Unterkünfte für Hundebesitzer', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
      ]
    },
    nl: {
      question: 'Wat te doen in Winterberg met de hond?',
      quickSummary: 'Winterberg is ontzettend hondvriendelijk: Uitgestrekte wandelroutes in de natuur (zoals de Rothaarsteig en Kahler Asten), rondwandelingen om het meer van Niedersfeld, volop hondvriendelijke horeca met waterbakken en talloze accommodaties waar honden van harte welkom zijn.',
      plainAnswer: 'Met de hond in Winterberg: 1. Eindeloos wandelen over de heide van de Kahler Asten, Rothaarsteig en door de Helletal-kloof, 2. Rondje om de Hillebachsee (aangelijnd), 3. Hondvriendelijke restaurants en berghutten (honden zijn welkom in o.a. Dorf Alm, Möppi\'s Hütte en Cafe Extrablatt), 4. Sneeuwwandelingen over geprepareerde winterwandelpaden. Let op: op de skipistes zijn honden om veiligheidsredenen niet toegestaan.',
      answerHtml: (
        <div className="space-y-3">
          <p>Winterberg is een waar paradijs voor vakantiegangers met een hond:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Wandelen zonder verkeer:</strong> Vanaf vrijwel elk vakantiehuis loopt u zó de uitgestrekte bossen in. Favoriete routes: De bloeiende heide op de <em>Kahler Asten</em>, de <em>Rothaarsteig</em> en de koele bospaden langs de beek in het <em>Helletal</em>.</li>
            <li><strong>Wandelen om de Hillebachsee:</strong> De geasfalteerde ronde van 1,6 km rond het meer is perfect voor de dagelijkse wandeling (honden aan de lijn; op de zwemweide zelf zijn honden niet toegestaan).</li>
            <li><strong>Hondvriendelijke restaurants & berghutten:</strong> In vrijwel alle Duitse restaurants en almhutten (zoals <em>Dorf Alm</em>, <em>Möppi’s Hütte</em> en <em>Cafe Extrablatt</em>) zijn honden van harte welkom en staat er direct een bak vers water klaar.</li>
            <li><strong>In de sneeuw met de hond:</strong> Honden zijn dol op de dikke pakken sneeuw op de speciaal gewalste winterwandelpaden. Om ongelukken te voorkomen zijn honden op de geprepareerde skipistes en rodelbanen niet toegestaan.</li>
            <li><strong>Hondvriendelijk overnachten:</strong> Veel hotels, pensions en vakantieparken in Winterberg verwelkomen honden met open armen.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Horeca & Eetgelegenheden', category: 'Gastronomie' },
        { label: 'Hondvriendelijke Hotels', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
      ]
    }
  },

  // ── 7. Wat te doen in de omgeving (Google Autosuggest) ──
  {
    id: 'wat-te-doen-in-de-omgeving',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Was kann man in der Umgebung von Winterberg machen?',
      quickSummary: 'In unmittelbarer Umgebung locken spannende Attraktionen: Die spektakuläre Hängebrücke Skywalk in Willingen, der Freizeitpark FORT FUN Abenteuerland, die monumentalen Bruchhauser Steine, der Kletterberg AVENTURA Medebach, Stauseen wie der Diemelsee und die berühmte Warsteiner Welt.',
      plainAnswer: 'Die besten Ausflugsziele rund um Winterberg: 1. Skywalk Willingen (665 m lange Hängebrücke, 20 Min), 2. Freizeitpark FORT FUN Abenteuerland (Bestwig, 20 Min), 3. Bruchhauser Steine Naturmonument (Olsberg, 15 Min), 4. AVENTURA Spielberg Medebach (15 Min), 5. Tropfsteinhöhle Atta-Höhle in Attendorn (45 Min), 6. Bootsfahrten auf dem Hennesee oder Diemelsee.',
      answerHtml: (
        <div className="space-y-3">
          <p>Das Hochsauerland rund um Winterberg bietet im Umkreis von nur 15 bis 40 Autominuten weltbekannte Ausflugsziele:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Skywalk Willingen (ca. 20 Min):</strong> Mit 665 Metern eine der längsten freihängenden Fußgänger-Hängebrücken der Welt – spektakulärer Nervenkitzel in 100 Metern Höhe über dem Tal.</li>
            <li><strong>FORT FUN Abenteuerland (Bestwig, ca. 20 Min):</strong> Der große Western-Freizeitpark für die ganze Familie mit Achterbahnen, Wildwasserbahn und Shows.</li>
            <li><strong>Naturmonument Bruchhauser Steine (Olsberg, ca. 15 Min):</strong> Vier gigantische, bis zu 92 Meter hohe Porphyrfelsen auf einem Vulkankegel mit grandiosem Weitblick und Falken-Horsten.</li>
            <li><strong>AVENTURA Spielberg (Medebach, ca. 15 Min):</strong> Europas längstes Kletter- und Spielgerät für Kinder – komplett kostenfrei mit Panoramablick.</li>
            <li><strong>Atta-Höhle Attendorn (ca. 45 Min):</strong> Deutschlands größte und schönste begehbare Tropfsteinhöhle mit Jahrtausende alten Stalaktiten und Stalagmiten.</li>
            <li><strong>Sauerländer Seen (Hennesee, Diemelsee, Biggesee):</strong> Schifffahrten, Tretbootfahren, Segeln und Baden an idyllischen Stauseen.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Freizeitangebote & Ausflugsziele', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
      ]
    },
    nl: {
      question: 'Wat te doen in Winterberg en omgeving?',
      quickSummary: 'In de directe omgeving van Winterberg liggen fantastische bezienswaardigheden: De spectaculaire hangbrug Skywalk in Willingen, pretpark FORT FUN Abenteuerland, de gigantische rotsformaties Bruchhauser Steine, de Atta-Höhle druipsteengrotten en de meren Hennesee en Diemelsee.',
      plainAnswer: 'Top uitstapjes rondom Winterberg: 1. Skywalk Willingen (665 m lange hangbrug op 100 m hoogte, 20 min), 2. Pretpark FORT FUN Abenteuerland in Bestwig (20 min), 3. De monumentale Bruchhauser Steine (15 min), 4. AVENTURA Spielberg Medebach (langste gratis speelbos van Europa, 15 min), 5. Atta-Höhle druipsteengrot in Attendorn (45 min), 6. Boottochten op de Hennesee of Diemelsee.',
      answerHtml: (
        <div className="space-y-3">
          <p>Binnen 15 tot 40 minuten rijden vanaf Winterberg vindt u topattracties van het Sauerland:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Skywalk Willingen (ca. 20 min rijden):</strong> Met 665 meter de langste voetgangershangbrug van Duitsland en een van de langste ter wereld – zweef 100 meter boven het dal!</li>
            <li><strong>Pretpark FORT FUN Abenteuerland (Bestwig, 20 min):</strong> Hét familiepretpark in het Sauerland met achtbanen, wildwaterbanen en een gezellige westernsfeer.</li>
            <li><strong>Bruchhauser Steine (Olsberg, 15 min):</strong> Vier gigantische, 90 meter hoge vulkanische rotsen bovenop een berg met een adembenemend uitzicht (u kunt de Feldstein beklimmen via trappen).</li>
            <li><strong>AVENTURA Spielberg (Medebach, 15 min):</strong> Het langste gratis klim- en speelparcours van Europa (160 meter lang) tegen een heuvel – fantastisch voor kinderen!</li>
            <li><strong>Atta-Höhle in Attendorn (45 min):</strong> Een van de grootste en mooiste druipsteengrotten van Duitsland met eeuwenoude stalactieten en stalagmieten.</li>
            <li><strong>Boottochten op de meren (Hennesee & Diemelsee):</strong> Rondvaarten met de passagiersboot, waterfietsen en zeilen in een schilderachtige heuvelachtige omgeving.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Attracties & Uitstapjes', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
      ]
    }
  },

  // ── 8. Wat te doen op zondag / Sonntagsöffnung (Google Autosuggest) ──
  {
    id: 'wat-te-doen-op-zondag',
    categoryGroup: 'Einkaufen & Shopping',
    de: {
      question: 'Was kann man sonntags in Winterberg machen?',
      quickSummary: 'Sonntags ist in Winterberg Hochbetrieb: Dank der Tourismus-Sonderregelung haben viele Modegeschäfte und Boutiquen am Waltenberg sonntags geöffnet (meist 11–17 Uhr). Alle Freizeitanlagen, Skilifte, Lifte am Erlebnisberg Kappe, Cafés und Restaurants sind uneingeschränkt geöffnet.',
      plainAnswer: 'Sonntags in Winterberg: 1. Sonntags-Shopping: Viele Boutiquen und Sportgeschäfte an der Flaniermeile Am Waltenberg haben sonntags von 11:00 bis 17:00 Uhr geöffnet, 2. Frische Brötchen & Frühstück in Bäckereien wie Isken und Krämer, 3. Alle Freizeitanbieter (Bikepark, Rodelbahnen, Skilifte, Oversum Hallenbad) sind geöffnet, 4. Gastronomie und Hütten haben den ganzen Tag warmen Küchenbetrieb.',
      answerHtml: (
        <div className="space-y-3">
          <p>Winterberg genießt als staatlich anerkannter heilklimatischer Kurort und Tourismus-Zentrum besondere Sonntagsregelungen:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Sonntags-Shopping (Sonntagsöffnung):</strong> Zahlreiche Geschäfte, Sportläden, Bekleidungsgeschäfte und Souvenir-Boutiquen entlang der Straße <em>Am Waltenberg</em> und im Zentrum dürfen sonntags (meist von 11:00 bis 17:00 Uhr) für Kunden öffnen.</li>
            <li><strong>Frische Brötchen & Sonntagsfrühstück:</strong> Bäckereien wie <em>Bäckerei Isken</em> (mehrere Filialen) und <em>Café Krämer</em> haben sonntags früh geöffnet und bieten frische Handwerksbrötchen sowie Frühstücksangebote.</li>
            <li><strong>Voller Freizeitbetrieb:</strong> Sämtliche Skilifte im Winter bzw. Sommerrodelbahnen, <em>Bikepark</em>, <em>Kletterwald</em> und das <em>Oversum Schwimmbad</em> haben sonntags regulär geöffnet.</li>
            <li><strong>Gastronomie durchgehend geöffnet:</strong> Restaurants, Pizzerien, Almen und Cafés bieten sonntags durchgehend warme Küche und Kaffeespezialitäten an.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Einzelhandel & Mode in Winterberg', category: 'Einzelhandel' },
        { label: 'Bäckereien & Frühstück', category: 'Gastronomie' }
      ]
    },
    nl: {
      question: 'Wat te doen in Winterberg op zondag?',
      quickSummary: 'Op zondag is er volop leven in de brouwerij in Winterberg: Dankzij de toeristische status zijn veel kledingwinkels en boetieks aan de Waltenberg \'s zondags geopend (meestal 11:00–17:00 uur). Alle attracties, skiliften, rodelbanen, bakkerijen en restaurants draaien op volle toeren.',
      plainAnswer: 'Zondag in Winterberg: 1. Zondagsopening: Veel mode- en sportwinkels aan de Waltenberg zijn zondags geopend van 11:00 tot 17:00 uur, 2. Verse broodjes bij bakkerijen zoals Isken en Krämer vanaf de vroege ochtend, 3. Alle attracties (Skiliftkarussell, Bikepark, zomerrodelbanen, zwembad Oversum) zijn geopend, 4. Restaurants en terrassen serveren de hele dag warme gerechten.',
      answerHtml: (
        <div className="space-y-3">
          <p>In tegenstelling tot veel andere Duitse steden is Winterberg op zondag juist heel levendig:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Zondags winkelen (Zondagsopening):</strong> Als erkend toeristisch kuuroord mogen veel winkels, sportzaken, boetieks en souvenirwinkels aan de <em>Waltenberg</em> en in het centrum ook op zondagmiddag open zijn (doorgaans tussen 11:00 en 17:00 uur).</li>
            <li><strong>Ontbijt & Verse Broodjes:</strong> Lokale bakkerijen zoals <em>Bäckerei Isken</em> en <em>Café Krämer</em> zijn op zondagochtend al vroeg geopend voor ovenverse Kaiserbrötchen, koffie en ontbijt.</li>
            <li><strong>Alle attracties volop geopend:</strong> Zowel de <em>Skiliftkarussell</em> in de winter als het <em>Bikepark</em>, de <em>zomerrodelbanen</em>, de <em>panoramabrug</em> en het overdekte zwembad <em>Oversum</em> zijn gewoon geopend.</li>
            <li><strong>Horeca & Terrassen:</strong> Alle restaurants, almhutten en pubs zijn de hele zondag geopend voor lunch, koffie met gebak en een sfeervol diner.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Winkels & Mode in Winterberg', category: 'Einzelhandel' },
        { label: 'Bakkerijen & Cafés', category: 'Gastronomie' }
      ]
    }
  },

  // ── 9. Wat te doen in Winterberg Duitsland / Waarom Winterberg (Google Autosuggest) ──
  {
    id: 'wat-te-doen-winterberg-duitsland',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Warum lohnt sich ein Urlaub in Winterberg?',
      quickSummary: 'Winterberg ist das schneesicherste und vielfältigste Mittelgebirgs-Urlaubsziel in Westdeutschland: Perfekt erreichbar aus ganz NRW, Hessen und den Niederlanden, mit über 27 km Skipisten, erstklassigen Mountainbike-Strecken, intakter Sauerländer Natur und herzlicher Gastfreundschaft.',
      plainAnswer: 'Winterberg lohnt sich, weil: 1. Schnelle Anreise (nur ca. 1,5 bis 2 Std. aus dem Ruhrgebiet / Köln / Frankfurt), 2. Modernstes Skigebiet nördlich der Alpen mit Flutlicht und Beschneiung, 3. Erstklassige Sommer-Action (Bikepark, Kappe, Hillebachsee), 4. Rund 500 km Wanderwege im Naturpark Sauerland-Rothaarsteig, 5. Sauerland SommerCard mit über 40 kostenlosen Eintritten bei vielen Unterkünften.',
      answerHtml: (
        <div className="space-y-3">
          <p>Winterberg verbindet alpines Bergflair mit extrem kurzer Anreise:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Schnelle & mautfreie Erreichbarkeit:</strong> Zentral im Herzen Deutschlands gelegen, direkt über die A46/B480 oder per Bahn (eigener Bahnhof) erreichbar.</li>
            <li><strong>Modernste Wintersport-Infrastruktur:</strong> Über 26 Lifte, 14 beleuchtete Hänge für Flutlicht-Skifahren und moderne Beschneiungstechnik auf 6 Bergen.</li>
            <li><strong>Europas Treffpunkt für Biker & Outdoor-Fans:</strong> Weltberühmter Bikepark, Dirt Masters Festival und Trailpark Winterberg.</li>
            <li><strong>Erholung in Heilklima & Höhenluft:</strong> Reizarmes Mittelgebirgsklima auf 600 bis 841 Metern Höhe, zertifizierte Kurwege und Wellnesshotels.</li>
            <li><strong>Sauerland SommerCard:</strong> Bei vielen Partnerhotels und Ferienwohnungen erhalten Sie kostenlosen Eintritt zu Sommerrodelbahnen, Schwimmbädern, Panoramabrücke und Museen.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Hotels & Skihotels in Winterberg', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' },
        { label: 'Freizeitanbieter & Attraktionen', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
      ]
    },
    nl: {
      question: 'Wat te doen in Winterberg Duitsland?',
      quickSummary: 'Winterberg is voor Nederlanders en Belgen dé favoriete bestemming dicht bij huis: Op slechts 3 tot 3,5 uur rijden ervaart u een compleet wintersport- of bergvakantiegevoel met 27,5 km skipistes, het beste bikepark van Duitsland, prachtige natuur en uitstekende gastvrijheid.',
      plainAnswer: 'Waarom naar Winterberg Duitsland? 1. Slechts 3 tot 3,5 uur rijden vanaf Midden-Nederland (tolvrij), 2. Het dichtstbijzijnde complete skigebied met honderden sneeuwkanonnen en avondskiën, 3. Zomerattracties op de Erlebnisberg Kappe en waterskiën, 4. Wandelen op de Rothaarsteig en Kahler Asten, 5. Sauerland SommerCard met meer dan 40 gratis attracties bij aangesloten accommodaties.',
      answerHtml: (
        <div className="space-y-3">
          <p>Waarom honderdduizenden Nederlanders en Vlamingen elk jaar naar Winterberg reizen:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Dichtbij & Tolvrij:</strong> Vanaf Utrecht of Arnhem bent u in ca. 3 tot 3,5 uur (ca. 300 km) via de Duitse snelwegen A3/A44/A46 in hartje Winterberg – zonder tolvignet of vliegstress.</li>
            <li><strong>Het \'Dichtstbijzijnde Alpengevoel\':</strong> De toppen van de Kahler Asten (841 m) en Poppenberg bieden echte bergsferen, besneeuwde dennenbomen en gezellige houten almhutten.</li>
            <li><strong>Sneeuwzeker door hightech besneeuwing:</strong> Honderden computergestuurde sneeuwkanonnen garanderen van december tot maart uitstekende pistes.</li>
            <li><strong>Veelzijdig in elk seizoen:</strong> In de zomer wandelen, mountainbiken in het Bikepark, zwemmen in bergmeren en rodelen.</li>
            <li><strong>Nederlandssprekend & Gastvrij:</strong> Vrijwel overal in Winterberg wordt Nederlands gesproken (skischolen, horeca, hotelrecepties).</li>
            <li><strong>Sauerland SommerCard:</strong> Boekt u bij een deelnemende accommodatie, dan krijgt u gratis toegang tot ruim 40 attracties (inclusief de Panoramabrug, rodelbanen, zwembaden en musea).</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Hotels & Vakantiehuizen in Winterberg', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' },
        { label: 'Vrijetijdsactiviteiten', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
      ]
    }
  },

  // ── 10. Gut Essen / Lekker eten ──
  {
    id: 'gut-essen',
    categoryGroup: 'Essen & Trinken',
    de: {
      question: 'Wo kann man in Winterberg gut essen?',
      quickSummary: 'Winterberg bietet eine vielfältige Gastronomie: Von traditioneller Sauerländer Küche und Steakhäusern über italienische Pizzerien bis hin zu Panoramarestaurants und gemütlichen Skihütten.',
      plainAnswer: 'In Winterberg gibt es eine große gastronomische Auswahl. Beliebte Adressen sind das Hotel Hessenhof und Schneider\'s Restaurant für traditionelle Küche, die Kupferpfanne für Steaks, Da Salvatore für italienische Spezialitäten sowie die Panorama-Restaurants am Erlebnisberg Kappe und Möppi\'s Hütte.',
      answerHtml: (
        <div className="space-y-3">
          <p>In Winterberg und den umliegenden Ortsteilen erwartet Sie eine lebendige Restaurantszene:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Traditionell & Sauerländisch:</strong> <em>Hotel Hessenhof</em> (Zentrum), <em>Schneider’s Restaurant</em>, <em>Gasthof Zur Post</em> sowie urgemütliche Landgasthöfe in den Ortsteilen (z. B. Altastenberg, Züschen).</li>
            <li><strong>Steak, Grill & International:</strong> <em>Kupferpfanne Winterberg</em> (Steaks & Grillspezialitäten), <em>Pizzeria Da Salvatore</em> oder <em>Benvenuto</em> (italienische Spezialitäten).</li>
            <li><strong>Hütten mit Panoramablick:</strong> <em>Panorama Café & Restaurant</em> auf dem Erlebnisberg Kappe, <em>Möppi’s Hütte</em> am Bremberg und die <em>Herrloh Hütte</em>.</li>
            <li><strong>Gehoben & Feinschmecker:</strong> Ausgewählte Restaurants und Romantik-Hotels mit regionaler Gourmetküche.</li>
          </ul>
          <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-amber-900 mt-2">
            <strong>Tipp:</strong> Während der Skisaison (Dezember bis März) sowie an Ferien-Wochenenden empfiehlt sich eine Tischreservierung mindestens 2–3 Tage im Voraus.
          </p>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Restaurants entdecken', category: 'Gastronomie', subcategory: 'Restaurant' },
        { label: 'Pizzerien & Trattorien', category: 'Gastronomie', subcategory: 'Pizzerien' },
        { label: 'Alle Gastronomiebetriebe', category: 'Gastronomie' }
      ]
    },
    nl: {
      question: 'Waar kun je lekker eten in Winterberg?',
      quickSummary: 'Winterberg heeft een enorm veelzijdige gastronomie: Van traditionele Sauerlandse specialiteiten en malse steaks tot Italiaanse pizza\'s, panoramarestaurants en gezellige berghutten.',
      plainAnswer: 'Populaire eetgelegenheden in Winterberg: Hotel Hessenhof en Schneider\'s Restaurant voor traditionele streekgerechten, Kupferpfanne voor steaks en grillgerechten, Da Salvatore voor Italiaans, en het Panorama Café op de Kappe of Möppi\'s Hütte voor lunchen op de berg.',
      answerHtml: (
        <div className="space-y-3">
          <p>In het centrum en de omliggende dorpen van Winterberg vindt u volop goede restaurants:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Traditioneel & Duits:</strong> <em>Hotel Hessenhof</em>, <em>Schneider’s Restaurant</em> en gezellige herbergen in omliggende dorpen zoals Altastenberg en Züschen.</li>
            <li><strong>Steakhouses & Grill:</strong> <em>Kupferpfanne Winterberg</em> voor uitstekende biefstuk en grillgerechten.</li>
            <li><strong>Italiaans & Pizza:</strong> <em>Pizzeria Da Salvatore</em> of <em>Benvenuto</em> in het centrum.</li>
            <li><strong>Berghutten met uitzicht:</strong> <em>Panorama Café & Restaurant</em> op de Erlebnisberg Kappe en <em>Möppi’s Hütte</em> aan de Bremberg-piste.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Restaurants in Winterberg bekijken', category: 'Gastronomie', subcategory: 'Restaurant' },
        { label: 'Alle Horecagelegenheden', category: 'Gastronomie' }
      ]
    }
  },

  // ── 11. Frühstücken / Ontbijten ──
  {
    id: 'fruehstuecken',
    categoryGroup: 'Essen & Trinken',
    de: {
      question: 'Wo kann man in Winterberg frühstücken?',
      quickSummary: 'Für ein gutes Frühstück oder Brunch gibt es in Winterberg beliebte Spots wie das Cafe Extrablatt oder die Markt Alm, traditionelle Bäckereicafés mit Etageren sowie reichhaltige Hotel-Frühstücksbuffets für externe Gäste.',
      plainAnswer: 'Beliebt zum Frühstücken sind das Cafe Extrablatt (großes tägliches Frühstücksbuffet an der Unteren Pforte) und die Markt Alm (reichhaltiges Alm-Frühstücksbuffet im Lodge Hotel am Waltenberg). Zudem bieten Bäckerei & Café Isken, Café Krämer sowie Hotel-Frühstücksbuffets für Tagesgäste im Oversum Vital Resort und Hotel Hessenhof erstklassige Optionen.',
      answerHtml: (
        <div className="space-y-3">
          <p>Egal ob ausgiebiges Frühstücksbuffet, gemütlicher Brunch oder schnelles Bäckerei-Frühstück:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Beliebte Frühstücksbuffets & Brunch-Spots:</strong> Das <em>Cafe Extrablatt</em> (an der Unteren Pforte) bietet täglich ein großes All-you-can-eat-Frühstücksbuffet mit Rührei, Bacon, Brötchen, Müsli und Waffeln. Die <em>Markt Alm</em> (im Lodge Hotel, Am Waltenberg 33) lockt mit einem herzhaften Alm-Frühstücksbuffet ab 07:30 Uhr.</li>
            <li><strong>Bäckereien & Frühstückscafés:</strong> <em>Café Bäckerei Isken</em> (mehrere Standorte mit großer Frühstücksauswahl, frischen Handwerksbrötchen, belegten Snacks und Kaffeespezialitäten), <em>Café Krämer</em> und <em>Café Engemann</em> im Zentrum.</li>
            <li><strong>Hotel-Frühstücksbuffets für externe Gäste:</strong> Das <em>Oversum Vital Resort</em> und das <em>Hotel Hessenhof</em> bieten auch Tagesbesuchern ein erstklassiges Frühstücksbuffet an (vorherige Reservierung empfohlen).</li>
            <li><strong>Cafés an der Flaniermeile:</strong> Zahlreiche Cafés entlang der Straße <em>Am Waltenberg</em> bieten süße und herzhafte Frühstücksvariationen mit frischen Waffeln.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Cafés & Gastronomie', category: 'Gastronomie' },
        { label: 'Hotels in Winterberg', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
      ]
    },
    nl: {
      question: 'Waar kun je ontbijten in Winterberg?',
      quickSummary: 'Voor een heerlijk ontbijt of brunch in Winterberg: Het dagelijkse ontbijtbuffet bij Cafe Extrablatt, het alm-ontbijtbuffet in de Markt Alm, verse broodjes bij Bäckerei Isken en luxe hotelontbijtbuffets in het Oversum of Hotel Hessenhof.',
      plainAnswer: 'Populaire ontbijtadressen: Cafe Extrablatt (groot dagelijks ontbijtbuffet), Markt Alm (Alm-ontbijtbuffet vanaf 07:30 uur), Bäckerei Isken, Café Krämer en de hotelbuffets van Oversum Vital Resort en Hotel Hessenhof.',
      answerHtml: (
        <div className="space-y-3">
          <p>Begin uw dag in Winterberg met een goed ontbijt:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Uitgebreid ontbijtbuffet:</strong> <em>Cafe Extrablatt</em> aan de Untere Pforte (dagelijks all-you-can-eat buffet met roerei, spek, warme broodjes en pannenkoeken) en de <em>Markt Alm</em> aan de Waltenberg.</li>
            <li><strong>Bakkersontbijt:</strong> <em>Bäckerei & Café Isken</em> (verschillende filialen met vers belegde broodjes, koffiespecialiteiten en ontbijtplateaus) en <em>Café Krämer</em>.</li>
            <li><strong>Hotelbuffets voor daggasten:</strong> <em>Oversum Vital Resort</em> en <em>Hotel Hessenhof</em> bieden ook niet-hotelgasten een luxe ontbijtbuffet (vooraf reserveren aanbevolen).</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Cafés & Bakkerijen', category: 'Gastronomie' }
      ]
    }
  },

  // ── 12. Feiern / Après-Ski ──
  {
    id: 'feiern-nachtleben',
    categoryGroup: 'Essen & Trinken',
    de: {
      question: 'Wo kann man in Winterberg gut feiern?',
      quickSummary: 'In Winterberg kann man hervorragend feiern – vom ausgelassenen Après-Ski direkt an den Pisten über Partynächte im Discotheken-Klassiker Tenne und in der Dorf Alm bis hin zu urigen Kneipen und Irish Pubs.',
      plainAnswer: 'Gut feiern kann man beim Après-Ski in Möppi\'s Hütte oder im Alm Salettl. Abends geht die Party in der Kult-Disko Tenne Winterberg, im Alpenrausch und in der Dorf Alm weiter, sowie in urgemütlichen Kneipen wie dem Hessenkeller und dem Blackwater Irish Pub.',
      answerHtml: (
        <div className="space-y-3">
          <p>Winterberg ist die Party- und Après-Ski-Hochburg im Sauerland. Hier feiert man bis in die frühen Morgenstunden:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Après-Ski & Pistenpartys:</strong> <em>Möppi’s Hütte</em> (Bremberg), <em>Alm Salettl</em> (Kappe) und die Schirmbars am Herrloh – in der Wintersaison startet die Musik und Stimmung bereits ab 15:00 Uhr direkt an den Pisten.</li>
            <li><strong>Discotheken-Klassiker & Clubs:</strong> Die <em>Tenne Winterberg</em> ist die legendäre Kult-Disco der Stadt – ein echter Klassiker, der bereits seit vielen Jahrzehnten Gäste begeistert und auf mehreren Ebenen zum Tanzen einlädt. Ebenfalls beliebt für Partynächte ist der <em>Alpenrausch</em>.</li>
            <li><strong>Stimmungslokale & Almhütten:</strong> Die <em>Dorf Alm Winterberg</em> bietet urige Gemütlichkeit, zünftige Hüttenmusik und ausgelassene Partystimmung mitten im Zentrum.</li>
            <li><strong>Uriges Kneipenleben & Pubs:</strong> Der <em>Hessenkeller</em> (uriger Gewölbekeller mit Live-Musik, Tanz und Quizabenden) und das <em>Blackwater Irish Pub</em> (frisch gezapftes Guinness, Cider, Live-Sport & Musik).</li>
            <li><strong>Cocktails & Lounge:</strong> <em>Bu'ket Bar</em> für entspannte Drinks und Cocktails im Stadtkern.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Kneipen & Bars in Winterberg', category: 'Gastronomie', subcategory: 'Kneipen und Bars' },
        { label: 'Alle Gastronomiebetriebe', category: 'Gastronomie' }
      ]
    },
    nl: {
      question: 'Waar kun je goed feesten in Winterberg?',
      quickSummary: 'Winterberg is dé après-ski- en feestlocatie van het Sauerland: Van après-ski aan de piste tot feesten in discoclassic Tenne, de gezellige Dorf Alm en knusse pubs.',
      plainAnswer: 'Feesten en après-ski: Direct aan de piste bij Möppi\'s Hütte of Alm Salettl. \'s Avonds gaat het feest door in de bekende discotheek Tenne Winterberg, in de Dorf Alm en in gezellige kroegen zoals de Hessenkeller en het Blackwater Irish Pub.',
      answerHtml: (
        <div className="space-y-3">
          <p>In Winterberg gaat het feest na het skiën of mountainbiken door tot in de vroege uurtjes:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Après-Ski aan de piste:</strong> <em>Möppi’s Hütte</em> (Bremberg), <em>Alm Salettl</em> (Kappe) en de paraplubars bij Herrloh (vanaf 15:00 uur volop feest).</li>
            <li><strong>Discotheken & Clubs:</strong> De <em>Tenne Winterberg</em> (een legendarische klassieker met meerdere dansvloeren) en de <em>Alpenrausch</em>.</li>
            <li><strong>Gezelligheid in de Dorf Alm:</strong> De <em>Dorf Alm Winterberg</em> met Duitstalige feestmuziek en een echte houten almsfeer.</li>
            <li><strong>Pubs & Kroegen:</strong> De gewelvenkelder <em>Hessenkeller</em> en het <em>Blackwater Irish Pub</em> voor een lekker getapt Guinness biertje.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Kroegen & Bars in Winterberg', category: 'Gastronomie', subcategory: 'Kneipen und Bars' }
      ]
    }
  },

  // ── 13. Abends machen / \'s Avonds doen ──
  {
    id: 'was-kann-man-abends-machen',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Was kann man abends in Winterberg machen?',
      quickSummary: 'Das Abendprogramm in Winterberg reicht von Flutlicht-Skifahren und Rodeln über gesellige Hüttenabende und Clubbesuche bis hin zu Wellness, Kino und Fackelwanderungen.',
      plainAnswer: 'Abends locken Flutlicht-Skifahren (Di, Mi, Fr, Sa bis 21:30 Uhr), gesellige Restaurantabende, Après-Ski in der Tenne oder Dorf Alm, Wellness im Oversum Vital Resort sowie Filmabende im Filmtheater Winterberg.',
      answerHtml: (
        <div className="space-y-3">
          <p>In Winterberg wird es auch nach Sonnenuntergang nicht langweilig:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Flutlicht-Skifahren & Rodeln:</strong> Dienstags, mittwochs, freitags und samstags werden bis zu 14 Hänge im Skiliftkarussell hell erleuchtet (18:30 bis 21:30 Uhr).</li>
            <li><strong>Ausgehen & Nightlife:</strong> Party in der <em>Tenne</em>, Live-Musik und Bierkultur im <em>Blackwater Irish Pub</em> oder Schlager in der <em>Dorf Alm</em>.</li>
            <li><strong>Bowling & Geselligkeit:</strong> Bowlingabende, Disco-Bowling, Billard und Darts im <em>Bowlhaus Winterberg</em>.</li>
            <li><strong>Wellness-Abend:</strong> Ausgedehnte Saunagänge und Entspannung im Hallen- und Wellnessbereich des <em>Oversum</em>.</li>
            <li><strong>Kino & Kultur:</strong> Das <em>Filmtheater Winterberg</em> zeigt aktuelle Kino-Highlights.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Kneipen & Nachtleben', category: 'Gastronomie', subcategory: 'Kneipen und Bars' },
        { label: 'Bowling & Freizeitzentren', category: 'Freizeit', subcategory: 'Bowling' }
      ]
    },
    nl: {
      question: 'Wat is er \'s avonds te doen in Winterberg?',
      quickSummary: 'Het avondprogramma in Winterberg biedt volop variatie: Avondskiën onder verlichting, gezellig uit eten, feesten in de Tenne of Dorf Alm, bowlen bij Bowlhaus of ontspannen in de sauna van het Oversum.',
      plainAnswer: '\'s Avonds in Winterberg: Avondskiën op verlichte pistes (di, wo, vr, za tot 21:30 uur), gezellige diners, après-ski in de Tenne en Dorf Alm, bowlen in het Bowlhaus en film kijken in de bioscoop.',
      answerHtml: (
        <div className="space-y-3">
          <p>Ook als de avond valt is er in Winterberg genoeg te beleven:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Avondskiën onder schijnwerpers:</strong> Op di, wo, vr en za zijn tot 14 pistes in het Skiliftkarussell verlicht van 18:30 tot 21:30 uur.</li>
            <li><strong>Bowlen bij Bowlhaus:</strong> Gezellige bowlingavonden met hapjes en drankjes.</li>
            <li><strong>Stappen & Kroegentocht:</strong> Naar de <em>Tenne</em>, de <em>Dorf Alm</em> of <em>Blackwater Irish Pub</em>.</li>
            <li><strong>Avondwellness in het Oversum:</strong> Genieten van de sauna\'s en het warme bad in de avond.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Kroegen & Bars', category: 'Gastronomie', subcategory: 'Kneipen und Bars' },
        { label: 'Bowlen in Winterberg', category: 'Freizeit', subcategory: 'Bowling' }
      ]
    }
  },

  // ── 14. Skifahren / Skiën ──
  {
    id: 'skifahren',
    categoryGroup: 'Wintersport & Schnee',
    de: {
      question: 'Wo kann man in Winterberg skifahren?',
      quickSummary: 'Das Skiliftkarussell Winterberg ist das größte zusammenhängende Skigebiet im Sauerland mit 27,5 Pistenkilometern und rund 26 Liften. Ergänzt wird es durch Skidörfer wie Altastenberg und Neuastenberg.',
      plainAnswer: 'Skifahren kann man im Skiliftkarussell Winterberg (27,5 km Pisten, 26 Lifte, 6 Berge), im Skigebiet Postwiese Neuastenberg, im Skidorf Altastenberg mit dem FIS-Westfalenhang sowie am familienfreundlichen Sahnehang und an der Ruhrquelle.',
      answerHtml: (
        <div className="space-y-3">
          <p>Winterberg bietet erstklassige Wintersport-Infrastruktur mit modernster Flocken-Beschneiung:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Skiliftkarussell Winterberg:</strong> 27,5 km Pisten über 6 Berge (Herrloh, Bremberg, Kappe, Poppenberg, Sürenberg, Kahler Asten) inkl. 14 Flutlichtpisten.</li>
            <li><strong>Skigebiet Postwiese Neuastenberg:</strong> Abwechslungsreiche Abfahrten, Funpark für Snowboarder und Flutlicht.</li>
            <li><strong>Skikarussell Altastenberg:</strong> Höchstgelegenes Skidorf mit anspruchsvollen Pisten, darunter der berühmte FIS-Slalomhang <em>Westfalenhang</em>.</li>
            <li><strong>Sahnehang am Kahlen Asten:</strong> Breite, sanfte Hänge – ideal für Anfänger und Skischulkurse.</li>
            <li><strong>Skigebiet Ruhrquelle:</strong> Übersichtliches Familienskigebiet mit Sessellift direkt an der B480.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Freizeitangebote & Action', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' },
        { label: 'Hotels & Skihotels', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
      ]
    },
    nl: {
      question: 'Waar kun je skiën in Winterberg?',
      quickSummary: 'Het Skiliftkarussell Winterberg is het grootste skigebied van het Sauerland met 27,5 km pistes en 26 moderne skiliften. Daarnaast zijn er de skigebieden Postwiese in Neuastenberg en het Skidorf Altastenberg.',
      plainAnswer: 'Skiën in Winterberg: Skiliftkarussell Winterberg (27,5 km pistes over 6 bergen), Skigebied Postwiese Neuastenberg, Skidorf Altastenberg (met de steile FIS-Westfalenhang), de kindvriendelijke Sahnehang en de Ruhrquelle.',
      answerHtml: (
        <div className="space-y-3">
          <p>De skigebieden in en rondom Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Skiliftkarussell Winterberg:</strong> Het hoofdomskigebied met 27,5 km aaneengesloten pistes over 6 bergen (o.a. Bremberg, Poppenberg, Kappe en Herrloh).</li>
            <li><strong>Postwiese Neuastenberg:</strong> Veelzijdig skigebied met funpark voor snowboarders en avondskiën.</li>
            <li><strong>Altastenberg:</strong> Het hoogstgelegen skidorp van het Sauerland met onder andere de officiële FIS-slalomhelling <em>Westfalenhang</em>.</li>
            <li><strong>Sahnehang (Kahler Asten):</strong> Brede, glooiende helling met natuursneeuw, ideaal voor beginners en kinderen.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Skihotels in Winterberg', category: 'Hotels und Unterkünfte', subcategory: 'Hotels' }
      ]
    }
  },

  // ── 15. Rodeln / Sleeën ──
  {
    id: 'schlitten-fahren',
    categoryGroup: 'Wintersport & Schnee',
    de: {
      question: 'Wo kann man in Winterberg Schlitten fahren?',
      quickSummary: 'In Winterberg gibt es präparierte und beschneite Rodelhänge mit eigenen Rodelliften (z. B. am Bremberg und Herrloh) sowie Rodelmöglichkeiten in Neuastenberg und an der Ruhrquelle.',
      plainAnswer: 'Beliebte Rodelhänge mit Rodelliften und Flutlicht sind das Rodelparadies Herrloh (Lift Nr. 1), der Rodelhang Bremberg (Lift Nr. 20), die Ruhrquelle und das Rodelgebiet Postwiese Neuastenberg. Schlitten können direkt an den Talstationen geliehen werden.',
      answerHtml: (
        <div className="space-y-3">
          <p>Rodelspaß für die ganze Familie mit komfortablem Lift-Transport nach oben:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Rodelparadies Herrloh (Lift Nr. 1):</strong> Direkt unterhalb der St. Georg Schanze – beschneit und mit Flutlicht.</li>
            <li><strong>Rodelhang Bremberg (Lift Nr. 20):</strong> Breiter Rodelhang mit modernem Rodel-Förderband.</li>
            <li><strong>Rodelparadies Ruhrquelle:</strong> Eigener Rodellift mit Flutlicht und Beschneiungsanlage.</li>
            <li><strong>Naturrodelbahn Postwiese (Neuastenberg):</strong> Kurvenreiche Rodelabfahrt mit eigenem Rodellift.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Freizeitangebote & Action', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
      ]
    },
    nl: {
      question: 'Waar kun je sleeën in Winterberg?',
      quickSummary: 'Winterberg beschikt over speciale, besneeuwde rodelhellingen met rodelliften (zoals bij Herrloh en de Bremberg), evenals de rodelbaan in Neuastenberg en bij de Ruhrquelle.',
      plainAnswer: 'Beste rodelhellingen met liften: Rodelparadies Herrloh (lift 1), Bremberg rodelhang (lift 20 met overdekte transportband), Ruhrquelle en Postwiese Neuastenberg. Sleeën huurt u direct bij de kassa of de skiverhuur.',
      answerHtml: (
        <div className="space-y-3">
          <p>Sleeën zonder zelf de berg op te hoeven lopen:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Rodelparadijs Herrloh (Lift 1):</strong> Direct onder de St. Georg skischans, besneeuwd en \'s avonds verlicht.</li>
            <li><strong>Bremberg Rodelhang (Lift 20):</strong> Brede helling met comfortabele lopende band naar boven.</li>
            <li><strong>Ruhrquelle:</strong> Familie-rodelhelling direct aan de hoofdweg B480.</li>
            <li><strong>Postwiese Neuastenberg:</strong> Uitdagende natuurrodelbaan met scherpe bochten en eigen lift.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Outdoor Vrije Tijd', category: 'Freizeit', subcategory: 'Outdoor-Freizeitgebiet' }
      ]
    }
  },

  // ── 16. Skipass kaufen / Skipas kopen ──
  {
    id: 'skipass-kaufen',
    categoryGroup: 'Wintersport & Schnee',
    de: {
      question: 'Wo kann man in Winterberg einen Skipass kaufen?',
      quickSummary: 'Skipässe können online im Webshop des Skiliftkarussells gekauft oder direkt vor Ort an den zahlreichen Kassenhäuschen an allen Talstationen erworben werden.',
      plainAnswer: 'Skipässe sind online über den offiziellen Webshop der Wintersport-Arena Sauerland / Skiliftkarussell Winterberg erhältlich (oft mit Rabatt und ohne Anstehen) sowie an allen Kassen der Liftstationen (z. B. Herrloh, Bremberg, Kappe, Poppenberg, Remmeswiese).',
      answerHtml: (
        <div className="space-y-3">
          <p>Sie haben zwei bequeme Möglichkeiten, Ihren Skipass zu erwerben:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Online im Webshop (Empfehlung):</strong> Ticket vorab auf die KeyCard laden oder QR-Code am Ticket-Automaten scannen – spart Zeit an den Kassen.</li>
            <li><strong>Vor Ort an den Liftkassen:</strong> An nahezu allen Lift-Einstiegen (z. B. Parkplatz P1 bis P7, Bremberg, Herrloh, Kappe) gibt es Tageskassen für Bar- und Kartenzahlung.</li>
            <li><strong>Wintersport-Arena Card:</strong> Gültig ab 3 Tagen für das Skiliftkarussell sowie Nachbargebiete wie Neuastenberg, Altastenberg und Willingen.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Waar kun je een skipas kopen in Winterberg?',
      quickSummary: 'Skipassen koopt u het snelst online via de officiële webshop van de Skiliftkarussell (scheelt wachttijd) of direct bij de kassa\'s aan de dalstations van alle liften.',
      plainAnswer: 'Skipassen zijn online verkrijgbaar via de webshop van de Wintersport-Arena Sauerland / Skiliftkarussell Winterberg en aan alle bemande kassa\'s bij de liften (bijv. Herrloh, Bremberg, Kappe, Poppenberg).',
      answerHtml: (
        <div className="space-y-3">
          <p>Skipas aanschaffen in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Online bestellen (Aanrader):</strong> Koop uw ticket vooraf online en laad het direct op een KeyCard of print de voucher. Zo vermijdt u de rijen bij de kassa.</li>
            <li><strong>Bij de kassa aan de lift:</strong> Bij alle grote parkeerplaatsen (P1 t/m P7) en liftstations kunt u met pin of contant een dagkaart of puntenkaart kopen.</li>
            <li><strong>Wintersport-Arena Card:</strong> Vanaf 3 dagen geldig in de Skiliftkarussell én buurskigebieden zoals Neuastenberg, Altastenberg en Willingen.</li>
          </ul>
        </div>
      )
    }
  },

  // ── 17. Im Schnee spazieren gehen / Wandelen in de sneeuw ──
  {
    id: 'im-schnee-spazieren',
    categoryGroup: 'Wintersport & Schnee',
    de: {
      question: 'Wo kann man in Winterberg im Schnee spazieren gehen?',
      quickSummary: 'Winterberg bietet geräumte und gewalzte Winterwanderwege: Rund um den Kahlen Asten, auf der Hochheide Niedersfeld, durch den Kurpark Winterberg und entlang des Rothaarsteigs.',
      plainAnswer: 'Die schönsten Winterspaziergänge führen über den Kahlen Asten (Panoramaweg), durch den heilklimatischen Kurpark Winterberg, über die geräumten Wege des Rothaarsteigs sowie rund um das Skidorf Altastenberg und den Hillebachsee.',
      answerHtml: (
        <div className="space-y-3">
          <p>Winterwandern durch tief verschneite Sauerländer Bergwälder:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Kahler Asten Panoramaweg:</strong> Geräumter Höhenrundweg mit weitem Blick über die verschneite Winterlandschaft.</li>
            <li><strong>Kurpark Winterberg:</strong> Zentraler Spazierweg mit Beleuchtung in den Abendstunden.</li>
            <li><strong>Winterwanderwege Altastenberg & Neuastenberg:</strong> Schöne Rundwege abseits des Pistentrubels.</li>
            <li><strong>Rundweg Hillebachsee (Niedersfeld):</strong> Flacher, ca. 1,6 km langer Rundweg um den See.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Waar kun je in de sneeuw wandelen in Winterberg?',
      quickSummary: 'Winterberg onderhoudt speciale, geprepareerde winterwandelpaden: Rondom de Kahler Asten, in het kuurpark van Winterberg, over de Rothaarsteig en om de Hillebachsee.',
      plainAnswer: 'Mooiste winterwandelingen: 1. Panoramaroute op de top van de Kahler Asten, 2. Kuurpark Winterberg, 3. Gewalste wandelpaden rondom de skidorpjes Altastenberg en Neuastenberg, 4. Het vlakke rondje om de Hillebachsee.',
      answerHtml: (
        <div className="space-y-3">
          <p>Genieten van een wandeling door een echt winterwonderland:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Kahler Asten Panoramaroute:</strong> Een gewalst bergpad met een adembenemend uitzicht over de witte bergtoppen.</li>
            <li><strong>Kuurpark Winterberg:</strong> Makkelijk begaanbaar, centraal gelegen en \'s avonds sfeervol verlicht.</li>
            <li><strong>Winterroutes Altastenberg & Neuastenberg:</strong> Rustige routes door de besneeuwde bossen, weg van de drukte op de skipistes.</li>
            <li><strong>Hillebachsee Niedersfeld:</strong> Vlakke wandelroute van 1,6 km om het meer.</li>
          </ul>
        </div>
      )
    }
  },

  // ── 18. Wandern / Wandelen ──
  {
    id: 'wandern',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Kann man in Winterberg wandern?',
      quickSummary: 'Winterberg ist eine der bekanntesten Wanderregionen Deutschlands: Mit dem Rothaarsteig, dem Winterberger Hochtour-Rundweg (82 km) und zahlreichen heilklimatischen Kurwegen auf 450 bis 841 Metern Höhe.',
      plainAnswer: 'Winterberg ist ein erstklassiges Wanderparadies mit hunderten Kilometern zertifizierter Wanderwege. Höhepunkte sind der Rothaarsteig, der Kahler Asten, die Schlucht im Helletal, die Hochheide Niedersfeld sowie die 82 km lange Winterberger Hochtour.',
      answerHtml: (
        <div className="space-y-3">
          <p>Über 450 Kilometer markierte Wanderwege durchziehen das Stadtgebiet von Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Rothaarsteig (Weg der Sinne):</strong> Führt direkt über die Bergkämme Winterbergs und den Kahlen Asten.</li>
            <li><strong>Winterberger Hochtour:</strong> 82 km langer Qualitätswanderweg, der alle 14 Ortsteile und die höchsten Gipfel miteinander verbindet.</li>
            <li><strong>Schluchtenpfad Helletal:</strong> Wildromantischer Pfad durch eine urwüchsige Klamm mit Wasserfällen direkt am Ortsrand von Winterberg.</li>
            <li><strong>Hochheide Niedersfeld (Neuer Hagen):</strong> Die größte zusammenhängende Bergheide Nordwestdeutschlands.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Kun je mooi wandelen in Winterberg?',
      quickSummary: 'Winterberg is een van de bekendste wandelregio\'s van Duitsland: Gelegen aan de beroemde Rothaarsteig, met de 82 km lange Winterberger Hochtour en honderden kilometers bewegwijzerde wandelpaden.',
      plainAnswer: 'Wandelen in Winterberg: Honderden kilometers gemarkeerde routes, waaronder de Rothaarsteig, de top van de Kahler Asten, de wildromantische Helletal-kloof en de paarse bergheide in Niedersfeld.',
      answerHtml: (
        <div className="space-y-3">
          <p>Met meer dan 450 kilometer aan wandelpaden is Winterberg een echt wandelparadijs:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Rothaarsteig:</strong> De beroemde langeafstandswandeling loopt over de bergkammen en de Kahler Asten.</li>
            <li><strong>Winterberger Hochtour:</strong> 82 km lange gecertificeerde kwaliteitsroute langs alle 14 dorpen en de hoogste bergtoppen.</li>
            <li><strong>Helletal-kloof:</strong> Prachtig bospad langs klaterende beekjes en watervalletjes direct vanaf de rand van het centrum.</li>
            <li><strong>Hoogheide Niedersfeld:</strong> Het grootste aaneengesloten bergheidegebied van Noordwest-Duitsland.</li>
          </ul>
        </div>
      )
    }
  },

  // ── 19. See / Meer ──
  {
    id: 'see',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Gibt es in Winterberg einen See?',
      quickSummary: 'Ja, der bekannteste See ist der Hillebachsee im Ortsteil Niedersfeld mit Wasserski, Badestrand und Restaurant. In der Region liegen zudem der Hennesee und der Diemelsee.',
      plainAnswer: 'Der größte See im Stadtgebiet ist der Hillebachsee in Winterberg-Niedersfeld mit Wasserski-Anlage, Badestrand, Tretbootverleih und Rundweg. Im nahen Umland liegen außerdem der Hennesee bei Meschede und der Diemelsee.',
      answerHtml: (
        <div className="space-y-3">
          <p>Seen und Gewässer in und um Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Hillebachsee (Niedersfeld):</strong> Freizeitzentrum mit Wasserski- und Wakeboardanlage, Badebucht, Restaurant <em>High Five</em>, Spielplatz und Minigolf.</li>
            <li><strong>Ruhrquelle:</strong> Der Quellteich des Flusses Ruhr liegt nur wenige Kilometer nördlich des Stadtzentrums an der B480.</li>
            <li><strong>Sauerländer Talsperren (25–35 Min):</strong> <em>Hennesee</em> (Meschede) und <em>Diemelsee</em> bieten Schifffahrt, Segeln und Verleihstationen.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Is er een meer in Winterberg?',
      quickSummary: 'Ja, het bekendste meer is de Hillebachsee in het dorp Niedersfeld (met waterskiën, strand en horeca). In de directe regio liggen bovendien de Hennesee en de Diemelsee.',
      plainAnswer: 'Het bekendste meer binnen de gemeentegrenzen is de Hillebachsee in Niedersfeld (waterskibaan, zwembaai, waterfietsen). Iets verderop liggen de grote stuwmeren Hennesee en Diemelsee.',
      answerHtml: (
        <div className="space-y-3">
          <p>Meren en watersport in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Hillebachsee (Niedersfeld):</strong> Prachtig recreatiemeer met waterskibaan, zandstrand, restaurant <em>High Five</em> en wandelpad.</li>
            <li><strong>Bron van de Ruhr (Ruhrquelle):</strong> De idyllische bron van de rivier de Ruhr net buiten het centrum.</li>
            <li><strong>Grote stuwmeren (ca. 25-35 min):</strong> <em>Hennesee</em> en <em>Diemelsee</em> met rondvaartboten en zeilmogelijkheden.</li>
          </ul>
        </div>
      )
    }
  },

  // ── 20. Badesee / Zwemmeer ──
  {
    id: 'badesee',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Gibt es in Winterberg einen Badesee?',
      quickSummary: 'Ja! Der Hillebachsee in Winterberg-Niedersfeld verfügt über eine ausgewiesene Badebucht mit Sandstrand, Liegewiese und geprüfter Wasserqualität.',
      plainAnswer: 'Der offizielle Badesee in Winterberg ist der Hillebachsee in Niedersfeld. Der Eintritt zum Badestrand ist kostenlos. Vor Ort gibt es sanitäre Anlagen, Umkleiden, einen Kiosk, Wassersport und einen großen Spielplatz.',
      answerHtml: (
        <div className="space-y-3">
          <p>Badespaß in sauberem Bergquellwasser am Hillebachsee in Niedersfeld:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Badebucht & Sandstrand:</strong> Flach abfallender Sandstrand – ideal für Kinder und Nichtschwimmer.</li>
            <li><strong>Kostenloser Zugang:</strong> Der Eintritt zum See und zur Liegewiese ist frei.</li>
            <li><strong>Infrastruktur:</strong> WC-Anlagen, Außenduschen, Restaurant mit Seeterrasse und Wasserski-Station.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Is er een zwemmeer in Winterberg?',
      quickSummary: 'Ja! De Hillebachsee in Winterberg-Niedersfeld heeft een officiële zwembaai met een fijn zandstrand, ligweide en uitstekende waterkwaliteit.',
      plainAnswer: 'Het officiële zwemmeer is de Hillebachsee in Niedersfeld. Toegang tot het strand en de ligweide is gratis. Er zijn douches, toiletten, een horecagelegenheid en waterskivoorzieningen.',
      answerHtml: (
        <div className="space-y-3">
          <p>Zwemmen in natuurwater bij de Hillebachsee in Niedersfeld:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Zandstrand & Zwembaai:</strong> Langzaam aflopend water, ideaal en veilig voor kleine kinderen.</li>
            <li><strong>Gratis toegang:</strong> De ligweide en het strand zijn gratis toegankelijk.</li>
            <li><strong>Voorzieningen:</strong> Kleedruimtes, toiletten, buitendouches en restaurant met terras aan het water.</li>
          </ul>
        </div>
      )
    }
  },

  // ── 21. Freibad / Buitenzwembad ──
  {
    id: 'freibad',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Gibt es in Winterberg ein Freibad?',
      quickSummary: 'In Winterberg-Siedlinghausen gibt es ein beheiztes Freibad mit 25m-Becken und Liegewiese. Zudem bietet das Oversum ein Außenbecken.',
      plainAnswer: 'Ein klassisches beheiztes Freibad befindet sich im Ortsteil Siedlinghausen mit 25-Meter-Schwimmbecken, Sprungturm und Liegewiese. Zudem bietet das Oversum Vital Resort ein beheiztes Außen-Entspannungsbecken.',
      answerHtml: (
        <div className="space-y-3">
          <p>Freibäder im Stadtgebiet von Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Freibad Siedlinghausen:</strong> Beheiztes Freibad mit 25-Meter-Becken, Nichtschwimmerbereich, Sprunganlage und Liegewiese.</li>
            <li><strong>Außenbecken im Oversum:</strong> Beheiztes Außen-Relaxbecken im Wellnessbereich des Oversum Vital Resorts.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Is er een buitenzwembad in Winterberg?',
      quickSummary: 'In het dorp Siedlinghausen (gemeente Winterberg) ligt een verwarmd openluchtzwembad met een 25m bad, duikplank en grote ligweide.',
      plainAnswer: 'In Winterberg-Siedlinghausen bevindt zich een verwarmd buitenzwembad met 25-meterbad, duiktoren en peuterbad. Daarnaast heeft het Oversum een verwarmd buitenbad.',
      answerHtml: (
        <div className="space-y-3">
          <p>Buitenzwembaden in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Freibad Siedlinghausen:</strong> Verwarmd openluchtbad met 25m wedstrijdbad, duiktoren en peuterbad.</li>
            <li><strong>Buitenbad Oversum:</strong> Verwarmd buitenrelaxbad als onderdeel van het Oversum Vital Resort.</li>
          </ul>
        </div>
      )
    }
  },

  // ── 22. Schwimmbad / Overdekt zwembad ──
  {
    id: 'schwimmbad',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Gibt es in Winterberg ein Schwimmbad?',
      quickSummary: 'Ja, das Hallenbad im Oversum Vital Resort verfügt über ein 25-Meter-Sportbecken, Erlebnisbecken und eine weitläufige Saunalandschaft.',
      plainAnswer: 'Das moderne Hallenbad im Oversum Vital Resort im Zentrum von Winterberg bietet ein 25-Meter-Sportbecken, Kinderbecken, Whirlpool, Erlebnisbecken sowie einen großen Sauna- und Wellnessbereich.',
      answerHtml: (
        <div className="space-y-3">
          <p>Das städtische Hallenbad im spektakulären Rundbau des Oversum Vital Resorts:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Sport & Spaß:</strong> 25-Meter-Schwimmbecken mit 4 Bahnen, Lehrschwimmbecken und Kinderbereich.</li>
            <li><strong>Saunawelt & Spa:</strong> Finnische Sauna, Biosauna, Dampfbad, Ruheräume und Massageangebote.</li>
            <li><strong>Zentrale Lage:</strong> Direkt am Kurpark Winterberg gelegen mit eigenem Parkhaus.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Is er een overdekt zwembad in Winterberg?',
      quickSummary: 'Ja! Het moderne overdekte zwembad in het Oversum Vital Resort beschikt over een 25m sportbad, peuterbad, bubbelbad en een luxe saunalandschap.',
      plainAnswer: 'Het overdekte zwembad van Winterberg bevindt zich in het Oversum Vital Resort (Am Kurpark 6) met 25m wedstrijdbad, belevingsbad, kinderbad en een uitgebreid saunacomplex.',
      answerHtml: (
        <div className="space-y-3">
          <p>Zwemmen in het overdekte zwembad van het Oversum:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Zwembaden:</strong> 25-meter sportbad met banen, instructiebad en peuterbad.</li>
            <li><strong>Saunalandschap:</strong> Verschillende sauna\'s, stoombad en relaxruimtes met panoramisch uitzicht.</li>
            <li><strong>Locatie:</strong> Direct aan het kuurpark in het centrum van Winterberg.</li>
          </ul>
        </div>
      )
    }
  },

  // ── 23. Shoppen / Winkelen ──
  {
    id: 'shoppen',
    categoryGroup: 'Einkaufen & Shopping',
    de: {
      question: 'Kann man in Winterberg shoppen?',
      quickSummary: 'Ja, Winterberg bietet eine lebendige Einkaufsmeile entlang der Straße Am Waltenberg und rund um die Untere Pforte mit Sportfachgeschäften, Modegeschäften, Souvenirs und regionalen Köstlichkeiten.',
      plainAnswer: 'Shoppen kann man hervorragend entlang der Flaniermeile Am Waltenberg und der Hauptstraße. Hier finden sich Sport- und Outdoorläden, Boutiquen, Modehäuser, Schuhgeschäfte, Deko- und Geschenkeläden sowie Spezialitätengeschäfte.',
      answerHtml: (
        <div className="space-y-3">
          <p>Vielfältige Einkaufsmöglichkeiten in der Winterberger Innenstadt:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Sport- & Outdoorbekleidung:</strong> Große Sportfachgeschäfte mit Skibekleidung, Wanderausrüstung und Bikes.</li>
            <li><strong>Mode & Fashion:</strong> Boutiquen und Bekleidungsgeschäfte für Damen-, Herren- und Kindermode.</li>
            <li><strong>Regionale Spezialitäten:</strong> Sauerländer Schinken, Spirituosen, Senf, Honig und Schokolade.</li>
            <li><strong>Sonntags-Shopping:</strong> In den touristischen Saisonmonaten haben viele Geschäfte auch sonntags geöffnet.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Einzelhandel & Mode in Winterberg', category: 'Einzelhandel' }
      ]
    },
    nl: {
      question: 'Kun je winkelen in Winterberg?',
      quickSummary: 'Jazeker! Aan de winkelstraat Am Waltenberg en het centrale marktplein vindt u volop sportzaken, boetieks, kledingwinkels, schoenenzaken en streekwinkels.',
      plainAnswer: 'Winkelen in Winterberg: Aan de levendige flaneerstraat Am Waltenberg vindt u outdoor- en sportzaken, modeboetieks, schoenenwinkels, chocolatiers en winkels met typische Sauerlandse streekproducten.',
      answerHtml: (
        <div className="space-y-3">
          <p>Gezellig shoppen in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Sport & Outdoor:</strong> Grote speciaalzaken voor ski- en fietskleding, wandelschoenen en outdoor-uitrusting.</li>
            <li><strong>Mode & Kleding:</strong> Dames- en herenmode, schoenen en accessoires.</li>
            <li><strong>Streekproducten & Cadeaus:</strong> Sauerlandse ham, likeuren, honing, handgemaakte bonbons en souvenirs.</li>
            <li><strong>Zondags geopend:</strong> Veel winkels zijn \'s zondags tussen 11:00 en 17:00 uur geopend.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Winkels & Modezaken bekijken', category: 'Einzelhandel' }
      ]
    }
  },

  // ── 24. ALDI ──
  {
    id: 'aldi',
    categoryGroup: 'Einkaufen & Shopping',
    de: {
      question: 'Gibt es in Winterberg einen ALDI?',
      quickSummary: 'Ja, ein moderner ALDI Nord Supermarkt befindet sich in der Remmeswiese 23 mit großem kostenlosem Parkplatz.',
      plainAnswer: 'Ja, es gibt einen modernen ALDI Nord Markt in Winterberg (Adresse: Remmeswiese 23, 59955 Winterberg). Geöffnet montags bis samstags von 07:00 bis 20:00 Uhr.',
      answerHtml: (
        <div className="space-y-3">
          <p>ALDI Nord in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Adresse:</strong> Remmeswiese 23, 59955 Winterberg.</li>
            <li><strong>Öffnungszeiten:</strong> Montag bis Samstag 07:00 – 20:00 Uhr (Sonntags geschlossen).</li>
            <li><strong>Ausstattung:</strong> Backstation, breite Gänge, barrierefreier Zugang, großer kostenloser Parkplatz.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Supermärkte in Winterberg', category: 'Einzelhandel', subcategory: 'Supermarkt' }
      ]
    },
    nl: {
      question: 'Is er een ALDI in Winterberg?',
      quickSummary: 'Ja, er is een grote en moderne ALDI Nord aan de Remmeswiese 23 in Winterberg met een ruime gratis parkeerplaats.',
      plainAnswer: 'Ja, de ALDI Nord bevindt zich aan de Remmeswiese 23 in Winterberg. Geopend van maandag t/m zaterdag van 07:00 tot 20:00 uur (zondag gesloten).',
      answerHtml: (
        <div className="space-y-3">
          <p>ALDI Nord in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Adres:</strong> Remmeswiese 23, 59955 Winterberg.</li>
            <li><strong>Openingstijden:</strong> Maandag t/m zaterdag van 07:00 tot 20:00 uur.</li>
            <li><strong>Parkeren:</strong> Ruime gratis parkeerplaats direct voor de deur.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Supermarkten in Winterberg', category: 'Einzelhandel', subcategory: 'Supermarkt' }
      ]
    }
  },

  // ── 25. LIDL ──
  {
    id: 'lidl',
    categoryGroup: 'Einkaufen & Shopping',
    de: {
      question: 'Gibt es in Winterberg einen LIDL?',
      quickSummary: 'Ja, eine moderne LIDL-Filiale befindet sich in der Remmeswiese 19 direkt neben ALDI mit großer Frischeabteilung und Parkplatz.',
      plainAnswer: 'Ja, in Winterberg gibt es einen großen LIDL Markt (Adresse: Remmeswiese 19, 59955 Winterberg). Geöffnet montags bis samstags von 07:00 bis 21:00 Uhr.',
      answerHtml: (
        <div className="space-y-3">
          <p>LIDL in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Adresse:</strong> Remmeswiese 19, 59955 Winterberg.</li>
            <li><strong>Öffnungszeiten:</strong> Montag bis Samstag 07:00 – 21:00 Uhr (Sonntags geschlossen).</li>
            <li><strong>Ausstattung:</strong> Eigene Backstation, Obst- & Gemüse-Frischetheke, großer Parkplatz mit E-Ladesäulen.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Supermärkte in Winterberg', category: 'Einzelhandel', subcategory: 'Supermarkt' }
      ]
    },
    nl: {
      question: 'Is er een LIDL in Winterberg?',
      quickSummary: 'Ja, er is een moderne LIDL-supermarkt aan de Remmeswiese 19 (direct naast de ALDI) met verse bakkerij en gratis parkeerplaatsen.',
      plainAnswer: 'Ja, de LIDL bevindt zich aan de Remmeswiese 19 in Winterberg. Geopend van maandag t/m zaterdag van 07:00 tot 21:00 uur.',
      answerHtml: (
        <div className="space-y-3">
          <p>LIDL in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Adres:</strong> Remmeswiese 19, 59955 Winterberg.</li>
            <li><strong>Openingstijden:</strong> Maandag t/m zaterdag van 07:00 tot 21:00 uur.</li>
            <li><strong>Voorzieningen:</strong> Grote verse bakkerijhoek, ruime gratis parkeerplaats en laadpalen voor elektrische auto\'s.</li>
          </ul>
        </div>
      ),
      relatedCategoryLinks: [
        { label: 'Supermarkten in Winterberg', category: 'Einzelhandel', subcategory: 'Supermarkt' }
      ]
    }
  },

  // ── 26. Parken / Parkeren ──
  {
    id: 'parken',
    categoryGroup: 'Anreise & Parken',
    de: {
      question: 'Wo kann man in Winterberg parken?',
      quickSummary: 'In Winterberg gibt es über 5.000 Parkplätze: Gekennzeichnete Großparkplätze (P1 bis P7) direkt an den Liften sowie zentrale Parkhäuser und Parkplätze im Stadtzentrum.',
      plainAnswer: 'Für Skifahrer und Ausflügler stehen die Großparkplätze P1 bis P7 (z. B. Bremberg, Herrloh, Kappe, Remmeswiese) zur Verfügung. Im Stadtzentrum parkt man im Parkhaus Oversum, am Parkplatz Zentrum oder an der Unteren Pforte.',
      answerHtml: (
        <div className="space-y-3">
          <p>Überblick über die wichtigsten Parkmöglichkeiten:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Skigebiet & Erlebnisberg (P1–P7):</strong> Parkplatz Bremberg (P1, P2), Herrloh (P3, P4), Kappe (P5) und Remmeswiese (P6, P7).</li>
            <li><strong>Stadtzentrum & Shopping:</strong> Parkhaus <em>Oversum</em> (Tiefgarage) und Parkplatz <em>Zentrum</em>.</li>
            <li><strong>Parkgebühren:</strong> An den Skiliften und im Zentrum meist gebührenpflichtig (Bar, EC-Karte oder via Park-App).</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Waar kun je parkeren in Winterberg?',
      quickSummary: 'In Winterberg zijn meer dan 5.000 parkeerplaatsen: Grote gemarkeerde parkeerterreinen (P1 t/m P7) direct bij de skiliften en attracties, plus parkeergarages in het centrum.',
      plainAnswer: 'Voor skiërs en bezoekers zijn er de grote parkeerplaatsen P1 t/m P7 (bijv. Bremberg, Herrloh, Kappe, Remmeswiese). In het centrum parkeert u in de parkeergarage onder het Oversum of bij de Untere Pforte.',
      answerHtml: (
        <div className="space-y-3">
          <p>Belangrijkste parkeerlocaties in Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Skiliften & Erlebnisberg Kappe (P1–P7):</strong> Parkeerterreinen direct aan de pistes bij Bremberg, Herrloh, Kappe en Remmeswiese.</li>
            <li><strong>Centrum & Winkels:</strong> Parkeergarage <em>Oversum</em> (ondergronds) en parkeerterrein <em>Zentrum</em>.</li>
            <li><strong>Betalen:</strong> Betaald parkeren via automaten (muntgeld, pin) of via handige parkeerapps (zoals EasyPark).</li>
          </ul>
        </div>
      )
    }
  },

  // ── 27. Bahnhof / Treinstation ──
  {
    id: 'bahnhof',
    categoryGroup: 'Anreise & Parken',
    de: {
      question: 'Gibt es in Winterberg einen Bahnhof?',
      quickSummary: 'Ja, der Bahnhof Winterberg (Westfalen) ist die Endstation der Oberen Ruhrtalbahn mit direkten Regionalexpress-Verbindungen von Hagen, Dortmund und Bestwig.',
      plainAnswer: 'Ja, Winterberg besitzt einen modernen barrierefreien Bahnhof (Winterberg Westf). Es gibt regelmäßige Verbindungen mit dem Sauerland-Express (RE 57 / RB 57) aus Richtung Dortmund, Hagen und Kassel.',
      answerHtml: (
        <div className="space-y-3">
          <p>Anreise mit der Bahn nach Winterberg:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Direktverbindungen:</strong> Regelmäßige Züge von Hagen Hbf, Dortmund Hbf und Bestwig.</li>
            <li><strong>Lage & Anbindung:</strong> Nur ca. 500 Meter vom Marktplatz entfernt; direkter Busbahnhof (ZOB) vor dem Bahnhofsgebäude.</li>
            <li><strong>Bürgerbahnhof:</strong> Im Bahnhofsgebäude befindet sich ein Restaurant, Kiosk sowie die Touristen-Information.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Heeft Winterberg een treinstation?',
      quickSummary: 'Ja, het station Winterberg (Westfalen) is het eindpunt van de spoorlijn en biedt regelmatige treinverbindingen vanuit Dortmund en Hagen.',
      plainAnswer: 'Ja, Winterberg heeft een modern en rolstoeltoegankelijk treinstation (Winterberg Westf). Er rijden directe stoptreinen en regiotreinen (RE 57 / RB 57) vanuit Dortmund en Hagen.',
      answerHtml: (
        <div className="space-y-3">
          <p>Bereikbaarheid met de trein:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Verbindingen:</strong> Treinen vanuit Dortmund en Hagen (overstap in Bestwig of directe ritten).</li>
            <li><strong>Ligging:</strong> Slechts 500 meter van het centrum en de winkels, met busstation (ZOB) direct voor de deur.</li>
            <li><strong>Voorzieningen:</strong> Horecagelegenheid, kiosk en openbare toiletten in het stationsgebouw.</li>
          </ul>
        </div>
      )
    }
  },

  // ── 28. Skisprungschanze / Skischans ──
  {
    id: 'skisprungschanze',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Gibt es in Winterberg eine Skisprungschanze?',
      quickSummary: 'Ja, die berühmte St. Georg Schanze (K-Punkt 80 m) thront auf dem Herrloh über Winterberg mit Aussichtsplattform und Restaurant.',
      plainAnswer: 'Ja, das Wahrzeichen von Winterberg ist die St. Georg Schanze am Herrloh. Der Schanzenturm bietet eine Aussichtsplattform mit Blick über das Sauerland sowie ein Panoramarestaurant an der Schanze.',
      answerHtml: (
        <div className="space-y-3">
          <p>Die St. Georg Schanze am Herrloh:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Aussichtsplattform:</strong> Der Schanzenturm kann bestiegen werden und bietet einen grandiosen Rundumblick.</li>
            <li><strong>Ganzjahresbetrieb:</strong> Dank Mattenbelag kann die Schanze auch im Sommer für Trainingssprünge genutzt werden.</li>
            <li><strong>Gastronomie:</strong> Restaurant <em>Schanzentreff</em> direkt am Auslauf.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Is er een skischans in Winterberg?',
      quickSummary: 'Ja, de beroemde St. Georg Schanze (K-punt 80 meter) torent hoog boven Winterberg uit op de Herrloh-berg, compleet met uitkijkplatform.',
      plainAnswer: 'Ja, het markante herkenningspunt van Winterberg is de St. Georg Schanze op de Herrloh. De toren heeft een uitkijkplatform en eronder ligt een gezellig restaurant.',
      answerHtml: (
        <div className="space-y-3">
          <p>De St. Georg Skischans op de Herrloh:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Uitkijkplatform:</strong> U kunt de toren beklimmen voor een prachtig uitzicht over de stad en de bergen.</li>
            <li><strong>Zomertraining:</strong> Dankzij kunststof matten trainen sporters hier ook in de zomermaanden.</li>
          </ul>
        </div>
      )
    }
  },

  // ── 29. Weihnachtsmarkt / Kerstmarkt ──
  {
    id: 'weihnachtsmarkt',
    categoryGroup: 'Freizeit & Natur',
    de: {
      question: 'Gibt es in Winterberg einen Weihnachtsmarkt?',
      quickSummary: 'Ja, das Winterberger Winterdorf verwandelt den Marktplatz (Untere Pforte) von Mitte Dezember bis Anfang Januar in ein stimmungsvolles Winter- und Weihnachtsdorf mit Eisbahn und Holzhütten.',
      plainAnswer: 'Ja, das „Winterberger Winterdorf“ findet jährlich von Mitte Dezember bis nach Neujahr auf dem Marktplatz Untere Pforte statt – mit Glühweinhütten, Kunsthandwerk, kulinarischen Leckereien und einer Eisbahn.',
      answerHtml: (
        <div className="space-y-3">
          <p>Das Winterberger Winterdorf auf dem Marktplatz:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Termin:</strong> Mitte Dezember bis Anfang Januar (täglich geöffnet).</li>
            <li><strong>Highlights:</strong> Eislaufbahn mitten auf dem Marktplatz, festlich geschmückte Fachwerkhütten, Winzer-Glühwein, Live-Musik und Kinderkarussell.</li>
          </ul>
        </div>
      )
    },
    nl: {
      question: 'Is er een kerstmarkt in Winterberg?',
      quickSummary: 'Ja! Het sfeervolle „Winterberger Winterdorf“ tovert het marktplein (Untere Pforte) van half december tot begin januari om in een gezellig kerstdorp met ijsbaan en houten chalets.',
      plainAnswer: 'Ja, het Winterberger Winterdorf vindt jaarlijks plaats van half december tot begin januari op het marktplein. Met glühweinkraampjes, ambachtslieden, lekkernijen en een schaatsbaan.',
      answerHtml: (
        <div className="space-y-3">
          <p>Het Winterberger Winterdorf op het marktplein:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Periode:</strong> Midden december t/m begin januari.</li>
            <li><strong>Sfeer & Activiteiten:</strong> Schaatsbaan, sfeervolle verlichting, warme glühwein en braadworst, liveoptredens en kinderactiviteiten.</li>
          </ul>
        </div>
      )
    }
  }
];

export const CATEGORY_GROUPS_CONFIG: { 
  id: FaqCategoryKey | 'Alle'; 
  deLabel: string; 
  nlLabel: string; 
  icon: any 
}[] = [
  { id: 'Alle', deLabel: 'Alle Fragen', nlLabel: 'Alle vragen', icon: HelpCircle },
  { id: 'Freizeit & Natur', deLabel: 'Freizeit & Natur', nlLabel: 'Vrije tijd & Natuur', icon: Compass },
  { id: 'Essen & Trinken', deLabel: 'Essen & Trinken', nlLabel: 'Eten & Drinken', icon: Utensils },
  { id: 'Wintersport & Schnee', deLabel: 'Wintersport & Schnee', nlLabel: 'Wintersport & Sneeuw', icon: Snowflake },
  { id: 'Einkaufen & Shopping', deLabel: 'Einkaufen & Shopping', nlLabel: 'Winkelen & Shopping', icon: ShoppingBag },
  { id: 'Anreise & Parken', deLabel: 'Anreise & Parken', nlLabel: 'Bereikbaarheid & Parkeren', icon: Car },
];

interface WinterbergFaqProps {
  theme: ThemeConfig;
  activeThemeKey: string;
  lang?: 'de' | 'nl';
  onBack: () => void;
  onSelectCategory: (category: string, subcategory?: string) => void;
}

export default function WinterbergFaq({ 
  theme, 
  activeThemeKey, 
  lang = 'de', 
  onBack, 
  onSelectCategory 
}: WinterbergFaqProps) {
  const isNl = lang === 'nl';
  const [selectedGroup, setSelectedGroup] = useState<FaqCategoryKey | 'Alle'>('Alle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set());

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesGroup = selectedGroup === 'Alle' || item.categoryGroup === selectedGroup;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesGroup;
      
      const content = isNl ? item.nl : item.de;
      const matchesSearch = 
        content.question.toLowerCase().includes(q) ||
        content.quickSummary.toLowerCase().includes(q) ||
        content.plainAnswer.toLowerCase().includes(q) ||
        item.categoryGroup.toLowerCase().includes(q);

      return matchesGroup && matchesSearch;
    });
  }, [selectedGroup, searchQuery, isNl]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenFaqIds(new Set(filteredFaqs.map(f => f.id)));
  };

  const collapseAll = () => {
    setOpenFaqIds(new Set());
  };

  // Schema.org FAQPage JSON-LD
  const faqSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': FAQ_DATA.map(item => {
        const c = isNl ? item.nl : item.de;
        return {
          '@type': 'Question',
          'name': c.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': c.plainAnswer
          }
        };
      })
    };
  }, [isNl]);

  return (
    <main className="flex-1 w-full max-w-[1040px] mx-auto px-4 md:px-6 py-8 md:py-12 pb-20">
      {/* Schema.org FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[13.5px] font-medium text-[#5F6B63] hover:text-[#0F4C2E] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isNl ? 'Terug naar het overzicht' : 'Zurück zum Verzeichnis'}
        </button>
        <span className="text-[#5F6B63]/40">/</span>
        <span className="text-[13.5px] text-[#0F4C2E] font-semibold">
          {isNl ? 'Veelgestelde Vragen (FAQ)' : 'Winterberg FAQs'}
        </span>
      </div>

      {/* Page Header */}
      <div className="bg-white border border-[#EDE8E0] rounded-lg p-6 md:p-10 shadow-[0_10px_30px_rgba(27,33,29,0.04)] mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F4C2E]/10 text-[#0F4C2E] text-xs font-bold tracking-wide uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#F2761B]" />
          {isNl ? 'Winterberg Gids & FAQ' : 'Winterberg Ratgeber & FAQ'}
        </div>
        <h1 className="font-display text-[28px] md:text-[42px] font-bold tracking-tight text-[#1B211D] mb-3 leading-tight">
          {isNl ? 'Veelgestelde vragen over Winterberg' : 'Häufig gestellte Fragen zu Winterberg'}
        </h1>
        <p className="text-[15px] md:text-[17px] leading-relaxed text-[#4A544D] max-w-[78ch] mb-6">
          {isNl 
            ? 'Alles wat u moet weten over activiteiten in de zomer, regenachtige dagen, vakantie met kinderen of hond, skiën, rodelen, restaurants, zondagsopening en praktische tips voor uw verblijf in Winterberg.'
            : 'Alles Wichtige rund um Aktivitäten im Sommer, Regentage, Urlaub mit Kindern oder Hund, Skifahren, Rodeln, Restaurants, Sonntagsöffnung, Shopping und praktische Tipps für Ihren Aufenthalt in Winterberg.'}
        </p>

        {/* Live Search Bar */}
        <div className="relative w-full max-w-[650px]">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isNl 
              ? 'Zoek een vraag of trefwoord (bijv. regen, zomer, kinderen, hond, skiën, zondag)...' 
              : 'Frage oder Stichwort suchen (z.B. Regen, Sommer, Kinder, Hund, Schlitten, Parken, Sonntag)...'}
            className="w-full pl-12 pr-10 py-3 bg-[#FAF8F5] border border-[#D8D2C8] rounded-md text-[15px] text-[#1B211D] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C2E] focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 rounded px-2 py-0.5"
            >
              {isNl ? 'Wissen' : 'Löschen'}
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex flex-wrap items-center gap-2 md:gap-2.5 mb-6">
        {CATEGORY_GROUPS_CONFIG.map(group => {
          const Icon = group.icon;
          const isActive = selectedGroup === group.id;
          const label = isNl ? group.nlLabel : group.deLabel;
          const count = group.id === 'Alle' 
            ? FAQ_DATA.length 
            : FAQ_DATA.filter(f => f.categoryGroup === group.id).length;

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedGroup(group.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-[14px] font-medium transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#0F4C2E] text-white border-[#0F4C2E] shadow-sm'
                  : 'bg-white text-[#4A544D] border-[#EDE8E0] hover:border-[#0F4C2E]/40 hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2761B]' : 'text-[#5F6B63]'}`} />
              <span>{label}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Bar (Results Count & Expand/Collapse) */}
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-[14px] text-[#5F6B63] font-medium">
          {filteredFaqs.length} {filteredFaqs.length === 1 ? (isNl ? 'vraag' : 'Frage') : (isNl ? 'vragen' : 'Fragen')} {selectedGroup !== 'Alle' ? (isNl ? `in „${CATEGORY_GROUPS_CONFIG.find(g => g.id === selectedGroup)?.nlLabel}“` : `in „${selectedGroup}“`) : ''} {isNl ? 'gevonden' : 'gefunden'}
        </span>
        <div className="flex gap-3 text-xs font-semibold text-[#0F4C2E]">
          <button
            type="button"
            onClick={expandAll}
            className="hover:underline cursor-pointer"
          >
            {isNl ? 'Alles openen' : 'Alle öffnen'}
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={collapseAll}
            className="hover:underline cursor-pointer"
          >
            {isNl ? 'Alles sluiten' : 'Alle schließen'}
          </button>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white border border-dashed border-[#D8D2C8] rounded-lg p-10 text-center text-[#5F6B63]">
            <HelpCircle className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-lg text-gray-700 mb-1">
              {isNl ? 'Geen passende vraag gevonden' : 'Keine passende Frage gefunden'}
            </p>
            <p className="text-sm">
              {isNl 
                ? 'Probeer een ander trefwoord of kies „Alle vragen“.' 
                : 'Versuchen Sie einen anderen Suchbegriff oder wählen Sie „Alle Fragen“ aus.'}
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedGroup('Alle'); }}
              className="mt-4 px-4 py-2 bg-[#0F4C2E] text-white text-sm font-semibold rounded-md cursor-pointer"
            >
              {isNl ? 'Filters wissen' : 'Filter zurücksetzen'}
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openFaqIds.has(faq.id);
            const prevFaq = index > 0 ? filteredFaqs[index - 1] : null;
            const isNewCategory = prevFaq && prevFaq.categoryGroup !== faq.categoryGroup;
            const groupDef = CATEGORY_GROUPS_CONFIG.find(g => g.id === faq.categoryGroup);
            const GroupIcon = groupDef?.icon || HelpCircle;
            const categoryLabel = isNl ? groupDef?.nlLabel : groupDef?.deLabel;
            const content = isNl ? faq.nl : faq.de;

            return (
              <React.Fragment key={faq.id}>
                {/* Dotted separator between different question categories */}
                {isNewCategory && (
                  <div className="pt-7 pb-3">
                    <div className="w-full border-t-2 border-dotted border-[#D4CEBF] mb-4" />
                    <div className="flex items-center gap-2.5 text-[#0F4C2E] font-bold text-[13.5px] tracking-wider uppercase">
                      <GroupIcon className="w-4 h-4 text-[#0F4C2E]" />
                      <span>{categoryLabel}</span>
                    </div>
                  </div>
                )}

                <div
                  id={faq.id}
                  className="bg-white border border-[#EDE8E0] rounded-lg overflow-hidden transition-all duration-200 shadow-[0_2px_8px_rgba(27,33,29,0.03)] hover:border-[#0F4C2E]/40"
                >
                  {/* Header / Question Bar - Einzeilig */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className={`w-full text-left p-4 md:p-5 flex justify-between items-center gap-3 md:gap-4 cursor-pointer focus:outline-none transition-colors ${
                      isOpen 
                        ? 'bg-[#F2EFE8] border-b border-[#E3DDD1]' 
                        : 'bg-[#FAF8F5] hover:bg-[#F2EFE8]'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-2.5 md:gap-3 min-w-0 flex-1 overflow-hidden">
                      <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#0F4C2E] bg-white border border-[#0F4C2E]/25 px-2.5 py-0.5 rounded shadow-2xs">
                        {categoryLabel}
                      </span>
                      <h2 
                        className="font-display text-[15.5px] sm:text-[17px] md:text-[18.5px] font-bold text-[#1B211D] m-0 truncate whitespace-nowrap"
                        title={content.question}
                      >
                        {content.question}
                      </h2>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 shadow-2xs ${
                      isOpen 
                        ? 'rotate-180 bg-[#0F4C2E] text-white border border-[#0F4C2E]' 
                        : 'bg-white border border-[#EDE8E0] text-[#0F4C2E]'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Body / Answer */}
                  {isOpen && (
                    <div>
                      {/* Middle content on clean white */}
                      <div className="bg-white px-5 md:px-7 py-6 text-[#4A544D]">
                        {/* Quick Summary Box */}
                        <div className="bg-[#FAF8F5] border-l-4 border-[#0F4C2E] p-4 rounded-r-md text-[15px] font-medium text-[#1B211D] leading-relaxed shadow-2xs">
                          {content.quickSummary}
                        </div>

                        {/* Detailed HTML Content */}
                        <div className="mt-5 text-[15px] leading-relaxed text-[#3C443F]">
                          {content.answerHtml}
                        </div>
                      </div>

                      {/* Category Cross-Links */}
                      {content.relatedCategoryLinks && content.relatedCategoryLinks.length > 0 && (
                        <div className="bg-[#EBF3EE] border-t border-[#CBE0D3] px-5 md:px-7 py-4.5">
                          <span className="text-[12px] font-bold uppercase tracking-wider text-[#0F4C2E] block mb-2.5">
                            {isNl ? 'Relevante bedrijven in de gids:' : 'Passende Unternehmen im Verzeichnis:'}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {content.relatedCategoryLinks.map((link, idx) => (
                              <a
                                key={idx}
                                href={`/${encodeURIComponent(link.category)}${link.subcategory ? `/${encodeURIComponent(link.subcategory)}` : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onSelectCategory(link.category, link.subcategory);
                                }}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white hover:bg-[#0F4C2E] hover:text-white border border-[#BED7C7] hover:border-[#0F4C2E] text-[#0F4C2E] text-[13.5px] font-semibold transition-all shadow-2xs group"
                              >
                                <span>{link.label}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-[#0F4C2E] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Footer Call to Action / Help Box */}
      <div className="mt-12 bg-gradient-to-br from-[#06301C] to-[#0F4C2E] text-white rounded-lg p-8 text-center md:text-left md:flex justify-between items-center gap-6 shadow-xl">
        <div>
          <h3 className="font-display text-2xl font-bold mb-2">
            {isNl ? 'Heeft u een bedrijf in Winterberg?' : 'Haben Sie ein Unternehmen in Winterberg?'}
          </h3>
          <p className="text-white/80 text-sm max-w-xl">
            {isNl 
              ? 'Presenteer uw winkel, hotel, restaurant of vakbedrijf in de Winterberg Bedrijvengids en word direct gevonden bij relevante Google-zoekopdrachten.'
              : 'Präsentieren Sie Ihr Geschäft, Restaurant oder Handwerksbetrieb im Winterberg Verzeichnis und werden Sie bei relevanten Google-Suchanfragen gefunden.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onSelectCategory('Alle');
            window.history.pushState(null, '', isNl ? '/nl/bedrijf-aanmelden' : '/eintragen');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="mt-4 md:mt-0 px-5 py-2.5 bg-[#F2761B] hover:bg-[#d96512] text-white font-bold text-sm rounded-md whitespace-nowrap transition-colors shadow-md cursor-pointer"
        >
          {isNl ? 'Bedrijf aanmelden' : 'Unternehmen eintragen'}
        </button>
      </div>
    </main>
  );
}
