import { Business } from '../types';

/**
 * ============================================================================
 * SEARCH INTENT ONTOLOGY
 * ----------------------------------------------------------------------------
 * Maps what a user NEEDS (a product, a dish, a problem, a service) to the
 * TYPE OF BUSINESS that fulfils it.
 *
 *   "Hose"               -> Bekleidungsgeschäfte
 *   "Sportschuhe"        -> Sportgeschäfte (+ Schuhgeschäfte as secondary)
 *   "Nägel und Schrauben"-> Baumarkt / Eisenwaren
 *   "Imbiss"             -> alle Imbisse
 *   "Zahnschmerzen"      -> Zahnärzte
 *
 * Triggers are matched against the user's tokens (exact, plural-stripped and
 * as compound suffix, e.g. "Jeanshose" -> "hose").
 * Targets are matched against the business taxonomy (subcategory / category)
 * and against name / services / products keywords.
 * ============================================================================
 */

export interface IntentTarget {
  /** Exact subcategory names (main or additional categories) */
  subcategories?: string[];
  /** Exact main category names (main or additional categories) */
  categories?: string[];
  /**
   * Keywords matched as whole words in name, subcategory, services & products.
   * A trailing '*' allows prefix matching (e.g. 'schuhhaus*' matches 'Schuhhaus & Orthopädie').
   */
  keywords?: string[];
  weight: number;
}

export interface SearchIntent {
  id: string;
  label: string;
  triggers: string[];
  targets: IntentTarget[];
}

export interface ResolvedIntent {
  intent: SearchIntent;
  token: string;
}

