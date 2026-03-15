const data = {
  "lakeLevel": "167.99ft 12:30pm",
  "currentWeather": {
    "temp": 66.94,
    "feels_like": 67.6,
    "description": "overcast clouds",
    "wind_speed": 13.87,
    "wind_deg": 192,
    "gust": 27.36,
    "sunrise": "07:24 AM",
    "sunset": "07:22 PM",
    "dayOrNight": "day",
    "humidity": 91,
    "uv_index": 0.44,
    "pressure": 1007,
    "moon_phase": 0.88,
    "visibility": 10000,
    "dew_point": 64.22
  },
  "fiveDayWeather": [
    {
      "date": "Monday",
      "high": 51.15,
      "low": 38.03,
      "description": "overcast clouds",
      "wind_speed": 17.94,
      "wind_deg": 345,
      "gust": 36.78,
      "humidity": 27,
      "uv_index": 5.19,
      "pressure": 1024,
      "moon_phase": 0.92,
      "dew_point": 14.77,
      "visibility": 10000
    },
    {
      "date": "Tuesday",
      "high": 56.61,
      "low": 33.31,
      "description": "scattered clouds",
      "wind_speed": 8.34,
      "wind_deg": 349,
      "gust": 22.62,
      "humidity": 23,
      "uv_index": 5.82,
      "pressure": 1028,
      "moon_phase": 0.95,
      "dew_point": 17.13,
      "visibility": 10000
    },
    {
      "date": "Wednesday",
      "high": 70.84,
      "low": 41.79,
      "description": "broken clouds",
      "wind_speed": 9.28,
      "wind_deg": 201,
      "gust": 23.06,
      "humidity": 43,
      "uv_index": 6.65,
      "pressure": 1023,
      "moon_phase": 0,
      "dew_point": 42.71,
      "visibility": "Unavailable"
    },
    {
      "date": "Thursday",
      "high": 76.69,
      "low": 51.53,
      "description": "scattered clouds",
      "wind_speed": 8.48,
      "wind_deg": 198,
      "gust": 23.24,
      "humidity": 47,
      "uv_index": 7,
      "pressure": 1022,
      "moon_phase": 0.02,
      "dew_point": 51.12,
      "visibility": "Unavailable"
    },
    {
      "date": "Friday",
      "high": 80.83,
      "low": 56.19,
      "description": "clear sky",
      "wind_speed": 9.1,
      "wind_deg": 193,
      "gust": 22.88,
      "humidity": 47,
      "uv_index": 7,
      "pressure": 1017,
      "moon_phase": 0.06,
      "dew_point": 55.58,
      "visibility": "Unavailable"
    }
  ],
  "weatherAlerts": [
    {
      "event": "Freeze Watch",
      "start": "1:00:00 AM",
      "end": "3:00:00 PM",
      "description": "* WHAT...For the Wind Advisory, Sunday southwest wind 15 to 20 mph\nwith gusts up to 25 mph expected, Monday northwest winds 10 to 20\nmph with gusts up to 35 mph expected. For the Freeze Watch,\nsub-freezing temperatures as low as 31 possible.\n\n* WHERE...In Louisiana, Avoyelles, Evangeline, Rapides, St. Landry,\nAllen, Beauregard, and Vernon Parishes. In Texas, Northern Newton\nCounty.\n\n* WHEN...For the Wind Advisory, until 6 PM CDT Monday. For the\nFreeze Watch, from Monday evening through Tuesday morning.\n\n* IMPACTS...Gusty winds will blow around unsecured objects. Tree\nlimbs could be blown down and a few power outages may result.\nFrost and freeze conditions could kill crops, other sensitive\nvegetation and possibly damage unprotected outdoor plumbing.",
      "sender": "NWS Lake Charles LA"
    },
    {
      "event": "Wind Advisory",
      "start": "3:00:00 PM",
      "end": "11:00:00 PM",
      "description": "* WHAT...For the Wind Advisory, Sunday southwest wind 15 to 20 mph\nwith gusts up to 25 mph expected, Monday northwest winds 10 to 20\nmph with gusts up to 35 mph expected. For the Freeze Watch,\nsub-freezing temperatures as low as 31 possible.\n\n* WHERE...In Louisiana, Avoyelles, Evangeline, Rapides, St. Landry,\nAllen, Beauregard, and Vernon Parishes. In Texas, Northern Newton\nCounty.\n\n* WHEN...For the Wind Advisory, until 6 PM CDT Monday. For the\nFreeze Watch, from Monday evening through Tuesday morning.\n\n* IMPACTS...Gusty winds will blow around unsecured objects. Tree\nlimbs could be blown down and a few power outages may result.\nFrost and freeze conditions could kill crops, other sensitive\nvegetation and possibly damage unprotected outdoor plumbing.",
      "sender": "NWS Lake Charles LA"
    },
    {
      "event": "Fire Weather Watch",
      "start": "4:00:00 PM",
      "end": "1:00:00 AM",
      "description": "...FIRE WEATHER WATCH AREA WIDE...\n\n.Windy and dry conditions behind a cold front may produce red\nflag conditons across much of the area Monday.\n\nThe National Weather Service in Lake Charles has issued a Fire\nWeather Watch for strong winds and low humidity, which is in\neffect from Monday morning through Monday evening.\n\n* AFFECTED AREA...Fire Weather Zone 027 Vernon, Fire Weather\nZone 028 Rapides, Fire Weather Zone 029 Avoyelles, Fire\nWeather Zone 030 Beauregard, Fire Weather Zone 031 Allen, Fire\nWeather Zone 032 Evangeline, Fire Weather Zone 033 St. Landry,\nFire Weather Zone 044 Lafayette, Fire Weather Zone 045 Upper\nSt. Martin, Fire Weather Zone 055 Lower St. Martin, Fire\nWeather Zone 073 West Cameron, Fire Weather Zone 074 East\nCameron, Fire Weather Zone 141 Northern Calcasieu, Fire\nWeather Zone 142 Northern Jefferson Davis, Fire Weather Zone\n143 Northern Acadia, Fire Weather Zone 152 Upper Vermilion,\nFire Weather Zone 153 Upper Iberia, Fire Weather Zone 154\nUpper St. Mary, Fire Weather Zone 180 Tyler, Fire Weather Zone\n201 Hardin, Fire Weather Zone 241 Southern Calcasieu, Fire\nWeather Zone 242 Southern Jefferson Davis, Fire Weather Zone\n243 Southern Acadia, Fire Weather Zone 252 Lower Vermilion,\nFire Weather Zone 253 Lower Iberia, Fire Weather Zone 254\nLower St. Mary, Fire Weather Zone 259 Northern Jasper, Fire\nWeather Zone 260 Northern Newton, Fire Weather Zone 261\nSouthern Jasper, Fire Weather Zone 262 Southern Newton, Fire\nWeather Zone 515 Upper Jefferson, Fire Weather Zone 516\nNorthern Orange, Fire Weather Zone 615 Lower Jefferson and\nFire Weather Zone 616 Southern Orange.\n\n* TIMING...From Monday morning through Monday evening.\n\n* WINDS...North 10 to 20 mph with gusts up to 30 mph.\n\n* RELATIVE HUMIDITY...As low as 21 percent.\n\n* TEMPERATURES...Up to 55.\n\n* IMPACTS...Any fire that develops will catch and spread\nquickly. Outdoor burning is not recommended.",
      "sender": "NWS Lake Charles LA"
    }
  ],
  "barometricPressureHistory": [
    1007,
    1007,
    1007,
    1006,
    1005,
    1004
  ],
  "fishingReport": {
    "date": "Feb 25, 2026",
    "report": "FAIR. 46 degrees; 4.06 feet below pool. Fishing has slowed significantly due to high winds and cold temperatures, with water temperatures dropping back into the mid-50s. A few fish are moving shallow, but presentations must be worked very slowly to get bites. The most consistent action is coming from mid-depth ranges of 8-14 feet using football jigs, Texas-rigged plastics, and crankbaits. Access to main-lake areas has been limited by wind, but conditions are expected to improve and fishing should return to more normal patterns by the weekend. Report by Stephen Johnston, Johnston Fishing."
  }
};