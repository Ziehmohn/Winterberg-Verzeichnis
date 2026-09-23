import { ChargingStation } from '../types';

export const CHARGING_STATIONS_DATA: ChargingStation[] = [
  {
    "id": "aral-pulse-hagenblech",
    "name": "Aral Pulse Hypercharger Am Hagenblech",
    "operator": "Aral Pulse",
    "address": "Am Hagenblech 60",
    "district": "Winterberg Kernstadt",
    "lat": 51.2012,
    "lng": 8.5318,
    "isFastCharger": true,
    "maxPowerKw": 300,
    "plugs": [
      {
        "type": "CCS",
        "count": 2,
        "powerKw": 300
      }
    ],
    "costInfo": "Aral pulse Tarif, Ad-Hoc Kartenzahlung oder Roaming (ADAC, EnBW, etc.)",
    "costInfo_nl": "Aral pulse tarief, bankpas/creditcard direct of roaming laadpassen",
    "parkingFeeInfo": "Kostenfreies Parken während des Ladevorgangs",
    "parkingFeeInfo_nl": "Gratis parkeren tijdens het laden",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Aral Tankstellen-Shop & PetitBistro",
        "category": "Einzelhandel",
        "distanceMeters": 20
      },
      {
        "name": "McDonald's Winterberg",
        "category": "Gastronomie",
        "distanceMeters": 50
      },
      {
        "name": "Kaufpark / Gewerbegebiet",
        "category": "Einzelhandel",
        "distanceMeters": 180
      }
    ]
  },
  {
    "id": "ewe-go-mcdonalds",
    "name": "EWE Go Schnellladestation McDonald's",
    "operator": "EWE Go",
    "address": "Am Hagenblech 58",
    "district": "Winterberg Kernstadt",
    "lat": 51.201,
    "lng": 8.531,
    "isFastCharger": true,
    "maxPowerKw": 150,
    "plugs": [
      {
        "type": "CCS",
        "count": 2,
        "powerKw": 150
      }
    ],
    "costInfo": "EWE Go Tarif, ADAC e-Charge oder gängige Roaming-Karten",
    "costInfo_nl": "EWE Go tarief of internationale roaming (Shell, ANWB, etc.)",
    "parkingFeeInfo": "Kostenloses Parken für Restaurantbesucher & Ladekunden",
    "parkingFeeInfo_nl": "Gratis parkeren voor gasten en laadklanten",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "McDonald's Restaurant mit McCafé",
        "category": "Gastronomie",
        "distanceMeters": 20
      },
      {
        "name": "Bikeshop & Skiverleih Klante",
        "category": "Ski, Bike & Sport",
        "distanceMeters": 150
      },
      {
        "name": "Edeka Center Winterberg",
        "category": "Einzelhandel",
        "distanceMeters": 250
      }
    ]
  },
  {
    "id": "enbw-am-waltenberg",
    "name": "EnBW Hypercharger Schnellladepark",
    "operator": "EnBW mobility+",
    "address": "Am Waltenberg 45",
    "district": "Winterberg Kernstadt",
    "lat": 51.1945,
    "lng": 8.532,
    "isFastCharger": true,
    "maxPowerKw": 300,
    "plugs": [
      {
        "type": "CCS",
        "count": 4,
        "powerKw": 300
      },
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "EnBW mobility+ Tarif oder Roaming (ADAC, Maingau, Shell Recharge, etc.)",
    "costInfo_nl": "EnBW tarief of roaming (Shell Recharge, Plugsurfing, ANWB, etc.)",
    "parkingFeeInfo": "Kostenfreies Parken während des Ladevorgangs (Parkscheibe bis 45 Min.)",
    "parkingFeeInfo_nl": "Gratis parkeren tijdens het laden (blauwe parkeerschijf max. 45 min.)",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Café & Bäckerei Isken",
        "category": "Gastronomie",
        "distanceMeters": 120
      },
      {
        "name": "Kaufpark Supermarkt",
        "category": "Einzelhandel",
        "distanceMeters": 150
      },
      {
        "name": "Kurpark Winterberg",
        "category": "Freizeit",
        "distanceMeters": 250
      }
    ]
  },
  {
    "id": "allego-remmeswiese",
    "name": "Allego High Power Charger Edeka Center",
    "operator": "Allego",
    "address": "Remmeswiese 21",
    "district": "Winterberg Kernstadt",
    "lat": 51.2025,
    "lng": 8.528,
    "isFastCharger": true,
    "maxPowerKw": 150,
    "plugs": [
      {
        "type": "CCS",
        "count": 2,
        "powerKw": 150
      },
      {
        "type": "CHAdeMO",
        "count": 1,
        "powerKw": 50
      },
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Ad-Hoc Zahlung per Kreditkarte oder gängige Ladekarten",
    "costInfo_nl": "Direct betalen met creditcard of Nederlandse laadpassen",
    "parkingFeeInfo": "Kostenloses Parken für Kunden",
    "parkingFeeInfo_nl": "Gratis parkeren voor winkelend publiek",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Edeka Center Winterberg",
        "category": "Einzelhandel",
        "distanceMeters": 40
      },
      {
        "name": "Aldi Nord",
        "category": "Einzelhandel",
        "distanceMeters": 100
      },
      {
        "name": "Bäckerei Isken Bistro",
        "category": "Gastronomie",
        "distanceMeters": 60
      }
    ]
  },
  {
    "id": "lidl-remmeswiese",
    "name": "Lidl DC-Schnellladestation",
    "operator": "Lidl Dienstleistung",
    "address": "Remmeswiese 4",
    "district": "Winterberg Kernstadt",
    "lat": 51.2018,
    "lng": 8.5275,
    "isFastCharger": true,
    "maxPowerKw": 50,
    "plugs": [
      {
        "type": "CCS",
        "count": 1,
        "powerKw": 50
      },
      {
        "type": "Type2",
        "count": 1,
        "powerKw": 22
      }
    ],
    "costInfo": "Günstiges Laden über die Lidl Plus App oder Ad-Hoc",
    "costInfo_nl": "Voordelig laden via de Lidl Plus app of direct betalen",
    "parkingFeeInfo": "Kostenloses Parken während der Einkaufszeit (max. 1 Std.)",
    "parkingFeeInfo_nl": "Gratis parkeren tijdens het winkelen (max. 1 uur)",
    "availableHours": "Mo–Sa 07:00 – 21:00 Uhr",
    "nearbyHighlights": [
      {
        "name": "Lidl Filiale Winterberg",
        "category": "Einzelhandel",
        "distanceMeters": 20
      },
      {
        "name": "Takko & Deichmann",
        "category": "Einzelhandel",
        "distanceMeters": 120
      }
    ]
  },
  {
    "id": "skiliftkarussell-bremberg-p1",
    "name": "Skiliftkarussell P1 Bremberg Ladepark",
    "operator": "Skiliftkarussell Winterberg",
    "address": "Am Bremberg (Parkplatz P1)",
    "district": "Winterberg Kernstadt",
    "lat": 51.185,
    "lng": 8.514,
    "isFastCharger": true,
    "maxPowerKw": 150,
    "plugs": [
      {
        "type": "CCS",
        "count": 2,
        "powerKw": 150
      },
      {
        "type": "Type2",
        "count": 4,
        "powerKw": 22
      }
    ],
    "costInfo": "Spontanladen per QR-Code oder gängige Apps (EnBW, Maingau, etc.)",
    "costInfo_nl": "Eenvoudig laden via QR-code of bekende laadapps",
    "parkingFeeInfo": "Regulärer Parkplatztarif des Skiliftkarussells",
    "parkingFeeInfo_nl": "Standaard parkeertarief skiliftparkeerplaats",
    "availableHours": "Täglich 07:00 – 22:00 Uhr",
    "nearbyHighlights": [
      {
        "name": "Brembergklause Restaurant",
        "category": "Gastronomie",
        "distanceMeters": 80
      },
      {
        "name": "Skiverleih Schneider",
        "category": "Ski, Bike & Sport",
        "distanceMeters": 100
      },
      {
        "name": "Skiliftkarussell Kasse & Lifte",
        "category": "Freizeit",
        "distanceMeters": 50
      }
    ]
  },
  {
    "id": "he-bahnhof-winterberg",
    "name": "HochsauerlandEnergie Ladestation Bürgerbahnhof",
    "operator": "HochsauerlandEnergie GmbH",
    "address": "Bahnhofstraße 12",
    "district": "Winterberg Kernstadt",
    "lat": 51.1985,
    "lng": 8.536,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 4,
        "powerKw": 22
      }
    ],
    "costInfo": "Ladeverbund+ & alle gängigen Roamingkarten",
    "costInfo_nl": "Geschikt voor alle reguliere laadpassen",
    "parkingFeeInfo": "P+R Parkplatz – mit Parkschein (erste Stunde frei)",
    "parkingFeeInfo_nl": "P+R parkeerplaats – eerste uur gratis met ticket",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Bahnhof Winterberg (RE57)",
        "category": "Mobilität & KFZ",
        "distanceMeters": 30
      },
      {
        "name": "Bürgerservice im Bürgerbahnhof",
        "category": "Dienstleistungen",
        "distanceMeters": 40
      },
      {
        "name": "City Center Winterberg",
        "category": "Einzelhandel",
        "distanceMeters": 300
      }
    ]
  },
  {
    "id": "rathaus-markt-winterberg",
    "name": "Rathaus Winterberg / Fichtenweg",
    "operator": "Mennekes Digital / Stadt Winterberg",
    "address": "Fichtenweg 10",
    "district": "Winterberg Kernstadt",
    "lat": 51.196,
    "lng": 8.53,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Ad-Hoc per QR-Code oder gängige Roaming-Partner",
    "costInfo_nl": "Direct betalen via QR of gangbare laadpassen",
    "parkingFeeInfo": "Parkscheibe während des Ladevorgangs erforderlich",
    "parkingFeeInfo_nl": "Blauwe parkeerschijf verplicht tijdens het laden",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Rathaus der Stadt Winterberg",
        "category": "Dienstleistungen",
        "distanceMeters": 30
      },
      {
        "name": "Marktplatz Untere Pforte",
        "category": "Freizeit",
        "distanceMeters": 120
      },
      {
        "name": "Brauhaus Winterberg",
        "category": "Gastronomie",
        "distanceMeters": 190
      }
    ]
  },
  {
    "id": "marktplatz-untere-pforte",
    "name": "Marktplatz / Untere Pforte Ladesäule",
    "operator": "Westenergie AG",
    "address": "Am Waltenberg 2",
    "district": "Winterberg Kernstadt",
    "lat": 51.1964,
    "lng": 8.5344,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "E.ON Drive, Mobility+ und alle Roamingkarten",
    "costInfo_nl": "E.ON Drive app en internationale laadpassen",
    "parkingFeeInfo": "Parkscheibe 3 Std. Höchstparkdauer während Ladevorgang",
    "parkingFeeInfo_nl": "Max. 3 uur parkeren met parkeerschijf tijdens het laden",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Marktplatz & Fußgängerzone",
        "category": "Einzelhandel",
        "distanceMeters": 30
      },
      {
        "name": "Café Krämer",
        "category": "Gastronomie",
        "distanceMeters": 80
      },
      {
        "name": "Restaurant Athen",
        "category": "Gastronomie",
        "distanceMeters": 110
      }
    ]
  },
  {
    "id": "tourist-info-kurpark",
    "name": "Tourist Information & Kurpark Ladestation",
    "operator": "HochsauerlandEnergie",
    "address": "Am Kurpark 4",
    "district": "Winterberg Kernstadt",
    "lat": 51.197,
    "lng": 8.5375,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Ladeverbund+ & alle gängigen Ladekarten",
    "costInfo_nl": "Alle gangbare laadpassen worden geaccepteerd",
    "parkingFeeInfo": "Kostenpflichtig / Parkscheinautomat",
    "parkingFeeInfo_nl": "Betaald parkeren met parkeerticket",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Tourist Information Winterberg",
        "category": "Dienstleistungen",
        "distanceMeters": 20
      },
      {
        "name": "Kurpark Winterberg",
        "category": "Freizeit",
        "distanceMeters": 50
      },
      {
        "name": "Schwimmbad Winterberg",
        "category": "Freizeit",
        "distanceMeters": 220
      }
    ]
  },
  {
    "id": "hotel-der-brabander",
    "name": "Vakantiehotel Der Brabander Ladestation",
    "operator": "Tesla Destination & Hotel",
    "address": "Am Waltenberg 65",
    "district": "Winterberg Kernstadt",
    "lat": 51.1937,
    "lng": 8.5309,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 4,
        "powerKw": 22
      }
    ],
    "costInfo": "Für Hotel- und Restaurantgäste freigeschaltet (Rezeption)",
    "costInfo_nl": "Beschikbaar voor hotel- en restaurantgasten (meld bij receptie)",
    "parkingFeeInfo": "Hotelgäste / Restaurantgäste frei",
    "parkingFeeInfo_nl": "Gratis voor gasten van hotel en horeca",
    "availableHours": "24/7 zugänglich",
    "nearbyHighlights": [
      {
        "name": "Restaurant Der Brabander & Pannenkoekenhuis",
        "category": "Gastronomie",
        "distanceMeters": 20
      },
      {
        "name": "Herrloh Skiliftkarussell",
        "category": "Freizeit",
        "distanceMeters": 100
      }
    ]
  },
  {
    "id": "hotel-oversum",
    "name": "Oversum Ski & Vital Resort Ladepunkte",
    "operator": "Hotel Oversum",
    "address": "Am Kurpark 6",
    "district": "Winterberg Kernstadt",
    "lat": 51.198,
    "lng": 8.539,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 4,
        "powerKw": 22
      }
    ],
    "costInfo": "Abrechnung über Hotelrezeption oder Ladekarte",
    "costInfo_nl": "Afrekenen via hotelreceptie of laadpas",
    "parkingFeeInfo": "Tiefgarage & Hotelparkplatz",
    "parkingFeeInfo_nl": "Parkeergarage hotel",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Oversum Spa & Wellness",
        "category": "Gesundheit & Medizin",
        "distanceMeters": 30
      },
      {
        "name": "Stadthalle Oversum",
        "category": "Freizeit",
        "distanceMeters": 50
      }
    ]
  },
  {
    "id": "landal-winterberg",
    "name": "Landal Ferienpark Winterberg",
    "operator": "Road / Landal",
    "address": "In der Büre 21",
    "district": "Winterberg Kernstadt",
    "lat": 51.1884,
    "lng": 8.5157,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 6,
        "powerKw": 22
      }
    ],
    "costInfo": "Road App, Shell Recharge, Plugsurfing und gängige Karten",
    "costInfo_nl": "Road app, Shell Recharge, ANWB en internationale passen",
    "parkingFeeInfo": "Kostenloses Parken während des Ladens für Parkgäste",
    "parkingFeeInfo_nl": "Gratis parkeren voor parkgasten tijdens het laden",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Landal Parkrestaurant & Café",
        "category": "Gastronomie",
        "distanceMeters": 40
      },
      {
        "name": "Golfclub Winterberg",
        "category": "Freizeit",
        "distanceMeters": 200
      }
    ]
  },
  {
    "id": "hotel-engemann-kurve",
    "name": "Hotel Engemann Kurve Ladesäule",
    "operator": "Mennekes Digital",
    "address": "Bahnhofstraße 15",
    "district": "Winterberg Kernstadt",
    "lat": 51.199,
    "lng": 8.535,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Mennekes At-Home / e-Roaming & Restaurantgäste",
    "costInfo_nl": "Roaming laadpassen of via hotelreceptie",
    "parkingFeeInfo": "Hotelparkplatz",
    "parkingFeeInfo_nl": "Hotelparkeerplaats",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Restaurant Engemann Kurve",
        "category": "Gastronomie",
        "distanceMeters": 20
      },
      {
        "name": "Bürgerbahnhof",
        "category": "Dienstleistungen",
        "distanceMeters": 80
      }
    ]
  },
  {
    "id": "bergresort-station5",
    "name": "Bergresort Station5 Ladestation",
    "operator": "Station5 / reev",
    "address": "Am Waltenberg 72",
    "district": "Winterberg Kernstadt",
    "lat": 51.1925,
    "lng": 8.5285,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 8,
        "powerKw": 22
      }
    ],
    "costInfo": "reev App, Ad-Hoc Kreditkarte oder gängige Ladekarten",
    "costInfo_nl": "reev app, creditcard direct of gangbare laadpassen",
    "parkingFeeInfo": "Kostenfreies Laden für Hausgäste, öffentliche Nutzung möglich",
    "parkingFeeInfo_nl": "Gratis voor verblijfsgasten, ook openbaar toegankelijk",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Skilift Herrloh & Rauher Busch",
        "category": "Freizeit",
        "distanceMeters": 90
      },
      {
        "name": "Bikeschule Winterberg",
        "category": "Ski, Bike & Sport",
        "distanceMeters": 150
      }
    ]
  },
  {
    "id": "cafe-extrablatt",
    "name": "Café Extrablatt / Neue Mitte",
    "operator": "Café Extrablatt GmbH",
    "address": "Am Waltenberg 11",
    "district": "Winterberg Kernstadt",
    "lat": 51.1944,
    "lng": 8.5328,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Ad-Hoc & gängige Ladekarten",
    "costInfo_nl": "Direct betalen of via standaard laadpassen",
    "parkingFeeInfo": "Öffentlicher Parkplatz Neue Mitte",
    "parkingFeeInfo_nl": "Openbare parkeerplaats Neue Mitte",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Café Extrablatt Restaurant",
        "category": "Gastronomie",
        "distanceMeters": 20
      },
      {
        "name": "Einkaufszentrum Neue Mitte",
        "category": "Einzelhandel",
        "distanceMeters": 40
      }
    ]
  },
  {
    "id": "erlebnisberg-kappe-bobbahn",
    "name": "Erlebnisberg Kappe & VELTINS-EisArena",
    "operator": "E.ON Drive",
    "address": "Kappe 2",
    "district": "Winterberg Kernstadt",
    "lat": 51.181,
    "lng": 8.508,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 4,
        "powerKw": 22
      }
    ],
    "costInfo": "E.ON Drive App, RFID oder Roaming",
    "costInfo_nl": "E.ON Drive app of laadpas",
    "parkingFeeInfo": "Parkgebühr für Großraumparkplatz Kappe",
    "parkingFeeInfo_nl": "Parkeertarief recreatieberg Kappe",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Panorama Erlebnis Brücke",
        "category": "Freizeit",
        "distanceMeters": 90
      },
      {
        "name": "Bikepark Winterberg",
        "category": "Ski, Bike & Sport",
        "distanceMeters": 110
      },
      {
        "name": "VELTINS-EisArena (Bobbahn)",
        "category": "Freizeit",
        "distanceMeters": 200
      }
    ]
  },
  {
    "id": "skiliftkarussell-poppenberg-p4",
    "name": "Skiliftkarussell P4 Poppenberg",
    "operator": "Skiliftkarussell Winterberg",
    "address": "Am Poppenberg / Möhnestraße",
    "district": "Winterberg Kernstadt",
    "lat": 51.187,
    "lng": 8.519,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Spontanladen per QR-Code oder gängige Ladekarten",
    "costInfo_nl": "Direct laden via QR-code of laadapp",
    "parkingFeeInfo": "Parkplatz P4 Skiliftkarussell",
    "parkingFeeInfo_nl": "Parkeerplaats P4 skilift",
    "availableHours": "Täglich 08:00 – 22:00 Uhr",
    "nearbyHighlights": [
      {
        "name": "Poppenberghütte & Après-Ski",
        "category": "Gastronomie",
        "distanceMeters": 60
      },
      {
        "name": "Skilift Poppenberg Express",
        "category": "Freizeit",
        "distanceMeters": 40
      }
    ]
  },
  {
    "id": "remmeswiese-3-reev",
    "name": "Gewerbegebiet Remmeswiese 3",
    "operator": "reev / DEONE",
    "address": "Remmeswiese 3",
    "district": "Winterberg Kernstadt",
    "lat": 51.2011,
    "lng": 8.5277,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "reev App & alle gängigen Roamingkarten",
    "costInfo_nl": "reev app en internationale roaming",
    "parkingFeeInfo": "Kunden- & Besucherparkplatz",
    "parkingFeeInfo_nl": "Klantenparkeerplaats",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Umladestation & Wertstoffhof Remmeswiese",
        "category": "Dienstleistungen",
        "distanceMeters": 150
      },
      {
        "name": "Fachmärkte Remmeswiese",
        "category": "Einzelhandel",
        "distanceMeters": 100
      }
    ]
  },
  {
    "id": "siedlinghausen-freibad",
    "name": "Siedlinghausen Freibad & Sportzentrum",
    "operator": "Westenergie / Innogy",
    "address": "Hochsauerlandstraße 60",
    "district": "Siedlinghausen",
    "lat": 51.2577,
    "lng": 8.5297,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Westenergie, E.ON Drive & Roamingkarten",
    "costInfo_nl": "Westenergie / E.ON netwerk en internationale laadpassen",
    "parkingFeeInfo": "Kostenfreier Parkplatz Freibad",
    "parkingFeeInfo_nl": "Gratis parkeren zwembad",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Freibad Siedlinghausen",
        "category": "Freizeit",
        "distanceMeters": 50
      },
      {
        "name": "Netto Marken-Discount",
        "category": "Einzelhandel",
        "distanceMeters": 120
      },
      {
        "name": "Bäckerei Tismes Café",
        "category": "Gastronomie",
        "distanceMeters": 400
      }
    ]
  },
  {
    "id": "siedlinghausen-gewerbegebiet",
    "name": "Siedlinghausen Heinrich-Sommer-Straße",
    "operator": "Westenergie",
    "address": "Heinrich-Sommer-Straße 4",
    "district": "Siedlinghausen",
    "lat": 51.2458,
    "lng": 8.5285,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Gängige Ladekarten und Ad-Hoc QR",
    "costInfo_nl": "Standaard laadpassen en QR-directbetaling",
    "parkingFeeInfo": "Kostenfreies Parken",
    "parkingFeeInfo_nl": "Gratis parkeren",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Gewerbegebiet Siedlinghausen",
        "category": "Handwerk",
        "distanceMeters": 50
      }
    ]
  },
  {
    "id": "niedersfeld-dorfhalle",
    "name": "Niedersfeld Dorfhalle & Zentrum",
    "operator": "Westenergie AG",
    "address": "Josefsweg 2",
    "district": "Niedersfeld",
    "lat": 51.2558,
    "lng": 8.5591,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Westenergie / E.ON Drive & Roaming",
    "costInfo_nl": "E.ON / Westenergie netwerk",
    "parkingFeeInfo": "Kostenfreier Gemeindeparkplatz Dorfhalle",
    "parkingFeeInfo_nl": "Gratis parkeren bij het dorpshuis",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Bäckerei Isken Niedersfeld",
        "category": "Gastronomie",
        "distanceMeters": 180
      },
      {
        "name": "Dorfhalle & Kurpark Niedersfeld",
        "category": "Freizeit",
        "distanceMeters": 50
      }
    ]
  },
  {
    "id": "niedersfeld-hillebachsee",
    "name": "Niedersfeld Hillebachsee Freizeitanlage",
    "operator": "Westenergie AG",
    "address": "Grönebacher Straße (Parkplatz See)",
    "district": "Niedersfeld",
    "lat": 51.251,
    "lng": 8.563,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Westenergie / E.ON Drive & gängige Ladekarten",
    "costInfo_nl": "Westenergie en internationale roaming",
    "parkingFeeInfo": "Öffentlicher Parkplatz Hillebachsee",
    "parkingFeeInfo_nl": "Openbare parkeerplaats recreatiemeer",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Hillebachsee Wakeboarding & Baden",
        "category": "Freizeit",
        "distanceMeters": 80
      },
      {
        "name": "Bootsterrassen Restaurant",
        "category": "Gastronomie",
        "distanceMeters": 120
      }
    ]
  },
  {
    "id": "zueschen-dorfplatz",
    "name": "Züschen Dorfplatz / Hardtstraße",
    "operator": "Westenergie / Innogy",
    "address": "Hardtstraße 2 (Dorfmitte)",
    "district": "Züschen",
    "lat": 51.1522,
    "lng": 8.5607,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Westenergie, E.ON Drive & alle Roamingkarten",
    "costInfo_nl": "Geschikt voor alle Nederlandse & Europese laadpassen",
    "parkingFeeInfo": "Kostenloses Parken am Dorfplatz",
    "parkingFeeInfo_nl": "Gratis parkeren op het dorpsplein",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Dorfgasthof Stöber",
        "category": "Gastronomie",
        "distanceMeters": 70
      },
      {
        "name": "Bäckerei & Café Züschen",
        "category": "Gastronomie",
        "distanceMeters": 100
      },
      {
        "name": "Haus des Gastes Züschen",
        "category": "Dienstleistungen",
        "distanceMeters": 120
      }
    ]
  },
  {
    "id": "zueschen-homberg-skigebiet",
    "name": "Züschen Mein Homberg Skigebiet",
    "operator": "Mein Homberg / Westenergie",
    "address": "Am Homberg 1",
    "district": "Züschen",
    "lat": 51.145,
    "lng": 8.572,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "QR-Code Direktzahlung oder Ladekarte",
    "costInfo_nl": "Direct betalen via QR of laadpas",
    "parkingFeeInfo": "Liftparkplatz für Skifahrer & Wanderer",
    "parkingFeeInfo_nl": "Liftparkeerplaats voor skiërs en wandelaars",
    "availableHours": "Täglich 08:00 – 20:00 Uhr",
    "nearbyHighlights": [
      {
        "name": "Homberg Jause Berggasthaus",
        "category": "Gastronomie",
        "distanceMeters": 40
      },
      {
        "name": "Skigebiet Snow World Züschen",
        "category": "Freizeit",
        "distanceMeters": 50
      }
    ]
  },
  {
    "id": "neuastenberg-postwiese",
    "name": "Neuastenberg Skigebiet Postwiese",
    "operator": "ecotap / Postwiese",
    "address": "Winterberger Straße 8",
    "district": "Neuastenberg",
    "lat": 51.166,
    "lng": 8.4866,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "ecotap netwerk, Shell Recharge, ANWB, EnBW, etc.",
    "costInfo_nl": "ecotap netwerk, uitstekend voor Nederlandse laadpassen",
    "parkingFeeInfo": "Parkplatz Postwiese Skigebiet",
    "parkingFeeInfo_nl": "Parkeerplaats skigebied Postwiese",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Postwiese Skikarussell & Funpark",
        "category": "Freizeit",
        "distanceMeters": 50
      },
      {
        "name": "Westdeutsches Wintersport-Museum",
        "category": "Freizeit",
        "distanceMeters": 150
      },
      {
        "name": "Gasthof Zur Post",
        "category": "Gastronomie",
        "distanceMeters": 100
      }
    ]
  },
  {
    "id": "altastenberg-skikarussell",
    "name": "Altastenberg Skikarussell Astenstraße",
    "operator": "Westenergie AG",
    "address": "Astenstraße 15",
    "district": "Altastenberg",
    "lat": 51.1857,
    "lng": 8.4902,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Westenergie / E.ON Drive & gängige Ladekarten",
    "costInfo_nl": "E.ON Drive en internationale laadpassen",
    "parkingFeeInfo": "Skilift- & Dorfplatz-Parkplatz",
    "parkingFeeInfo_nl": "Parkeerplaats dorpsplein en skilift",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Skikarussell Altastenberg Lifte",
        "category": "Freizeit",
        "distanceMeters": 80
      },
      {
        "name": "Hotel & Restaurant Altastenberg",
        "category": "Gastronomie",
        "distanceMeters": 120
      }
    ]
  },
  {
    "id": "langewiese-bundesstrasse",
    "name": "Langewiese Bundesstraße B236",
    "operator": "Westenergie AG",
    "address": "Bundesstraße B236 (Nähe TinQ)",
    "district": "Langewiese",
    "lat": 51.155,
    "lng": 8.478,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Westenergie / E.ON Drive Roaming",
    "costInfo_nl": "Standaard internationale laadpassen",
    "parkingFeeInfo": "Kostenfreier Parkplatz an der B236",
    "parkingFeeInfo_nl": "Gratis parkeren langs de B236",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Landgasthof Gilsbach",
        "category": "Gastronomie",
        "distanceMeters": 120
      },
      {
        "name": "Langlaufzentrum Langewiese",
        "category": "Ski, Bike & Sport",
        "distanceMeters": 200
      }
    ]
  },
  {
    "id": "groenebach-lambertusplatz",
    "name": "Grönebach Lambertusplatz Dorfmitte",
    "operator": "Westenergie AG",
    "address": "Küstelberger Straße 2",
    "district": "Grönebach",
    "lat": 51.223,
    "lng": 8.6041,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Westenergie, E.ON Drive & Roaming",
    "costInfo_nl": "Westenergie / E.ON netwerk",
    "parkingFeeInfo": "Kostenfreies Parken am Dorfplatz",
    "parkingFeeInfo_nl": "Gratis parkeren op het dorpsplein",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Historische Lambertus-Kirche",
        "category": "Freizeit",
        "distanceMeters": 30
      },
      {
        "name": "Wanderportal Grönebach",
        "category": "Freizeit",
        "distanceMeters": 50
      }
    ]
  },
  {
    "id": "silbach-bahnhof",
    "name": "Silbach Bahnhof & Bürgerhaus",
    "operator": "Westenergie AG",
    "address": "Bergstraße 4",
    "district": "Silbach",
    "lat": 51.2402,
    "lng": 8.5261,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Westenergie / E.ON Drive & Roaming",
    "costInfo_nl": "Alle gangbare laadpassen",
    "parkingFeeInfo": "P+R Parkplatz Bahnhof Silbach (kostenfrei)",
    "parkingFeeInfo_nl": "Gratis P+R station Silbach",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Haltepunkt Silbach (Bahn)",
        "category": "Mobilität & KFZ",
        "distanceMeters": 20
      },
      {
        "name": "Bürgerhaus Silbach",
        "category": "Freizeit",
        "distanceMeters": 60
      }
    ]
  },
  {
    "id": "kahler-asten-turm",
    "name": "Kahler Asten Astenturm Parkplatz",
    "operator": "Westenergie AG",
    "address": "Astenturm 1",
    "district": "Winterberg Kernstadt",
    "lat": 51.1795,
    "lng": 8.49,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 2,
        "powerKw": 22
      }
    ],
    "costInfo": "Westenergie, E.ON Drive & Roaming",
    "costInfo_nl": "E.ON Drive en reguliere laadpassen",
    "parkingFeeInfo": "Großraumparkplatz Kahler Asten (Parkschein)",
    "parkingFeeInfo_nl": "Parkeerplaats Kahler Asten (betaald)",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Astenturm & Wetterstation",
        "category": "Freizeit",
        "distanceMeters": 40
      },
      {
        "name": "Turmrestaurant Kahler Asten",
        "category": "Gastronomie",
        "distanceMeters": 50
      },
      {
        "name": "Hochheide Lehrpfad",
        "category": "Freizeit",
        "distanceMeters": 60
      }
    ]
  },
  {
    "id": "berghotel-hoher-knochen",
    "name": "Berghotel Hoher Knochen Ladesäule",
    "operator": "Wirelane GmbH",
    "address": "Hoher Knochen 1",
    "district": "Winterberg Kernstadt",
    "lat": 51.1623,
    "lng": 8.4505,
    "isFastCharger": false,
    "maxPowerKw": 22,
    "plugs": [
      {
        "type": "Type2",
        "count": 4,
        "powerKw": 22
      }
    ],
    "costInfo": "Wirelane App, RFID & Roaming",
    "costInfo_nl": "Wirelane app en laadpassen",
    "parkingFeeInfo": "Hotel- & Wanderparkplatz",
    "parkingFeeInfo_nl": "Parkeerplaats hotel & wandelaars",
    "availableHours": "24/7 geöffnet",
    "nearbyHighlights": [
      {
        "name": "Restaurant Berghotel Hoher Knochen",
        "category": "Gastronomie",
        "distanceMeters": 30
      },
      {
        "name": "Rothaarkamm Wanderwege",
        "category": "Freizeit",
        "distanceMeters": 50
      }
    ]
  }
];