export const SEARCH_INTENTS: SearchIntent[] = [
  // ---------------------------------------------------------------- GASTRONOMIE
  {
    id: 'imbiss',
    label: 'Imbisse',
    triggers: ['imbiss', 'imbisse', 'imbissbude', 'imbissstube', 'fastfood', 'snack', 'snacks', 'snackbar', 'pommes', 'fritten', 'friet', 'frituur', 'currywurst', 'bratwurst', 'burger', 'hamburger', 'cheeseburger', 'chicken', 'nuggets', 'schnellimbiss', 'takeaway', 'mitnehmen'],
    targets: [
      { subcategories: ['Imbisse'], weight: 300 },
      { keywords: ['imbiss*', 'pommes', 'burger', 'currywurst', 'fast food'], weight: 200 }
    ]
  },
  {
    id: 'doener',
    label: 'Döner & Kebab',
    triggers: ['döner', 'doener', 'kebab', 'kebap', 'shawarma', 'dürüm', 'dueruem', 'lahmacun', 'drehspieß', 'drehspiess'],
    targets: [
      { keywords: ['döner*', 'doener*', 'kebab*', 'kebap*', 'shawarma*', 'dürüm*'], weight: 300 }
    ]
  },
  {
    id: 'pizza',
    label: 'Pizzerien',
    triggers: ['pizza', 'pizzen', 'pizzas', 'pizzeria', 'pizzerien', 'pasta', 'spaghetti', 'lasagne', 'nudelgericht', 'italiener', 'italienisch', 'italienische', 'italiaans', 'calzone', 'ristorante'],
    targets: [
      { subcategories: ['Pizzerien'], weight: 300 },
      { keywords: ['pizza*', 'pizzeria*', 'pasta', 'ristorante'], weight: 220 }
    ]
  },
  {
    id: 'restaurant',
    label: 'Restaurants',
    triggers: ['restaurant', 'restaurants', 'restaurante', 'abendessen', 'mittagessen', 'mittagstisch', 'dinner', 'lunch', 'gaststätte', 'gaststaette', 'gasthaus', 'speiselokal', 'lokal', 'essengehen', 'schnitzel', 'steak', 'steaks', 'tapas', 'fondue', 'wild', 'wildgerichte', 'deutsche küche', 'hausmannskost', 'eten', 'diner', 'asiatisch', 'chinesisch', 'sushi', 'wok', 'griechisch', 'kartoffel', 'bratkartoffeln'],
    targets: [
      { subcategories: ['Restaurant'], weight: 300 },
      { subcategories: ['Pizzerien', 'Skihütten', 'Weinstuben'], weight: 170 },
      { categories: ['Gastronomie'], weight: 120 }
    ]
  },
  {
    id: 'pfannkuchen',
    label: 'Pfannkuchen',
    triggers: ['pfannkuchen', 'pfannekuchen', 'pancake', 'pancakes', 'pannenkoek', 'pannenkoeken', 'poffertjes', 'crepes', 'crêpes'],
    targets: [
      { keywords: ['pannenkoek*', 'pfannkuchen', 'pancakes', 'poffertjes'], weight: 300 }
    ]
  },
  {
    id: 'cafe',
    label: 'Cafés',
    triggers: ['cafe', 'café', 'cafés', 'cafes', 'kaffee', 'kaffeetrinken', 'cappuccino', 'latte', 'espresso', 'kuchen', 'torte', 'torten', 'tortenstück', 'waffeln', 'frühstück', 'fruehstueck', 'frühstücken', 'brunch', 'koffie', 'taart', 'gebak', 'ontbijt', 'konditorei'],
    targets: [
      { subcategories: ['Cafés'], weight: 300 },
      { subcategories: ['Bäckerei'], weight: 220 },
      { keywords: ['cafe', 'café', 'frühstück', 'kuchen', 'konditorei'], weight: 160 }
    ]
  },
  {
    id: 'eis',
    label: 'Eisdielen',
    triggers: ['eis', 'eisdiele', 'eisdielen', 'eiscafe', 'eiscafé', 'speiseeis', 'softeis', 'eisbecher', 'gelato', 'gelateria', 'spaghettieis', 'ijs', 'ijsje', 'ijssalon'],
    targets: [
      { subcategories: ['Eisdielen'], weight: 300 },
      { keywords: ['eis', 'eiscafé', 'eiscafe', 'speiseeis', 'eisbecher'], weight: 180 }
    ]
  },
  {
    id: 'bar',
    label: 'Kneipen & Bars',
    triggers: ['bar', 'bars', 'kneipe', 'kneipen', 'pub', 'pubs', 'bier', 'biere', 'pils', 'cocktail', 'cocktails', 'drink', 'drinks', 'longdrink', 'feiern', 'party', 'ausgehen', 'nachtleben', 'apresski', 'après', 'apres', 'schirmbar', 'biergarten', 'kroeg', 'kroegen', 'cafeetje', 'disco', 'club', 'tanzen'],
    targets: [
      { subcategories: ['Kneipen und Bars'], weight: 300 },
      { subcategories: ['Skihütten'], weight: 200 },
      { keywords: ['bar', 'pub', 'kneipe', 'schirmbar', 'cocktails', 'après-ski'], weight: 170 }
    ]
  },
  {
    id: 'wein',
    label: 'Weinstuben',
    triggers: ['wein', 'weine', 'weinstube', 'weinbar', 'weinhandlung', 'rotwein', 'weißwein', 'weisswein', 'rosé', 'sekt', 'champagner', 'wijn'],
    targets: [
      { subcategories: ['Weinstuben'], weight: 300 },
      { keywords: ['wein*', 'wine*'], weight: 200 }
    ]
  },

  // ---------------------------------------------------------------- LEBENSMITTEL
  {
    id: 'baeckerei',
    label: 'Bäckereien',
    triggers: ['bäcker', 'baecker', 'bäckerei', 'baeckerei', 'bäckereien', 'brot', 'brote', 'brötchen', 'broetchen', 'semmel', 'backwaren', 'croissant', 'croissants', 'brezel', 'brezeln', 'laugenbrezel', 'gebäck', 'baguette', 'bakker', 'bakkerij', 'brood', 'broodjes'],
    targets: [
      { subcategories: ['Bäckerei'], weight: 300 },
      { keywords: ['bäckerei*', 'backwaren', 'brötchen'], weight: 250 }
    ]
  },
  {
    id: 'metzger',
    label: 'Metzgereien',
    triggers: ['metzger', 'metzgerei', 'fleischer', 'fleischerei', 'fleisch', 'wurst', 'würstchen', 'wurstwaren', 'schinken', 'aufschnitt', 'hackfleisch', 'schwein', 'schweinefleisch', 'rindfleisch', 'grillfleisch', 'slager', 'slagerij', 'vlees'],
    targets: [
      { subcategories: ['Fleischerei'], weight: 300 },
      { keywords: ['fleischerei*', 'metzgerei*', 'wurstwaren'], weight: 260 },
      { subcategories: ['Supermarkt'], weight: 120 }
    ]
  },
  {
    id: 'lebensmittel',
    label: 'Supermärkte & Lebensmittel',
    triggers: ['lebensmittel', 'lebensmittelgeschäft', 'supermarkt', 'supermärkte', 'discounter', 'nahrungsmittel', 'wocheneinkauf', 'milch', 'eier', 'butter', 'käse', 'kaese', 'joghurt', 'quark', 'obst', 'gemüse', 'gemuese', 'salat', 'kartoffeln', 'nudeln', 'reis', 'mehl', 'zucker', 'getränke', 'getraenke', 'getränkemarkt', 'mineralwasser', 'cola', 'saft', 'säfte', 'tiefkühlpizza', 'konserven', 'boodschappen', 'supermarkten', 'groente', 'fruit', 'zuivel', 'melk', 'kaas'],
    targets: [
      { subcategories: ['Supermarkt'], weight: 300 },
      { subcategories: ['Feinkost & Lebensmittel', 'Märkte'], weight: 250 },
      { keywords: ['supermarkt', 'lebensmittel', 'dorfladen', 'hofladen'], weight: 220 }
    ]
  },
  {
    id: 'feinkost',
    label: 'Feinkost & Regionales',
    triggers: ['feinkost', 'delikatessen', 'regional', 'regionale', 'hofladen', 'bioladen', 'wochenmarkt', 'markt', 'spezialitäten', 'sauerländer'],
    targets: [
      { subcategories: ['Feinkost & Lebensmittel', 'Märkte'], weight: 300 },
      { keywords: ['feinkost', 'hofladen', 'dorfladen', 'wochenmarkt', 'regionale produkte'], weight: 240 }
    ]
  },
  {
    id: 'honig',
    label: 'Imkereien',
    triggers: ['honig', 'imker', 'imkerei', 'bienenhonig', 'waldhonig', 'blütenhonig', 'honing'],
    targets: [
      { keywords: ['imkerei*', 'honig', 'blütenhonig'], weight: 300 }
    ]
  },

  // ---------------------------------------------------------------- EINZELHANDEL
  {
    id: 'bekleidung',
    label: 'Bekleidungsgeschäfte',
    triggers: ['kleidung', 'bekleidung', 'klamotten', 'mode', 'fashion', 'outfit', 'hose', 'hosen', 'jeans', 'jeanshose', 'shirt', 'shirts', 'tshirt', 'hemd', 'hemden', 'bluse', 'blusen', 'kleid', 'kleider', 'abendkleid', 'rock', 'röcke', 'jacke', 'jacken', 'mantel', 'mäntel', 'pullover', 'pulli', 'strickjacke', 'sweatshirt', 'hoodie', 'weste', 'unterwäsche', 'dessous', 'bh', 'socken', 'strümpfe', 'strumpfhose', 'anzug', 'anzüge', 'sakko', 'krawatte', 'mütze', 'mützen', 'schal', 'handschuh', 'handschuhe', 'gürtel', 'damenmode', 'herrenmode', 'kindermode', 'kinderkleidung', 'trachten', 'dirndl', 'lederhose', 'badehose', 'badeanzug', 'bikini', 'kleding', 'broek', 'broeken', 'jas', 'jassen', 'trui', 'overhemd', 'jurk'],
    targets: [
      { subcategories: ['Bekleidung'], weight: 300 },
      { subcategories: ['Sport & Outdoor'], weight: 220 },
      { keywords: ['mode', 'fashion', 'modehaus', 'bekleidung', 'boutique'], weight: 260 }
    ]
  },
  {
    id: 'sport',
    label: 'Sportgeschäfte',
    triggers: ['sport', 'sportgeschäft', 'sportgeschaeft', 'sportladen', 'sportartikel', 'sportbekleidung', 'sportkleidung', 'sportmode', 'sportschuh', 'sportschuhe', 'laufschuh', 'laufschuhe', 'turnschuh', 'turnschuhe', 'hallenschuh', 'hallenschuhe', 'wanderschuh', 'wanderschuhe', 'wanderstiefel', 'trekkingschuh', 'trekkingschuhe', 'funktionskleidung', 'funktionsjacke', 'outdoor', 'outdoorjacke', 'outdoorbekleidung', 'regenjacke', 'softshell', 'softshelljacke', 'fleecejacke', 'trainingsanzug', 'jogginghose', 'rucksack', 'rucksäcke', 'wanderrucksack', 'wanderausrüstung', 'skihose', 'skijacke', 'skianzug', 'skibrille', 'skihelm', 'skihandschuh', 'skihandschuhe', 'skiunterwäsche', 'skisocken', 'snowboardjacke', 'helm', 'skateboard', 'longboard', 'zelt', 'schlafsack', 'stöcke', 'nordic', 'wanderstöcke', 'sportwinkel', 'sportschoenen', 'wandelschoenen'],
    targets: [
      { subcategories: ['Sport & Outdoor'], weight: 300 },
      { keywords: ['sportgeschäft*', 'sportladen', 'sportmode', 'sportartikel', 'sportbekleidung', 'intersport'], weight: 280 }
    ]
  },
  {
    id: 'schuhe',
    label: 'Schuhgeschäfte',
    triggers: ['schuh', 'schuhe', 'schuhgeschäft', 'schuhladen', 'schuhhaus', 'stiefel', 'stiefeletten', 'winterstiefel', 'gummistiefel', 'sneaker', 'sneakers', 'sandalen', 'sandale', 'pumps', 'ballerinas', 'hausschuhe', 'pantoffeln', 'damenschuhe', 'herrenschuhe', 'kinderschuhe', 'winterschuhe', 'schoenen', 'laarzen'],
    targets: [
      { subcategories: ['Schuhgeschäfte'], weight: 300 },
      { keywords: ['schuh', 'schuhe', 'schuhhaus*', 'schuhgeschäft', 'stiefel'], weight: 280 }
    ]
  },
  {
    id: 'baumarkt',
    label: 'Baumärkte & Eisenwaren',
    triggers: ['baumarkt', 'baumärkte', 'hagebau', 'hagebaumarkt', 'müllenhoff', 'muellenhoff', 'heimwerker', 'heimwerken', 'werkzeug', 'werkzeuge', 'schraube', 'schrauben', 'nagel', 'nägel', 'naegel', 'dübel', 'duebel', 'bohrer', 'bohrmaschine', 'akkuschrauber', 'schraubenzieher', 'schraubendreher', 'hammer', 'säge', 'saege', 'zange', 'wasserwaage', 'farbe', 'farben', 'wandfarbe', 'lack', 'lacke', 'pinsel', 'farbrolle', 'tapete', 'tapeten', 'kleister', 'kleber', 'silikon', 'leim', 'spachtel', 'bretter', 'latten', 'schrauben', 'beschläge', 'beschlag', 'eisenwaren', 'eisen', 'scharnier', 'scharniere', 'türgriff', 'türklinke', 'schloss', 'vorhängeschloss', 'kette', 'ketten', 'draht', 'gartengeräte', 'gartenschlauch', 'schaufel', 'spaten', 'schubkarre', 'glühbirne', 'leuchtmittel', 'verlängerungskabel', 'fliesen', 'zement', 'beton', 'mörtel', 'putz', 'estrich', 'dämmung', 'gipskarton', 'baustoffe', 'baustoff', 'baumaterial', 'pflastersteine', 'holz', 'brennholz', 'kaminholz', 'bouwmarkt', 'gereedschap', 'schroeven', 'spijkers', 'verf'],
    targets: [
      { subcategories: ['Baumärkte'], weight: 300 },
      { subcategories: ['Baustoffe'], weight: 280 },
      { keywords: ['baumarkt', 'hagebau', 'eisenwaren', 'beschläge', 'bauzentrum', 'baustoffe', 'werkzeug*'], weight: 290 }
    ]
  },
  {
    id: 'blumen',
    label: 'Blumengeschäfte',
    triggers: ['blume', 'blumen', 'blumenstrauß', 'blumenstrauss', 'strauß', 'strauss', 'rosen', 'rose', 'tulpen', 'orchidee', 'orchideen', 'pflanze', 'pflanzen', 'zimmerpflanze', 'zimmerpflanzen', 'topfpflanze', 'kranz', 'trauerkranz', 'gesteck', 'brautstrauß', 'floristik', 'florist', 'floristin', 'blumenladen', 'blumengeschäft', 'bloemen', 'bloemist', 'boeket'],
    targets: [
      { subcategories: ['Blumengeschäfte'], weight: 300 },
      { keywords: ['blumen*', 'floristik', 'florist'], weight: 260 },
      { subcategories: ['Baumschulen'], weight: 140 }
    ]
  },
  {
    id: 'buch',
    label: 'Buchhandlungen',
    triggers: ['buch', 'bücher', 'buecher', 'buchhandlung', 'buchladen', 'roman', 'romane', 'krimi', 'krimis', 'kinderbuch', 'kinderbücher', 'wanderführer', 'reiseführer', 'kochbuch', 'hörbuch', 'boek', 'boeken', 'boekhandel'],
    targets: [
      { subcategories: ['Buchhandlungen'], weight: 300 },
      { keywords: ['buchhandlung*', 'bücher'], weight: 260 }
    ]
  },
  {
    id: 'kiosk',
    label: 'Kiosk & Schreibwaren',
    triggers: ['kiosk', 'zeitung', 'zeitungen', 'zeitschrift', 'zeitschriften', 'magazin', 'magazine', 'tabak', 'zigaretten', 'tabakwaren', 'lotto', 'lottoschein', 'toto', 'schreibwaren', 'briefmarken', 'postkarte', 'postkarten', 'stifte', 'schulbedarf', 'hefte', 'tijdschrift', 'krant'],
    targets: [
      { keywords: ['kiosk', 'schreibwaren', 'tabak*', 'lotto', 'zeitschriften'], weight: 300 },
      { subcategories: ['Bürobedarf'], weight: 150 }
    ]
  },
  {
    id: 'buero',
    label: 'Bürobedarf',
    triggers: ['bürobedarf', 'buerobedarf', 'büromöbel', 'bueromoebel', 'bürostuhl', 'schreibtisch', 'büroeinrichtung', 'druckerpapier', 'toner', 'ordner'],
    targets: [
      { subcategories: ['Bürobedarf'], weight: 300 },
      { keywords: ['büro*', 'bürodesign', 'objekteinrichtung*'], weight: 240 }
    ]
  },
  {
    id: 'spielwaren',
    label: 'Spielwaren',
    triggers: ['spielzeug', 'spielwaren', 'spielsachen', 'lego', 'playmobil', 'puppe', 'puppen', 'kuscheltier', 'kuscheltiere', 'plüschtier', 'brettspiel', 'brettspiele', 'gesellschaftsspiel', 'puzzle', 'modellbau', 'kindergeschenk', 'speelgoed'],
    targets: [
      { subcategories: ['Spielwaren'], weight: 300 },
      { keywords: ['spielwaren', 'spielzeug'], weight: 260 }
    ]
  },
  {
    id: 'schmuck',
    label: 'Juweliere & Uhren',
    triggers: ['schmuck', 'juwelier', 'juweliere', 'uhr', 'uhren', 'armbanduhr', 'ring', 'ringe', 'ehering', 'eheringe', 'trauring', 'trauringe', 'verlobungsring', 'kette', 'halskette', 'ohrring', 'ohrringe', 'ohrstecker', 'armband', 'goldschmied', 'gold', 'silber', 'uhrenbatterie', 'sieraden', 'horloge'],
    targets: [
      { subcategories: ['Juweliere & Uhren'], weight: 300 },
      { keywords: ['juwelier*', 'schmuck', 'uhren', 'goldschmied*'], weight: 260 }
    ]
  },
  {
    id: 'drogerie',
    label: 'Drogerien',
    triggers: ['drogerie', 'drogeriemarkt', 'shampoo', 'duschgel', 'zahnpasta', 'zahnbürste', 'windeln', 'deo', 'deodorant', 'seife', 'sonnencreme', 'sonnenschutz', 'creme', 'bodylotion', 'hygieneartikel', 'tampons', 'rasierer', 'haarfarbe', 'nagellack', 'babynahrung', 'waschmittel', 'putzmittel', 'drogist', 'luiers'],
    targets: [
      { subcategories: ['Drogerien'], weight: 300 },
      { subcategories: ['Parfümerie'], weight: 200 },
      { subcategories: ['Supermarkt'], weight: 140 }
    ]
  },
  {
    id: 'parfum',
    label: 'Parfümerien',
    triggers: ['parfum', 'parfüm', 'parfuem', 'parfümerie', 'parfuemerie', 'duft', 'düfte', 'eau', 'makeup', 'schminke', 'lippenstift', 'mascara', 'kosmetikartikel', 'pflegeprodukte', 'geurtje'],
    targets: [
      { subcategories: ['Parfümerie'], weight: 300 },
      { subcategories: ['Drogerien'], weight: 200 },
      { keywords: ['parfümerie*', 'parfum*'], weight: 260 }
    ]
  },
  {
    id: 'haushalt',
    label: 'Haushaltswaren, Deko & Geschenke',
    triggers: ['haushaltswaren', 'haushalt', 'deko', 'dekoration', 'geschenk', 'geschenke', 'geschenkidee', 'geschenkideen', 'mitbringsel', 'souvenir', 'souvenirs', 'andenken', 'geschirr', 'besteck', 'töpfe', 'pfanne', 'pfannen', 'kerzen', 'tischdeko', 'wohnaccessoires', 'cadeau', 'cadeaus'],
    targets: [
      { subcategories: ['Haushaltswaren & Deko'], weight: 300 },
      { keywords: ['geschenk*', 'deko*', 'haushaltswaren', 'souvenir*'], weight: 220 }
    ]
  },
  {
    id: 'elektronik',
    label: 'Elektronik & Telekommunikation',
    triggers: ['handy', 'handys', 'smartphone', 'iphone', 'handyvertrag', 'handyhülle', 'telefon', 'computer', 'laptop', 'notebook', 'pc', 'tablet', 'drucker', 'router', 'internet', 'dsl', 'glasfaser', 'elektronik', 'it', 'netzwerk', 'telekommunikation', 'mobiel', 'telefoon'],
    targets: [
      { keywords: ['telekommunikation', 'datentechnik', 'computer*', 'elektronik*', 'handy*', 'telemax', 'it-service'], weight: 300 }
    ]
  },
  {
    id: 'sanitaetshaus',
    label: 'Sanitätshaus & Orthopädie',
    triggers: ['sanitätshaus', 'sanitaetshaus', 'orthopädie', 'orthopaedie', 'einlagen', 'schuheinlagen', 'bandage', 'bandagen', 'rollator', 'rollstuhl', 'kompressionsstrümpfe', 'stützstrümpfe', 'gehhilfe', 'pflegebett', 'hilfsmittel'],
    targets: [
      { keywords: ['sanitätshaus*', 'orthopädie*', 'care service'], weight: 300 }
    ]
  },

  // ---------------------------------------------------------------- GESUNDHEIT
  {
    id: 'optiker',
    label: 'Optiker',
    triggers: ['brille', 'brillen', 'sonnenbrille', 'sonnenbrillen', 'lesebrille', 'gleitsichtbrille', 'brillengestell', 'brillengläser', 'kontaktlinsen', 'linsen', 'sehtest', 'sehstärke', 'optiker', 'augenoptiker', 'optik', 'bril', 'brillen', 'opticien'],
    targets: [
      { subcategories: ['Optiker'], weight: 300 },
      { keywords: ['optik', 'optiker', 'augenoptik*', 'brille*'], weight: 280 }
    ]
  },
  {
    id: 'hoergeraet',
    label: 'Hörgeräteakustiker',
    triggers: ['hörgerät', 'hörgeräte', 'hoergeraet', 'hoergeraete', 'hörtest', 'hörakustiker', 'hörakustik', 'schwerhörig', 'gehör', 'tinnitus', 'gehoorapparaat'],
    targets: [
      { subcategories: ['Hörgeräteakustiker'], weight: 300 },
      { keywords: ['hörgeräte*', 'hörakustik*'], weight: 280 }
    ]
  },
  {
    id: 'apotheke',
    label: 'Apotheken',
    triggers: ['apotheke', 'apotheken', 'medikament', 'medikamente', 'medizin', 'tabletten', 'arznei', 'arzneimittel', 'schmerzmittel', 'schmerztabletten', 'kopfschmerztabletten', 'ibuprofen', 'paracetamol', 'aspirin', 'rezept', 'hustensaft', 'nasenspray', 'pflaster', 'notapotheke', 'apotheek', 'medicijnen'],
    targets: [
      { subcategories: ['Apotheken'], weight: 300 },
      { keywords: ['apotheke*'], weight: 290 }
    ]
  },
  {
    id: 'arzt',
    label: 'Ärzte & Praxen',
    triggers: ['arzt', 'ärztin', 'aerztin', 'ärzte', 'aerzte', 'hausarzt', 'hausärztin', 'allgemeinmediziner', 'doktor', 'praxis', 'arztpraxis', 'krank', 'erkältung', 'grippe', 'fieber', 'husten', 'halsschmerzen', 'kopfschmerzen', 'bauchschmerzen', 'impfung', 'krankschreibung', 'internist', 'psychotherapie', 'psychotherapeut', 'dokter', 'huisarts'],
    targets: [
      { subcategories: ['Ärzte & Praxen'], weight: 300 },
      { keywords: ['arztpraxis', 'hausarzt*', 'praxis dr'], weight: 260 }
    ]
  },
  {
    id: 'zahnarzt',
    label: 'Zahnärzte',
    triggers: ['zahnarzt', 'zahnärztin', 'zahnaerztin', 'zahnärzte', 'zahnarztpraxis', 'zahn', 'zähne', 'zaehne', 'zahnschmerzen', 'zahnweh', 'zahnreinigung', 'karies', 'zahnfüllung', 'implantat', 'implantate', 'zahnspange', 'kieferorthopäde', 'tandarts', 'kiespijn'],
    targets: [
      { subcategories: ['Zahnärzte'], weight: 300 },
      { keywords: ['zahnarzt*', 'zahnarztpraxis'], weight: 290 }
    ]
  },
  {
    id: 'physio',
    label: 'Physiotherapie',
    triggers: ['physiotherapie', 'physiotherapeut', 'physio', 'krankengymnastik', 'manuelle', 'lymphdrainage', 'rückenschmerzen', 'rueckenschmerzen', 'rücken', 'nackenschmerzen', 'verspannung', 'verspannungen', 'reha', 'fysiotherapie'],
    targets: [
      { subcategories: ['Physiotherapie'], weight: 300 },
      { keywords: ['physiotherapie*', 'physio*', 'krankengymnastik'], weight: 290 },
      { subcategories: ['Massagen'], weight: 160 }
    ]
  },
  {
    id: 'massage',
    label: 'Massagen',
    triggers: ['massage', 'massagen', 'thaimassage', 'massieren', 'massiert', 'hotstone', 'fußmassage', 'massagesalon'],
    targets: [
      { subcategories: ['Massagen'], weight: 300 },
      { keywords: ['massage*'], weight: 200 },
      { subcategories: ['Physiotherapie'], weight: 160 }
    ]
  },
  {
    id: 'kosmetik',
    label: 'Kosmetikstudios',
    triggers: ['kosmetik', 'kosmetikstudio', 'kosmetikerin', 'beauty', 'gesichtsbehandlung', 'maniküre', 'manikuere', 'pediküre', 'fußpflege', 'nagelstudio', 'fingernägel', 'fingernagel', 'gelnägel', 'nägel machen', 'wimpern', 'wimpernverlängerung', 'augenbrauen', 'botox', 'hyaluron', 'permanent', 'ästhetik', 'waxing', 'haarentfernung', 'schoonheidssalon'],
    targets: [
      { subcategories: ['Kosmetikstudios'], weight: 300 },
      { keywords: ['kosmetik*', 'beauty', 'ästhetik'], weight: 260 }
    ]
  },
  {
    id: 'friseur',
    label: 'Friseure',
    triggers: ['friseur', 'friseure', 'frisör', 'frisoer', 'friseurin', 'friseursalon', 'haare', 'haar', 'haarschnitt', 'haarschneiden', 'frisur', 'frisuren', 'strähnen', 'färben', 'haarefärben', 'dauerwelle', 'barber', 'barbier', 'barbershop', 'bart', 'bartpflege', 'rasur', 'kapper', 'kapsalon'],
    targets: [
      { subcategories: ['Friseur'], weight: 300 },
      { keywords: ['friseur*', 'barber*', 'hair', 'haarschneiderei'], weight: 280 }
    ]
  },
  {
    id: 'yoga',
    label: 'Yoga',
    triggers: ['yoga', 'yogakurs', 'pilates', 'meditation', 'achtsamkeit'],
    targets: [
      { subcategories: ['Yoga'], weight: 300 },
      { keywords: ['yoga*', 'pilates'], weight: 220 }
    ]
  },
  {
    id: 'pflege',
    label: 'Pflegedienste',
    triggers: ['pflegedienst', 'pflege', 'pflegeheim', 'altenpflege', 'tagespflege', 'krankenpflege', 'seniorenbetreuung', 'betreuung', 'ambulant', 'thuiszorg'],
    targets: [
      { subcategories: ['Pflegedienste'], weight: 300 },
      { keywords: ['pflegedienst*', 'tagespflege', 'pflege'], weight: 260 }
    ]
  },
  {
    id: 'tier',
    label: 'Tiergesundheit',
    triggers: ['tierarzt', 'tierärztin', 'tierphysio', 'tierphysiotherapie', 'hund', 'hunde', 'katze', 'katzen', 'haustier', 'haustiere', 'pferdephysio', 'dierenarts'],
    targets: [
      { subcategories: ['Tiergesundheit'], weight: 300 },
      { keywords: ['tier*', 'hunde*'], weight: 220 }
    ]
  },

  // ---------------------------------------------------------------- UNTERKÜNFTE
  {
    id: 'hotel',
    label: 'Hotels',
    triggers: ['hotel', 'hotels', 'hotelzimmer', 'zimmer', 'doppelzimmer', 'einzelzimmer', 'übernachtung', 'uebernachtung', 'unterkunft', 'unterkünfte', 'pension', 'gästehaus', 'gasthof', 'landhotel', 'wellnesshotel', 'hotelkamer', 'overnachting'],
    targets: [
      { subcategories: ['Hotels'], weight: 300 },
      { categories: ['Hotels und Unterkünfte'], weight: 240 },
      { keywords: ['hotel*', 'pension', 'gasthof', 'landgasthof'], weight: 240 }
    ]
  },
  {
    id: 'ferienwohnung',
    label: 'Ferienwohnungen & Ferienhäuser',
    triggers: ['ferienwohnung', 'ferienwohnungen', 'fewo', 'apartment', 'apartments', 'appartement', 'ferienhaus', 'ferienhäuser', 'chalet', 'chalets', 'ferienpark', 'ferienparks', 'bungalow', 'blockhütte', 'vakantiehuis', 'vakantiewoning', 'vakantiepark'],
    targets: [
      { subcategories: ['Ferienwohnungen', 'Ferienhäuser', 'Ferienparks'], weight: 300 },
      { categories: ['Hotels und Unterkünfte'], weight: 220 },
      { keywords: ['ferienwohnung*', 'chalet*', 'apartment*', 'resort'], weight: 240 }
    ]
  },
  {
    id: 'camping',
    label: 'Camping & Wohnmobil',
    triggers: ['camping', 'campingplatz', 'zelten', 'zeltplatz', 'wohnmobil', 'wohnmobilstellplatz', 'wohnwagen', 'stellplatz', 'camper', 'campen', 'kamperen', 'camperplaats'],
    targets: [
      { keywords: ['camping*', 'campingpark', 'wohnmobil*', 'stellplatz'], weight: 300 }
    ]
  },

  // ---------------------------------------------------------------- MOBILITÄT
  {
    id: 'werkstatt',
    label: 'KFZ-Werkstätten',
    triggers: ['werkstatt', 'autowerkstatt', 'kfzwerkstatt', 'autoreparatur', 'inspektion', 'tüv', 'tuev', 'hauptuntersuchung', 'ölwechsel', 'oelwechsel', 'reifen', 'reifenwechsel', 'winterreifen', 'sommerreifen', 'bremsen', 'auspuff', 'unfall', 'unfallschaden', 'panne', 'abschleppen', 'klimaservice', 'schneeketten', 'schneekette', 'garage', 'apk', 'autogarage'],
    targets: [
      { subcategories: ['KFZ-Werkstätten'], weight: 300 },
      { keywords: ['werkstatt', 'autoservice', 'autoreparatur', 'kfz*', 'car service'], weight: 260 },
      { subcategories: ['Autohäuser'], weight: 180 }
    ]
  },
  {
    id: 'auto',
    label: 'Autohäuser & Werkstätten',
    triggers: ['auto', 'autos', 'pkw', 'kfz', 'autohaus', 'autohändler', 'neuwagen', 'gebrauchtwagen', 'jahreswagen', 'leasing', 'elektroauto', 'automobile', 'wagen'],
    targets: [
      { subcategories: ['Autohäuser'], weight: 300 },
      { subcategories: ['KFZ-Werkstätten'], weight: 260 },
      { keywords: ['autohaus*', 'automobile', 'auto'], weight: 240 }
    ]
  },
  {
    id: 'tankstelle',
    label: 'Tankstellen',
    triggers: ['tanken', 'tankstelle', 'tankstellen', 'benzin', 'diesel', 'sprit', 'kraftstoff', 'super', 'adblue', 'tankautomat', 'tankstation', 'brandstof'],
    targets: [
      { subcategories: ['Tankstellen'], weight: 300 },
      { keywords: ['tankstelle*', 'tankautomat*'], weight: 290 }
    ]
  },
  {
    id: 'fahrschule',
    label: 'Fahrschulen',
    triggers: ['fahrschule', 'fahrschulen', 'führerschein', 'fuehrerschein', 'fahrstunde', 'fahrstunden', 'fahrlehrer', 'motorradführerschein', 'rijschool', 'rijbewijs'],
    targets: [
      { keywords: ['fahrschule*'], weight: 300 }
    ]
  },
  {
    id: 'fahrrad',
    label: 'Fahrradgeschäfte & Verleih',
    triggers: ['fahrrad', 'fahrräder', 'fahrraeder', 'rad', 'räder', 'bike', 'bikes', 'ebike', 'ebikes', 'pedelec', 'mountainbike', 'mtb', 'rennrad', 'gravelbike', 'fahrradwerkstatt', 'fahrradreparatur', 'fahrradverleih', 'bikeverleih', 'radverleih', 'fiets', 'fietsen', 'fietsverhuur'],
    targets: [
      { subcategories: ['Fahrradgeschäfte', 'Fahrradverleih'], weight: 300 },
      { keywords: ['bike*', 'fahrrad*', 'e-bike*', 'biker'], weight: 260 }
    ]
  },
  {
    id: 'skiverleih',
    label: 'Skiverleih',
    triggers: ['skiverleih', 'skiausrüstung', 'skiausleihe', 'skiverhuur', 'skiservice', 'skiwachs', 'snowboardverleih'],
    targets: [
      { subcategories: ['Skiverleih'], weight: 300 },
      { keywords: ['skiverleih', 'ski verleih', 'snowboard*'], weight: 260 }
    ]
  },

  // ---------------------------------------------------------------- DIENSTLEISTUNGEN
  {
    id: 'bank',
    label: 'Banken',
    triggers: ['bank', 'banken', 'geld', 'bargeld', 'geldautomat', 'bankautomat', 'konto', 'girokonto', 'kredit', 'darlehen', 'baufinanzierung', 'finanzierung', 'sparkasse', 'volksbank', 'überweisung', 'geldabheben', 'pinautomaat'],
    targets: [
      { subcategories: ['Banken'], weight: 300 },
      { keywords: ['bank', 'sparkasse', 'volksbank'], weight: 280 }
    ]
  },
  {
    id: 'versicherung',
    label: 'Versicherungen',
    triggers: ['versicherung', 'versicherungen', 'versichern', 'haftpflicht', 'haftpflichtversicherung', 'hausrat', 'hausratversicherung', 'autoversicherung', 'kfzversicherung', 'lebensversicherung', 'krankenversicherung', 'berufsunfähigkeit', 'altersvorsorge', 'rente', 'vorsorge', 'versicherungsmakler', 'verzekering'],
    targets: [
      { subcategories: ['Versicherungsagenturen'], weight: 300 },
      { subcategories: ['Finanzberatung'], weight: 240 },
      { keywords: ['versicherung*'], weight: 280 }
    ]
  },
  {
    id: 'steuer',
    label: 'Steuerberater',
    triggers: ['steuer', 'steuern', 'steuererklärung', 'steuererklaerung', 'steuerberater', 'steuerberatung', 'buchhaltung', 'lohnabrechnung', 'jahresabschluss', 'finanzamt', 'belastingadviseur'],
    targets: [
      { subcategories: ['Steuerberater'], weight: 300 },
      { keywords: ['steuerberat*'], weight: 290 }
    ]
  },
  {
    id: 'anwalt',
    label: 'Rechtsanwälte & Notare',
    triggers: ['anwalt', 'anwälte', 'anwältin', 'rechtsanwalt', 'rechtsanwältin', 'rechtsanwälte', 'notar', 'notarin', 'kanzlei', 'rechtsberatung', 'scheidung', 'testament', 'erbrecht', 'arbeitsrecht', 'verkehrsrecht', 'mietrecht', 'advocaat', 'notaris'],
    targets: [
      { subcategories: ['Rechtsanwälte'], weight: 300 },
      { keywords: ['rechtsanw*', 'notar*', 'kanzlei'], weight: 290 }
    ]
  },
  {
    id: 'immobilien',
    label: 'Immobilienmakler',
    triggers: ['immobilie', 'immobilien', 'makler', 'immobilienmakler', 'wohnung', 'wohnungen', 'mietwohnung', 'eigentumswohnung', 'grundstück', 'grundstueck', 'baugrundstück', 'hauskauf', 'hausverkauf', 'hausverwaltung', 'wertermittlung', 'makelaar'],
    targets: [
      { subcategories: ['Immobilienmakler'], weight: 300 },
      { keywords: ['immobilien*', 'makler*', 'hausverwaltung'], weight: 290 }
    ]
  },
  {
    id: 'marketing',
    label: 'Werbung & Marketing',
    triggers: ['werbung', 'werbeagentur', 'marketing', 'webseite', 'website', 'homepage', 'webdesign', 'seo', 'logo', 'flyer', 'socialmedia', 'onlinemarketing', 'grafikdesign', 'druckerei', 'druck', 'visitenkarten', 'broschüre', 'reclame'],
    targets: [
      { subcategories: ['Marketingdienstleistungen'], weight: 300 },
      { keywords: ['werbeagentur', 'marketing', 'druck', 'design', 'seo', 'verlag'], weight: 260 }
    ]
  },
  {
    id: 'werbetechnik-druck',
    label: 'Werbetechnik, Textildruck & Druckereien',
    triggers: [
      'werbetechnik', 'textildruck', 'stickerei', 't-shirtdruck', 't-shirt-druck', 'textilveredelung',
      'beschriftung', 'beschriftungen', 'autobeschriftung', 'fahrzeugbeschriftung', 'schaufensterbeschriftung',
      'leuchtreklame', 'lichtwerbung', 'werbeschild', 'werbeschilder', 'pylon', 'werbepylon',
      'druckerei', 'druckereien', 'drucken', 'digitaldruck', 'plattendruck', 'lasergravur',
      'arbeitskleidung', 'berufsbekleidung', 'stick', 'stickereien', 'belettering', 'textieldruk'
    ],
    targets: [
      { subcategories: ['Druckereien', 'Marketingdienstleistungen'], weight: 320 },
      { keywords: ['werbetechnik*', 'peismedia*', 'beschriftung*', 'stickerei*', 'textildruck*', 'druckerei*'], weight: 280 }
    ]
  },
  {
    id: 'coworking',
    label: 'Coworking',
    triggers: ['coworking', 'coworkingspace', 'arbeitsplatz', 'büroplatz', 'homeoffice', 'meetingraum', 'besprechungsraum', 'konferenzraum', 'workation', 'flexdesk'],
    targets: [
      { subcategories: ['Coworking Space'], weight: 300 },
      { keywords: ['coworking*', 'meetingraum'], weight: 260 }
    ]
  },
  {
    id: 'drohnen-sicherheit',
    label: 'Drohnenabwehr & Sicherheitstechnik',
    triggers: ['drohne', 'drohnen', 'drohnenabwehr', 'drohnendetektion', 'exorock', 'exodeck', 'citadel', 'luftraumüberwachung', 'kritis', 'sicherheitstechnik'],
    targets: [
      { subcategories: ['IT & Software'], weight: 300 },
      { keywords: ['drohn*', 'exorock', 'luftraum*'], weight: 300 }
    ]
  },
  {
    id: 'it-systemhaus',
    label: 'IT-Systemhaus & IT-Dienstleistungen',
    triggers: ['it', 'systemhaus', 'edv', 'computer', 'netzwerk', 'great oak', 'server', 'datev', 'firewall', 'it-service', 'backup', 'datenrettung', 'it-sicherheit'],
    targets: [
      { subcategories: ['IT & Software'], weight: 300 },
      { keywords: ['systemhaus*', 'great oak*', 'it-service*', 'datev*'], weight: 300 }
    ]
  },
  {
    id: 'reinigung',
    label: 'Reinigungen & Wäschereien',
    triggers: ['reinigung', 'textilreinigung', 'wäscherei', 'waescherei', 'chemische', 'wäsche', 'hemdenservice', 'bettwäsche', 'stomerij', 'wasserette'],
    targets: [
      { subcategories: ['Wäschereien'], weight: 300 },
      { keywords: ['reinigung', 'textilreinigung', 'wäscherei'], weight: 280 }
    ]
  },
  {
    id: 'kita',
    label: 'Kitas & Schulen',
    triggers: ['kita', 'kitas', 'kindergarten', 'kindergärten', 'kindertagesstätte', 'kinderbetreuung', 'schule', 'schulen', 'grundschule', 'gymnasium', 'realschule', 'gesamtschule', 'sekundarschule', 'familienzentrum', 'kinderopvang', 'basisschool'],
    targets: [
      { keywords: ['kindergarten', 'kindertageseinrichtung', 'kita', 'familienzentrum', 'grundschule', 'gymnasium', 'schule', 'sekundarschule', 'realschule'], weight: 300 }
    ]
  },
  {
    id: 'tourismus',
    label: 'Tourist-Information',
    triggers: ['touristinfo', 'touristinformation', 'touristeninformation', 'touristik', 'tourismus', 'information', 'prospekte', 'wanderkarte', 'gästekarte', 'kurtaxe', 'vvv'],
    targets: [
      { subcategories: ['Tourismus'], weight: 300 },
      { keywords: ['touristik', 'tourist*'], weight: 280 }
    ]
  },

  // ---------------------------------------------------------------- HANDWERK
  {
    id: 'dachdecker',
    label: 'Dachdecker',
    triggers: ['dachdecker', 'dach', 'dächer', 'dachrinne', 'dachrinnen', 'dachfenster', 'dachziegel', 'ziegel', 'bedachung', 'flachdach', 'dachsanierung', 'undicht', 'dakdekker'],
    targets: [
      { subcategories: ['Dachdecker'], weight: 300 },
      { keywords: ['dachdecker*', 'bedachung*'], weight: 290 }
    ]
  },
  {
    id: 'elektriker',
    label: 'Elektriker',
    triggers: ['elektriker', 'elektro', 'elektroinstallation', 'strom', 'steckdose', 'steckdosen', 'sicherung', 'sicherungskasten', 'stromausfall', 'kabel', 'elektrik', 'wallbox', 'beleuchtung', 'smarthome', 'elektricien'],
    targets: [
      { subcategories: ['Elektriker'], weight: 300 },
      { keywords: ['elektro*', 'elektroinstallation'], weight: 290 }
    ]
  },
  {
    id: 'heizung',
    label: 'Heizung, Sanitär & Klima',
    triggers: ['heizung', 'heizungen', 'heizungsbauer', 'sanitär', 'sanitaer', 'installateur', 'klempner', 'rohrbruch', 'wasserrohr', 'verstopfung', 'abfluss', 'wärmepumpe', 'waermepumpe', 'solar', 'solaranlage', 'photovoltaik', 'pvanlage', 'klima', 'klimaanlage', 'therme', 'boiler', 'gasheizung', 'ölheizung', 'pelletheizung', 'loodgieter'],
    targets: [
      { subcategories: ['Heizungstechnik'], weight: 300 },
      { keywords: ['heizung*', 'sanitär*', 'haustechnik', 'solar', 'klima'], weight: 290 },
      { subcategories: ['Bäderstudios'], weight: 160 }
    ]
  },
  {
    id: 'bad',
    label: 'Bäderstudios',
    triggers: ['badezimmer', 'badsanierung', 'bäderstudio', 'baederstudio', 'badausstellung', 'dusche', 'duschen', 'badewanne', 'toilette', 'waschbecken', 'fliesenleger', 'badkamer'],
    targets: [
      { subcategories: ['Bäderstudios'], weight: 300 },
      { subcategories: ['Heizungstechnik'], weight: 240 },
      { keywords: ['bad', 'bäder*', 'sanitär*'], weight: 260 }
    ]
  },
  {
    id: 'maler',
    label: 'Maler & Lackierer',
    triggers: ['maler', 'malerin', 'malerbetrieb', 'lackierer', 'streichen', 'anstreichen', 'anstrich', 'tapezieren', 'fassade', 'fassadenanstrich', 'wände', 'schimmel', 'schilder', 'schilderij'],
    targets: [
      { subcategories: ['Maler & Lackierer'], weight: 300 },
      { keywords: ['maler*', 'lackierer*'], weight: 290 }
    ]
  },
  {
    id: 'schreiner',
    label: 'Schreinereien & Tischlereien',
    triggers: ['schreiner', 'schreinerei', 'tischler', 'tischlerei', 'möbel', 'moebel', 'möbelbau', 'einbauküche', 'küchenbau', 'treppe', 'treppen', 'fenster', 'tür', 'türen', 'haustür', 'innenausbau', 'parkett', 'einbauschrank', 'timmerman'],
    targets: [
      { subcategories: ['Schreinereien'], weight: 300 },
      { keywords: ['schreiner*', 'tischler*', 'treppen', 'objekteinrichtung*'], weight: 290 }
    ]
  },
  {
    id: 'garten',
    label: 'Garten- & Landschaftsbau',
    triggers: ['gartenbau', 'gärtner', 'gaertner', 'garten', 'gärten', 'gartenpflege', 'gartengestaltung', 'landschaftsbau', 'rasen', 'rasenmähen', 'hecke', 'heckeschneiden', 'baumfällung', 'baum', 'bäume', 'pflasterarbeiten', 'terrasse', 'zaun', 'hovenier'],
    targets: [
      { subcategories: ['Gartenbauer'], weight: 300 },
      { keywords: ['garten*', 'gartenbau', 'landschaftsbau'], weight: 280 },
      { subcategories: ['Baumschulen'], weight: 200 }
    ]
  },
  {
    id: 'baumschule',
    label: 'Baumschulen',
    triggers: ['baumschule', 'baumschulen', 'sträucher', 'hecken', 'heckenpflanzen', 'obstbäume', 'tannenbaum', 'weihnachtsbaum', 'weihnachtsbäume', 'christbaum', 'kerstboom'],
    targets: [
      { subcategories: ['Baumschulen'], weight: 300 },
      { keywords: ['baumschule*'], weight: 290 }
    ]
  },
  {
    id: 'bau',
    label: 'Bauunternehmen',
    triggers: ['bauunternehmen', 'bauunternehmung', 'bauunternehmer', 'hausbau', 'neubau', 'rohbau', 'anbau', 'umbau', 'bauen', 'maurer', 'tiefbau', 'erdarbeiten', 'bagger', 'aannemer'],
    targets: [
      { subcategories: ['Bauunternehmen'], weight: 300 },
      { keywords: ['bauunternehm*', 'bau'], weight: 280 }
    ]
  },
  {
    id: 'maschinenbau',
    label: 'Maschinenbau & Fördertechnik',
    triggers: [
      'maschinenbau', 'maschinenbauer', 'sondermaschinenbau', 'anlagenbau',
      'fördertechnik', 'foerdertechnik', 'förderanlage', 'förderanlagen',
      'sägewerkstechnik', 'saegewerkstechnik', 'leimholz', 'leimholzanlage',
      'leimholzanlagen', 'kvh', 'bsh', 'clt', 'keilzinken', 'sortieranlage',
      'transportanlagen', 'schaltschrankbau', 'sps', 'lohnfertigung',
      'leiße', 'leisse', 'machinebouw'
    ],
    targets: [
      { subcategories: ['Maschinenbau'], weight: 300 },
      { keywords: ['maschinenbau*', 'anlagenbau*', 'fördertechnik*', 'sägewerkstechnik*', 'leiße*', 'leisse*'], weight: 290 }
    ]
  },

  // ---------------------------------------------------------------- FREIZEIT & SPORT
  {
    id: 'fitness',
    label: 'Fitnessstudios',
    triggers: ['fitness', 'fitnessstudio', 'fitnessstudios', 'gym', 'krafttraining', 'training', 'trainieren', 'workout', 'ems', 'abnehmen', 'muskelaufbau', 'personaltrainer', 'sportschool'],
    targets: [
      { subcategories: ['Fitnessstudios'], weight: 300 },
      { keywords: ['fitness*', 'ems'], weight: 260 }
    ]
  },
  {
    id: 'schwimmen',
    label: 'Schwimmbäder',
    triggers: ['schwimmbad', 'schwimmbäder', 'schwimmen', 'hallenbad', 'freibad', 'baden', 'spaßbad', 'erlebnisbad', 'zwembad', 'zwemmen'],
    targets: [
      { subcategories: ['Schwimmbäder'], weight: 300 },
      { keywords: ['schwimmbad', 'freibad', 'hallenbad', 'oversum'], weight: 260 }
    ]
  },
  {
    id: 'kino',
    label: 'Kino',
    triggers: ['kino', 'kinos', 'film', 'filme', 'filmtheater', 'bioscoop'],
    targets: [
      { subcategories: ['Kino'], weight: 300 },
      { keywords: ['kino', 'filmtheater'], weight: 290 }
    ]
  },
  {
    id: 'bowling',
    label: 'Bowling',
    triggers: ['bowling', 'bowlen', 'kegeln', 'kegelbahn'],
    targets: [
      { subcategories: ['Bowling'], weight: 300 },
      { keywords: ['bowling', 'bowlhaus', 'kegelbahn'], weight: 290 }
    ]
  },
  {
    id: 'indoor',
    label: 'Indoor-Freizeit',
    triggers: ['indoor', 'indoorspielplatz', 'spielplatz', 'lasertag', 'escape', 'escaperoom', 'vr', 'virtualreality', 'kart', 'kartbahn', 'gokart', 'regenwetter', 'schlechtwetter', 'kindergeburtstag', 'binnenspeeltuin'],
    targets: [
      { subcategories: ['Indoor-Spielplätze'], weight: 300 },
      { keywords: ['indoor', 'lasertag', 'escape room', 'kart*'], weight: 260 }
    ]
  },
  {
    id: 'outdoorpark',
    label: 'Outdoor-Freizeit & Erlebnis',
    triggers: ['sommerrodelbahn', 'rodelbahn', 'rodeln', 'klettern', 'kletterwald', 'hochseilgarten', 'kletterpark', 'minigolf', 'adventuregolf', 'freizeitpark', 'erlebnis', 'ausflug', 'ausflugsziel', 'bikepark', 'downhill', 'hängebrücke', 'zipline', 'aussichtsturm'],
    targets: [
      { subcategories: ['Outdoor-Freizeitgebiet'], weight: 300 },
      { categories: ['Freizeit'], weight: 220 },
      { keywords: ['rodelbahn*', 'sommerrodelbahn*', 'kletter*', 'golf', 'bikepark', 'erlebnis*'], weight: 260 }
    ]
  },
  {
    id: 'tennis',
    label: 'Tennisplätze',
    triggers: ['tennis', 'tennisplatz', 'tennisplätze', 'padel', 'squash'],
    targets: [
      { subcategories: ['Tennisplätze'], weight: 300 },
      { keywords: ['tennis*'], weight: 280 }
    ]
  },
  {
    id: 'fussball',
    label: 'Fußballvereine',
    triggers: ['fußball', 'fussball', 'fußballverein', 'fussballverein', 'verein', 'vereine', 'sportverein', 'voetbal'],
    targets: [
      { subcategories: ['Fußballvereine'], weight: 300 },
      { keywords: ['sportverein', 'fc', 'tus', 'vfr', 'verein'], weight: 220 }
    ]
  },
  {
    id: 'reiten',
    label: 'Reiten & Kutschfahrten',
    triggers: ['reiten', 'reitstall', 'reitschule', 'reitunterricht', 'pferd', 'pferde', 'pony', 'ponyreiten', 'kutsche', 'kutschfahrt', 'planwagen', 'paardrijden'],
    targets: [
      { subcategories: ['Reitsport'], weight: 300 },
      { keywords: ['reit*', 'pferde*', 'fuhrhalterei'], weight: 280 }
    ]
  }
];

