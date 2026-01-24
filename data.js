const data = {
  "lakeLevel": "167.99ft 12:30pm",
  "currentWeather": {
    "temp": 43.97,
    "feels_like": 38.23,
    "description": "overcast clouds",
    "wind_speed": 10.87,
    "wind_deg": 59,
    "gust": 21.63,
    "sunrise": "07:10 AM",
    "sunset": "05:42 PM",
    "dayOrNight": "night",
    "humidity": 81,
    "uv_index": 0,
    "pressure": 1021,
    "moon_phase": 0.2,
    "visibility": 10000,
    "dew_point": 38.53
  },
  "fiveDayWeather": [
    {
      "date": "Sunday",
      "high": 32.11,
      "low": 24.19,
      "description": "snow",
      "wind_speed": 13.8,
      "wind_deg": 327,
      "gust": 24.87,
      "humidity": 94,
      "uv_index": 3.34,
      "pressure": 1019,
      "moon_phase": 0.25,
      "dew_point": 28.63,
      "visibility": 7355
    },
    {
      "date": "Monday",
      "high": 31.66,
      "low": 15.71,
      "description": "broken clouds",
      "wind_speed": 11.92,
      "wind_deg": "No Data",
      "gust": 25.37,
      "humidity": 83,
      "uv_index": 4.51,
      "pressure": 1037,
      "moon_phase": 0.27,
      "dew_point": 24.73,
      "visibility": 3910
    },
    {
      "date": "Tuesday",
      "high": 38.77,
      "low": 14.14,
      "description": "broken clouds",
      "wind_speed": 4.47,
      "wind_deg": 201,
      "gust": 7.65,
      "humidity": 83,
      "uv_index": 4.27,
      "pressure": 1034,
      "moon_phase": 0.31,
      "dew_point": 29.73,
      "visibility": "Unavailable"
    },
    {
      "date": "Wednesday",
      "high": 44.64,
      "low": 26.94,
      "description": "broken clouds",
      "wind_speed": 6.08,
      "wind_deg": 357,
      "gust": 8.1,
      "humidity": 90,
      "uv_index": 5,
      "pressure": 1027,
      "moon_phase": 0.34,
      "dew_point": 41.74,
      "visibility": "Unavailable"
    },
    {
      "date": "Thursday",
      "high": 38.59,
      "low": 32.74,
      "description": "overcast clouds",
      "wind_speed": 8.88,
      "wind_deg": 69,
      "gust": 19.82,
      "humidity": 85,
      "uv_index": 5,
      "pressure": 1030,
      "moon_phase": 0.38,
      "dew_point": 34.29,
      "visibility": "Unavailable"
    }
  ],
  "weatherAlerts": [
    {
      "event": "Ice Storm Warning",
      "start": "12:00:00 AM",
      "end": "12:00:00 AM",
      "description": "* WHAT...Total ice accumulations around a tenth to up to a half inch\npossible.\n\n* WHERE...Portions of central, southwest, and west central Louisiana\nand southeast Texas.\n\n* WHEN...From 6 PM Saturday to 6 PM CST Sunday.\n\n* IMPACTS...Roads, and especially bridges and overpasses, will\nlikely become slick and hazardous. Power outages and tree damage\nare likely due to the ice. Travel could be nearly impossible.",
      "sender": "NWS Lake Charles LA"
    },
    {
      "event": "Extreme Cold Watch",
      "start": "12:00:00 AM",
      "end": "6:00:00 PM",
      "description": "* WHAT...For the Cold Weather Advisory, very cold wind chills\nranging from 13 to 26 degrees expected. For the Extreme Cold\nWatch, dangerously cold wind chills ranging from 0 to 10 possible.\n\n* WHERE...Portions of central, south central, southwest, and west\ncentral Louisiana and southeast Texas.\n\n* WHEN...For the Cold Weather Advisory, from 6 PM Saturday to noon\nCST Sunday. For the Extreme Cold Watch, from Sunday evening\nthrough Monday morning.\n\n* IMPACTS...Frostbite and hypothermia will occur if unprotected skin\nis exposed to these temperatures. An extended period of freezing\ntemperatures could cause ruptured water pipes.",
      "sender": "NWS Lake Charles LA"
    },
    {
      "event": "Cold Weather Advisory",
      "start": "12:00:00 AM",
      "end": "6:00:00 PM",
      "description": "* WHAT...For the Cold Weather Advisory, very cold wind chills as low\nas 15 expected. For the Extreme Cold Warning, dangerously cold\nwind chills as low as 4 above expected. For the Extreme Cold\nWatch, dangerously cold temperatures as low as 9 possible.\n\n* WHERE...Portions of central, south central, southwest, and west\ncentral Louisiana and southeast Texas.\n\n* WHEN...For the Cold Weather Advisory, from 6 PM Saturday to noon\nCST Sunday. For the Extreme Cold Warning, from 6 PM Sunday to noon\nCST Monday. For the Extreme Cold Watch, from Monday afternoon\nthrough Tuesday morning.\n\n* IMPACTS...Frostbite and hypothermia will occur if unprotected skin\nis exposed to these temperatures. An extended period of freezing\ntemperatures could cause ruptured water pipes.",
      "sender": "NWS Lake Charles LA"
    },
    {
      "event": "Extreme Cold Warning",
      "start": "12:00:00 AM",
      "end": "6:00:00 PM",
      "description": "* WHAT...For the Cold Weather Advisory, very cold wind chills as low\nas 15 expected. For the Extreme Cold Warning, dangerously cold\nwind chills as low as 4 above expected. For the Extreme Cold\nWatch, dangerously cold temperatures as low as 9 possible.\n\n* WHERE...Portions of central, south central, southwest, and west\ncentral Louisiana and southeast Texas.\n\n* WHEN...For the Cold Weather Advisory, from 6 PM Saturday to noon\nCST Sunday. For the Extreme Cold Warning, from 6 PM Sunday to noon\nCST Monday. For the Extreme Cold Watch, from Monday afternoon\nthrough Tuesday morning.\n\n* IMPACTS...Frostbite and hypothermia will occur if unprotected skin\nis exposed to these temperatures. An extended period of freezing\ntemperatures could cause ruptured water pipes.",
      "sender": "NWS Lake Charles LA"
    },
    {
      "event": "Extreme Cold Watch",
      "start": "6:00:00 PM",
      "end": "6:00:00 PM",
      "description": "* WHAT...For the Cold Weather Advisory, very cold wind chills as low\nas 15 expected. For the Extreme Cold Warning, dangerously cold\nwind chills as low as 4 above expected. For the Extreme Cold\nWatch, dangerously cold temperatures as low as 9 possible.\n\n* WHERE...Portions of central, south central, southwest, and west\ncentral Louisiana and southeast Texas.\n\n* WHEN...For the Cold Weather Advisory, from 6 PM Saturday to noon\nCST Sunday. For the Extreme Cold Warning, from 6 PM Sunday to noon\nCST Monday. For the Extreme Cold Watch, from Monday afternoon\nthrough Tuesday morning.\n\n* IMPACTS...Frostbite and hypothermia will occur if unprotected skin\nis exposed to these temperatures. An extended period of freezing\ntemperatures could cause ruptured water pipes.",
      "sender": "NWS Lake Charles LA"
    }
  ],
  "barometricPressureHistory": [
    1021,
    1021,
    1021,
    1021,
    1021,
    1020
  ],
  "fishingReport": {
    "date": "Jan 21, 2026",
    "report": "FAIR. 56 degrees; 4.13 feet below pool. This weekend is shaping up to be unsafe at the lake, with all tournaments canceled for Saturday and Sunday due to extreme weather conditions, including forecasting calling up to �½ to 1 inch of ice around the lake area. Ramps are expected to begin freezing Friday night, and anyone attempting to launch Saturday risks not being able to get their truck or boat back up the ramp, with limited emergency response available if trouble occurs, so everyone is strongly encouraged to stay off the water and avoid putting first responders at risk. Conditions should improve by Tuesday, with a return to more normal activity expected next week. Fishing has been tough this week as water temperatures have dropped back into the low 50s and are expected to fall into the 40s, making the shallow bite very difficult, while a deeper pattern should improve next week in 22-28 feet of water using spoons, drop shots, and swimbaits. Please be safe and use good judgement this weekend. Report by Stephen Johnston, Johnston Fishing."
  }
};