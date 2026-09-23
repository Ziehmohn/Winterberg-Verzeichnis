import { ChargingStation } from '../types';

export const CHARGING_STATIONS_DATA: ChargingStation[] = [
  {
    id: 'enbw-am-waltenberg',
    name: 'EnBW Hypercharger Schnellladepark',
    operator: 'EnBW mobility+',
    address: 'Am Waltenberg 45',
    district: 'Winterberg Kernstadt',
    lat: 51.1945,
    lng: 8.5320,
    isFastCharger: true,
    maxPowerKw: 300,
    plugs: [
      { type: 'CCS', count: 4, powerKw: 300 },
      { type: 'Type2', count: 2, powerKw: 22 }
    ],
    costInfo: 'EnBW mobility+ Tarif oder Roaming (ADAC, Maingau, Shell Recharge, etc.)',
    costInfo_nl: 'EnBW tarief of roaming (Shell Recharge, Plugsurfing, ANWB, etc.)',
    parkingFeeInfo: 'Kostenfreies Parken während des Ladevorgangs (Parkscheibe bis 45 Min.)',
    parkingFeeInfo_nl: 'Gratis parkeren tijdens het laden (blauwe parkeerschijf max. 45 min.)',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Café & Bäckerei Isken', category: 'Gastronomie', distanceMeters: 120 },
      { name: 'Kaufpark Supermarkt', category: 'Einzelhandel', distanceMeters: 150 },
      { name: 'Kurpark Winterberg', category: 'Freizeit', distanceMeters: 250 }
    ]
  },
  {
    id: 'allego-remmeswiese',
    name: 'Allego High Power Charger Remmeswiese',
    operator: 'Allego / Edeka',
    address: 'Remmeswiese 21',
    district: 'Winterberg Kernstadt',
    lat: 51.2025,
    lng: 8.5280,
    isFastCharger: true,
    maxPowerKw: 150,
    plugs: [
      { type: 'CCS', count: 2, powerKw: 150 },
      { type: 'CHAdeMO', count: 1, powerKw: 50 },
      { type: 'Type2', count: 2, powerKw: 22 }
    ],
    costInfo: 'Ad-Hoc Zahlung per Kreditkarte oder gängige Ladekarten',
    costInfo_nl: 'Direct betalen met creditcard of Nederlandse laadpassen',
    parkingFeeInfo: 'Kostenloses Parken für Kunden',
    parkingFeeInfo_nl: 'Gratis parkeren voor winkelend publiek',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Edeka Center Winterberg', category: 'Einzelhandel', distanceMeters: 40 },
      { name: 'Aldi Nord', category: 'Einzelhandel', distanceMeters: 100 },
      { name: 'Bäckerei & Bistro', category: 'Gastronomie', distanceMeters: 60 }
    ]
  },
  {
    id: 'he-bahnhof-winterberg',
    name: 'Hochsauerland Energie Ladestation Bahnhof',
    operator: 'Hochsauerland Energie GmbH',
    address: 'Bahnhofstraße 12',
    district: 'Winterberg Kernstadt',
    lat: 51.1985,
    lng: 8.5360,
    isFastCharger: false,
    maxPowerKw: 22,
    plugs: [
      { type: 'Type2', count: 4, powerKw: 22 }
    ],
    costInfo: 'Ladeverbund+ & alle gängigen Roamingkarten',
    costInfo_nl: 'Geschikt voor alle reguliere laadpassen',
    parkingFeeInfo: 'P+R Parkplatz – mit Parkschein (erste Stunde frei)',
    parkingFeeInfo_nl: 'P+R parkeerplaats – eerste uur gratis met ticket',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Bahnhof Winterberg (RE57)', category: 'Mobilität & KFZ', distanceMeters: 30 },
      { name: 'Bürgerhaus & Kulturzentrum', category: 'Freizeit', distanceMeters: 180 },
      { name: 'City Center Winterberg', category: 'Einzelhandel', distanceMeters: 300 }
    ]
  },
  {
    id: 'skiliftkarussell-bremberg-p1',
    name: 'Skiliftkarussell P1 Bremberg Ladepark',
    operator: 'Skiliftkarussell Winterberg',
    address: 'Am Bremberg (Parkplatz P1)',
    district: 'Winterberg Kernstadt',
    lat: 51.1850,
    lng: 8.5140,
    isFastCharger: true,
    maxPowerKw: 150,
    plugs: [
      { type: 'CCS', count: 2, powerKw: 150 },
      { type: 'Type2', count: 4, powerKw: 22 }
    ],
    costInfo: 'Spontanladen per QR-Code oder gängige Apps (EnBW, Maingau, etc.)',
    costInfo_nl: 'Eenvoudig laden via QR-code of bekende laadapps',
    parkingFeeInfo: 'Reguläre Parkplatztarif des Skiliftkarussells für Skifahrer',
    parkingFeeInfo_nl: 'Standaard parkeertarief skiliftparkeerplaats',
    availableHours: 'Täglich 07:00 – 22:00 Uhr',
    nearbyHighlights: [
      { name: 'Brembergklause Restaurant', category: 'Gastronomie', distanceMeters: 80 },
      { name: 'Skiverleih Schneider', category: 'Ski, Bike & Sport', distanceMeters: 100 },
      { name: 'Skiliftkarussell Kasse & Lifte', category: 'Freizeit', distanceMeters: 50 }
    ]
  },
  {
    id: 'rathaus-markt-winterberg',
    name: 'Marktplatz / Untere Pforte E-Ladestation',
    operator: 'Westenergie / E.ON Drive',
    address: 'Fichtenweg 10 (Nähe Marktplatz)',
    district: 'Winterberg Kernstadt',
    lat: 51.1960,
    lng: 8.5300,
    isFastCharger: false,
    maxPowerKw: 22,
    plugs: [
      { type: 'Type2', count: 2, powerKw: 22 }
    ],
    costInfo: 'E.ON Drive Tarif & Roaming-Partner',
    costInfo_nl: 'E.ON netwerk & internationale roaming',
    parkingFeeInfo: 'Parkscheibe 3 Stunden Höchstparkdauer während des Ladens',
    parkingFeeInfo_nl: 'Maximale parkeerduur 3 uur met blauwe schijf tijdens het laden',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Marktplatz Winterberg (Fußgängerzone)', category: 'Freizeit', distanceMeters: 120 },
      { name: 'Rathaus Winterberg', category: 'Dienstleistungen', distanceMeters: 80 },
      { name: 'Brauhaus Winterberg', category: 'Gastronomie', distanceMeters: 190 }
    ]
  },
  {
    id: 'erlebnisberg-kappe-bobbahn',
    name: 'Erlebnisberg Kappe & Veltins EisArena Lader',
    operator: 'E.ON Drive',
    address: 'Kappe 2',
    district: 'Winterberg Kernstadt',
    lat: 51.1810,
    lng: 8.5080,
    isFastCharger: false,
    maxPowerKw: 22,
    plugs: [
      { type: 'Type2', count: 4, powerKw: 22 }
    ],
    costInfo: 'E.ON Drive App, RFID oder Roaming',
    costInfo_nl: 'E.ON Drive app of laadpas',
    parkingFeeInfo: 'Parkgebühr für Großraumparkplatz Kappe',
    parkingFeeInfo_nl: 'Parkeertarief recreatieberg Kappe',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Panorama Erlebnis Brücke', category: 'Freizeit', distanceMeters: 90 },
      { name: 'Bikepark Winterberg', category: 'Ski, Bike & Sport', distanceMeters: 110 },
      { name: 'VELTINS-EisArena (Bobbahn)', category: 'Freizeit', distanceMeters: 200 }
    ]
  },
  {
    id: 'postwiese-neuastenberg-lader',
    name: 'Postwiesen Ladesäule Neuastenberg',
    operator: 'Hochsauerland Energie',
    address: 'Winterberger Straße 8',
    district: 'Neuastenberg',
    lat: 51.1620,
    lng: 8.4870,
    isFastCharger: true,
    maxPowerKw: 75,
    plugs: [
      { type: 'CCS', count: 2, powerKw: 75 },
      { type: 'Type2', count: 2, powerKw: 22 }
    ],
    costInfo: 'Ladeverbund+ & Roaming',
    costInfo_nl: 'Alle grote Europese laadpassen',
    parkingFeeInfo: 'Freies Parken während des Ladens',
    parkingFeeInfo_nl: 'Gratis parkeren tijdens het laden',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Postwiesen Skigebiet', category: 'Freizeit', distanceMeters: 100 },
      { name: 'Westdeutsches Wintersport-Museum', category: 'Freizeit', distanceMeters: 150 },
      { name: 'Gasthof zur Post', category: 'Gastronomie', distanceMeters: 80 }
    ]
  },
  {
    id: 'altastenberg-dorfplatz',
    name: 'Sahnehang / Astenberg Ladepunkt',
    operator: 'Innogy eMobility',
    address: 'Renauweg 23',
    district: 'Altastenberg',
    lat: 51.1890,
    lng: 8.4680,
    isFastCharger: false,
    maxPowerKw: 22,
    plugs: [
      { type: 'Type2', count: 2, powerKw: 22 }
    ],
    costInfo: 'eCharge App & Roaming',
    costInfo_nl: 'eCharge app & standaard roaming',
    parkingFeeInfo: 'Kostenfrei',
    parkingFeeInfo_nl: 'Gratis parkeren',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Skikarussell Altastenberg', category: 'Freizeit', distanceMeters: 140 },
      { name: 'Hotel & Restaurant Clemens', category: 'Gastronomie', distanceMeters: 90 },
      { name: 'Wanderweg Kahler Asten', category: 'Freizeit', distanceMeters: 200 }
    ]
  },
  {
    id: 'zueschen-feuerwehrhaus',
    name: 'Ladestation Züschen Dorfmitte',
    operator: 'Hochsauerland Energie',
    address: 'Nuhnetalstraße 42',
    district: 'Züschen',
    lat: 51.1550,
    lng: 8.5630,
    isFastCharger: false,
    maxPowerKw: 22,
    plugs: [
      { type: 'Type2', count: 2, powerKw: 22 }
    ],
    costInfo: 'Ladeverbund+ / Roaming',
    costInfo_nl: 'Ladeverbund+ & alle gangbare pasjes',
    parkingFeeInfo: 'Kostenfrei mit Parkscheibe (max. 3 Std.)',
    parkingFeeInfo_nl: 'Gratis met blauwe kaart (max. 3 uur)',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Gasthof Lumme', category: 'Gastronomie', distanceMeters: 60 },
      { name: 'Bäckerei & Café', category: 'Gastronomie', distanceMeters: 110 },
      { name: 'Borgs Scheune Kulturzentrum', category: 'Freizeit', distanceMeters: 180 }
    ]
  },
  {
    id: 'niedersfeld-hillebachsee',
    name: 'Hillebachsee Erholungsgebiet Ladestation',
    operator: 'Westenergie',
    address: 'Am Hillebachsee 1',
    district: 'Niedersfeld',
    lat: 51.2580,
    lng: 8.5350,
    isFastCharger: false,
    maxPowerKw: 22,
    plugs: [
      { type: 'Type2', count: 2, powerKw: 22 }
    ],
    costInfo: 'Westenergie / E.ON Drive',
    costInfo_nl: 'Westenergie / E.ON netwerk',
    parkingFeeInfo: 'Parkgebühr Seeparkplatz in der Sommersaison',
    parkingFeeInfo_nl: 'Standaard meer-parkeerticket in de zomer',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Hillebachsee Wasserski & Wakeboard', category: 'Freizeit', distanceMeters: 70 },
      { name: 'Seeterrasse Café & Restaurant', category: 'Gastronomie', distanceMeters: 90 },
      { name: 'Badebucht & Hochheide Wanderstart', category: 'Freizeit', distanceMeters: 150 }
    ]
  },
  {
    id: 'siedlinghausen-freibad',
    name: 'Freibad Siedlinghausen Ladestation',
    operator: 'Hochsauerland Energie',
    address: 'Am Bäcker 2',
    district: 'Siedlinghausen',
    lat: 51.2480,
    lng: 8.4890,
    isFastCharger: false,
    maxPowerKw: 22,
    plugs: [
      { type: 'Type2', count: 2, powerKw: 22 }
    ],
    costInfo: 'Ladeverbund+ & Roaming',
    costInfo_nl: 'Alle gangbare laadpassen',
    parkingFeeInfo: 'Kostenfreies Parken',
    parkingFeeInfo_nl: 'Gratis parkeren',
    availableHours: '24/7 geöffnet',
    nearbyHighlights: [
      { name: 'Freibad & Hallenbad Siedlinghausen', category: 'Freizeit', distanceMeters: 50 },
      { name: 'Sportplatz & Tennisplätze', category: 'Freizeit', distanceMeters: 120 },
      { name: 'Pizzeria & Ristorante', category: 'Gastronomie', distanceMeters: 250 }
    ]
  }
];