/** Prefixes that turn a clothing/shoe/eyewear item into a SPORTS item (e.g. "Sportschuhe", "Skibrille", "Wanderhose") */
const SPORT_PREFIXES = ['sport', 'lauf', 'wander', 'trekking', 'ski', 'snowboard', 'fussball', 'fußball', 'tennis', 'hallen', 'kletter', 'outdoor', 'funktions', 'trainings', 'berg', 'jogging', 'fitness', 'golf', 'radsport', 'rad', 'bike', 'langlauf', 'regen', 'softshell', 'fleece'];
const SPORTIFIABLE_INTENTS = new Set(['bekleidung', 'schuhe', 'optiker']);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Canonical form for robust comparison: lowercase, umlauts folded, hyphens/spaces removed */
export function canon(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[éèê]/g, 'e')
    .replace(/[-\s]/g, '');
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const WORD_CHARS = 'a-zA-Z0-9äöüÄÖÜß';

/**
 * Whole-word keyword check. Trailing '*' enables prefix matching.
 */
export function matchesIntentKeyword(haystack: string, keyword: string): boolean {
  if (!haystack || !keyword) return false;
  const isPrefix = keyword.endsWith('*');
  const kw = escapeRegExp(keyword.replace(/\*$/, '').toLowerCase());
  const re = isPrefix
    ? new RegExp(`(^|[^${WORD_CHARS}])${kw}`, 'i')
    : new RegExp(`(^|[^${WORD_CHARS}])${kw}([^${WORD_CHARS}]|$)`, 'i');
  return re.test(haystack.toLowerCase());
}

