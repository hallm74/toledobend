const data = {
  "lakeLevel": "167.99ft 12:30pm",
  "currentWeather": {
    "temp": 42.78,
    "feels_like": 36.73,
    "description": "clear sky",
    "wind_speed": 10.89,
    "wind_deg": 4,
    "gust": 20.87,
    "sunrise": "06:37 AM",
    "sunset": "05:19 PM",
    "dayOrNight": "night",
    "humidity": 56,
    "uv_index": 0,
    "pressure": 1031,
    "moon_phase": 0.7,
    "visibility": 10000,
    "dew_point": 28.63
  },
  "fiveDayWeather": [
    {
      "date": "Tuesday",
      "high": 67.8,
      "low": 38.05,
      "description": "clear sky",
      "wind_speed": 12.19,
      "wind_deg": 184,
      "gust": 30.51,
      "humidity": 30,
      "uv_index": 4.12,
      "pressure": 1028,
      "moon_phase": 0.73,
      "dew_point": 27.27,
      "visibility": 10000
    },
    {
      "date": "Wednesday",
      "high": 78.42,
      "low": 51.98,
      "description": "few clouds",
      "wind_speed": 11.16,
      "wind_deg": 180,
      "gust": 25.52,
      "humidity": 54,
      "uv_index": 3.82,
      "pressure": 1022,
      "moon_phase": 0.75,
      "dew_point": 56.64,
      "visibility": 10000
    },
    {
      "date": "Thursday",
      "high": 76.62,
      "low": 60.57,
      "description": "few clouds",
      "wind_speed": 9.22,
      "wind_deg": 170,
      "gust": 24.45,
      "humidity": 52,
      "uv_index": 3.5,
      "pressure": 1021,
      "moon_phase": 0.8,
      "dew_point": 57.63,
      "visibility": "Unavailable"
    },
    {
      "date": "Friday",
      "high": 77.25,
      "low": 59.11,
      "description": "few clouds",
      "wind_speed": 9.35,
      "wind_deg": 173,
      "gust": 24.09,
      "humidity": 51,
      "uv_index": 4,
      "pressure": 1017,
      "moon_phase": 0.83,
      "dew_point": 57.63,
      "visibility": "Unavailable"
    },
    {
      "date": "Saturday",
      "high": 72.73,
      "low": 61.48,
      "description": "light rain",
      "wind_speed": 12.15,
      "wind_deg": 137,
      "gust": 27.96,
      "humidity": 70,
      "uv_index": 4,
      "pressure": 1012,
      "moon_phase": 0.86,
      "dew_point": 61,
      "visibility": "Unavailable"
    }
  ],
  "weatherAlerts": [
    {
      "event": "Freeze Watch",
      "start": "3:00:00 AM",
      "end": "3:00:00 PM",
      "description": "* WHAT...For the Freeze Warning, sub-freezing temperatures as low as\n25. For the Freeze Watch, sub-freezing temperatures as low as 29\npossible.\n\n* WHERE...In Louisiana, Rapides and Vernon Parishes. In Texas,\nNorthern Jasper, Northern Newton, and Tyler Counties.\n\n* WHEN...For the Freeze Warning, until 9 AM CST Monday. For the\nFreeze Watch, from Monday evening through Tuesday morning.\n\n* IMPACTS...Frost and freeze conditions could kill crops, other\nsensitive vegetation and possibly damage unprotected outdoor\nplumbing.",
      "sender": "NWS Lake Charles LA"
    },
    {
      "event": "Freeze Warning",
      "start": "3:40:00 AM",
      "end": "3:00:00 PM",
      "description": "* WHAT...For the Freeze Warning, sub-freezing temperatures as low as\n25. For the Freeze Watch, sub-freezing temperatures as low as 29\npossible.\n\n* WHERE...In Louisiana, Rapides and Vernon Parishes. In Texas,\nNorthern Jasper, Northern Newton, and Tyler Counties.\n\n* WHEN...For the Freeze Warning, until 9 AM CST Monday. For the\nFreeze Watch, from Monday evening through Tuesday morning.\n\n* IMPACTS...Frost and freeze conditions could kill crops, other\nsensitive vegetation and possibly damage unprotected outdoor\nplumbing.",
      "sender": "NWS Lake Charles LA"
    },
    {
      "event": "Red Flag Warning",
      "start": "3:00:00 PM",
      "end": "1:00:00 AM",
      "description": "...Fire weather warning in effect for Monday...\n\nElevated fire weather conditions will persist through Tuesday.\nVery dry air will settle over the region Monday with minimum\nrelative humidity around 20 to 35%. In addition, winds will be\nfrom the north around 10 to 20 MPH with gusts up to 25 MPH.\n\nThe National Weather Service in Lake Charles has issued a Red\nFlag Warning for low humidity and gusty winds, which is in effect\nfrom 9 AM to 7 PM CST Monday.\n\n* AFFECTED AREA...Fire Weather Zone 027 Vernon, Fire Weather\nZone 028 Rapides, Fire Weather Zone 029 Avoyelles, Fire\nWeather Zone 030 Beauregard, Fire Weather Zone 031 Allen, Fire\nWeather Zone 032 Evangeline, Fire Weather Zone 033 St. Landry,\nFire Weather Zone 044 Lafayette, Fire Weather Zone 045 Upper\nSt. Martin, Fire Weather Zone 055 Lower St. Martin, Fire\nWeather Zone 073 West Cameron, Fire Weather Zone 074 East\nCameron, Fire Weather Zone 141 Northern Calcasieu, Fire\nWeather Zone 142 Northern Jefferson Davis, Fire Weather Zone\n143 Northern Acadia, Fire Weather Zone 152 Upper Vermilion,\nFire Weather Zone 153 Upper Iberia, Fire Weather Zone 154\nUpper St. Mary, Fire Weather Zone 180 Tyler, Fire Weather Zone\n201 Hardin, Fire Weather Zone 241 Southern Calcasieu, Fire\nWeather Zone 242 Southern Jefferson Davis, Fire Weather Zone\n243 Southern Acadia, Fire Weather Zone 252 Lower Vermilion,\nFire Weather Zone 253 Lower Iberia, Fire Weather Zone 254\nLower St. Mary, Fire Weather Zone 259 Northern Jasper, Fire\nWeather Zone 260 Northern Newton, Fire Weather Zone 261\nSouthern Jasper, Fire Weather Zone 262 Southern Newton, Fire\nWeather Zone 515 Upper Jefferson, Fire Weather Zone 516\nNorthern Orange, Fire Weather Zone 615 Lower Jefferson and\nFire Weather Zone 616 Southern Orange.\n\n* TIMING...From 9 AM to 7 PM CST Monday.\n\n* WINDS...North 10 to 20 mph with gusts up to 25 mph.\n\n* RELATIVE HUMIDITY...As low as 20 percent.\n\n* TEMPERATURES...Up to 58.\n\n* LIGHTNING...None.\n\n* IMPACTS...Any fire that develops will catch and spread\nquickly. Outdoor burning is not recommended.",
      "sender": "NWS Lake Charles LA"
    }
  ],
  "barometricPressureHistory": [
    1031,
    1031,
    1031,
    1032,
    1033,
    1033
  ],
  "fishingReport": {
    "date": "Nov 5, 2025",
    "report": "FAIR. 90 degrees; 4.40 feet below pool. We’re finally getting a taste of fall on Toledo Bend, with water temperatures dropping into the mid-70s at press time. A cold front on the way should push temperatures down into the low 70s and upper 60s. The lake is fishing well overall, and bass can be caught from shallow to deep water. Early mornings have been productive with topwater baits, frogs, and buzzbaits, while later in the day, anglers are finding success with Carolina rigs and Texas rigs using bit worms in 12-18 feet of water. On windy days, the crankbait bite is picking up and should continue to improve as temperatures cool. A few smaller fish are being caught deeper in 20-25 feet, but most of the quality bites are coming shallower. No new crappie reports this week, though a few anglers mentioned the bite has been slow. Report by Stephen Johnston, Johnston Fishing."
  }
};