// Trigger index (built once)
interface TriggerEntry { intent: SearchIntent; trigger: string }
const TRIGGER_INDEX = new Map<string, TriggerEntry>();
const SUFFIX_TRIGGERS: TriggerEntry[] = [];

for (const intent of SEARCH_INTENTS) {
  for (const t of intent.triggers) {
    const c = canon(t);
    if (!c) continue;
    if (!TRIGGER_INDEX.has(c)) {
      TRIGGER_INDEX.set(c, { intent, trigger: c });
    }
    if (c.length >= 4) {
      SUFFIX_TRIGGERS.push({ intent, trigger: c });
    }
  }
}
// Longest suffix first so the most specific compound wins
SUFFIX_TRIGGERS.sort((a, b) => b.trigger.length - a.trigger.length);

const INTENT_BY_ID = new Map(SEARCH_INTENTS.map(i => [i.id, i]));

/** Generates simple plural-stripped variants of a canonical token */
function inflectionVariants(c: string): string[] {
  const out: string[] = [];
  const push = (v: string) => { if (v.length >= 3 && v !== c && !out.includes(v)) out.push(v); };
  if (c.endsWith('nen')) push(c.slice(0, -3));
  if (c.endsWith('en')) push(c.slice(0, -2));
  if (c.endsWith('er')) push(c.slice(0, -2));
  if (c.endsWith('n')) push(c.slice(0, -1));
  if (c.endsWith('e')) push(c.slice(0, -1));
  if (c.endsWith('s')) push(c.slice(0, -1));
  return out;
}

function findBaseIntent(c: string): SearchIntent | null {
  // 1. Exact match on the raw token
  const exact = TRIGGER_INDEX.get(c);
  if (exact) return exact.intent;

  // 2. Exact match on plural-stripped variants
  for (const v of inflectionVariants(c)) {
    const hit = TRIGGER_INDEX.get(v);
    if (hit) return hit.intent;
  }

  // 3. Compound suffix ("jeanshose" -> "hose", "akkuschrauber" -> "schrauber")
  const forms = [c, ...inflectionVariants(c)];
  for (const entry of SUFFIX_TRIGGERS) {
    for (const f of forms) {
      if (f.length > entry.trigger.length && f.endsWith(entry.trigger) && f.length - entry.trigger.length >= 3) {
        return entry.intent;
      }
    }
  }
  return null;
}

/**
 * Resolves a single user token to a business intent (or null if unknown).
 */
export function resolveTokenIntent(token: string): SearchIntent | null {
  const c = canon(token);
  if (c.length < 2) return null;

  const base = findBaseIntent(c);
  if (!base) return null;

  // Sports compounds: "Sportschuhe", "Wanderhose", "Skibrille" -> Sportgeschäfte first, base type as secondary
  if (SPORTIFIABLE_INTENTS.has(base.id)) {
    const prefix = SPORT_PREFIXES.map(canon).find(p => c.startsWith(p) && c.length > p.length + 2);
    if (prefix) {
      const sport = INTENT_BY_ID.get('sport')!;
      return {
        id: `sport+${base.id}`,
        label: sport.label,
        triggers: [],
        targets: [
          ...sport.targets,
          ...base.targets.map(t => ({ ...t, weight: Math.round(t.weight * 0.55) }))
        ]
      };
    }
  }

  return base;
}

/**
 * Checks how well a business serves an intent.
 * Returns the best target weight (0 = does not serve this intent) and the matched label.
 */
export function scoreBusinessForIntent(bus: Business, intent: SearchIntent): { weight: number; label?: string } {
  const subcats = [bus.subcategory, ...(bus.additionalCategories || []).map(a => a.subcategory)]
    .filter(Boolean)
    .map(s => (s as string).toLowerCase());
  const cats = [bus.category, ...(bus.additionalCategories || []).map(a => a.category)]
    .filter(Boolean)
    .map(s => (s as string).toLowerCase());

  const keywordHaystack = [
    bus.name,
    bus.subcategory || '',
    ...(bus.additionalCategories || []).map(a => a.subcategory || ''),
    ...(bus.services || []),
    ...(bus.services_nl || []),
    ...(bus.products || []),
    ...(bus.products_nl || [])
  ].join(' | ');

  let best = 0;
  let label: string | undefined;

  for (const target of intent.targets) {
    if (target.weight <= best) continue;

    if (target.subcategories) {
      const hit = target.subcategories.find(s => subcats.includes(s.toLowerCase()));
      if (hit) { best = target.weight; label = hit; continue; }
    }
    if (target.categories) {
      const hit = target.categories.find(c => cats.includes(c.toLowerCase()));
      if (hit) { best = target.weight; label = hit; continue; }
    }
    if (target.keywords) {
      const hit = target.keywords.find(k => matchesIntentKeyword(keywordHaystack, k));
      if (hit) { best = target.weight; label = bus.subcategory || bus.category; continue; }
    }
  }

  return { weight: best, label };
}
