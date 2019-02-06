export interface IDepartureList {
  departures: IDepartureData[],
  stationName: string,
  stationInfo: {
    automat: string,
    sitzen: string
  }
}

export enum TransportTypeEnum {
  Train = 1,
  SBahn = 2,
  Metro = 3,
  Tram = 4,
  Bus = 5
}

export interface IDepartureData {
  name: string; // 701,
  lineNumber: string; // 701,
  subname: string; // Niederflurstrab,
  direction: string; // D-DOME/Am Hülserhof,
  directionCode: string; // R,
  route: string; // D-Merowingerstraße - Berliner Allee - Schadowstraße  - Mörsenbroich - D-Rath  - D-DOME/Am Hülserhof,
  type: TransportTypeEnum,
  platform: string; // Bstg. 2,
  delay: number; // 0,
  departureTimestamp: number;
  originalDepartureTimestamp: number;
}

export interface IDepartureResponse {
  name: string; // 701,
  lineNumber: string; // 701,
  lineCode: string; // 71701,
  subname: string; // Niederflurstrab,
  direction: string; // D-DOME/Am Hülserhof,
  directionCode: string; // R,
  route: string; // D-Merowingerstraße - Berliner Allee - Schadowstraße  - Mörsenbroich - D-Rath  - D-DOME/Am Hülserhof,
  type: number, // 1-6
  day: string; // 1,
  month: string; // 2,
  year: string; // 2019,
  hour: string; // 16,
  minute: string; // 01,
  orgDay: string; // 1,
  orgHour: string; // 16,
  orgMinute: string; // 01,
  countdown: number,
  platform: string; // Bstg. 2,
  delay: string; // 0,
  isRealTime: boolean,
  isDateOverflow: boolean,
  lineInfo: {
    lineInfo: {
      text: string;
      priority: number
    },
    lineBlocking: {
      text: string;
      priority: number
    }
  }
  fullTime: 1549033260,
  orgFullTime: 1549033260,
  supplement: string,
  key: string; // 332
}

const test = {
  "departureData": [
    {
      "name": "701",
      "lineNumber": "701",
      "lineCode": "71701",
      "subname": "Niederflurstrab",
      "direction": "D-DOME/Am Hülserhof",
      "directionCode": "R",
      "route": "D-Merowingerstraße - Berliner Allee - Schadowstraße  - Mörsenbroich - D-Rath  - D-DOME/Am Hülserhof",
      "type": 4,
      "day": "1",
      "month": "2",
      "year": "2019",
      "hour": "16",
      "minute": "01",
      "orgDay": "1",
      "orgHour": "16",
      "orgMinute": "01",
      "countdown": 0,
      "platform": "Bstg. 2",
      "delay": "0",
      "isRealTime": true,
      "isDateOverflow": false,
      "lineInfo": {
        "lineInfo": {
          "text": "",
          "priority": 0
        },
        "lineBlocking": {
          "text": "",
          "priority": 0
        }
      },
      "fullTime": 1549033260,
      "orgFullTime": 1549033260,
      "supplement": "",
      "key": "332"
    },
    {
      "name": "S6",
      "lineNumber": "S6",
      "lineCode": "92E06",
      "subname": "S-Bahn",
      "direction": "Essen Hauptbahnhof",
      "directionCode": "R",
      "route": "Essen Hauptbahnhof",
      "type": 2,
      "day": "1",
      "month": "2",
      "year": "2019",
      "hour": "16",
      "minute": "02",
      "orgDay": "1",
      "orgHour": "16",
      "orgMinute": "01",
      "countdown": 1,
      "platform": "2",
      "delay": "1",
      "isRealTime": true,
      "isDateOverflow": false,
      "lineInfo": {
        "lineInfo": {
          "text": "",
          "priority": 0
        },
        "lineBlocking": {
          "text": "",
          "priority": 0
        }
      },
      "fullTime": 1549033320,
      "orgFullTime": 1549033260,
      "supplement": "",
      "key": "30693"
    },
    {
      "name": "701",
      "lineNumber": "701",
      "lineCode": "71701",
      "subname": "Niederflurstrab",
      "direction": "D-Am Steinberg",
      "directionCode": "H",
      "route": "D-DOME/Am Hülserhof - D-Rath  - Mörsenbroich - Schadowstraße  - Berliner Allee - D-Am Steinberg",
      "type": 4,
      "day": "1",
      "month": "2",
      "year": "2019",
      "hour": "16",
      "minute": "08",
      "orgDay": "1",
      "orgHour": "16",
      "orgMinute": "08",
      "countdown": 7,
      "platform": "Bstg. 1",
      "delay": "0",
      "isRealTime": true,
      "isDateOverflow": false,
      "lineInfo": {
        "lineInfo": {
          "text": "",
          "priority": 0
        },
        "lineBlocking": {
          "text": "",
          "priority": 0
        }
      },
      "fullTime": 1549033680,
      "orgFullTime": 1549033680,
      "supplement": "",
      "key": "99"
    },
    {
      "name": "U71",
      "lineNumber": "U71",
      "lineCode": "70071",
      "subname": "U-Bahn",
      "direction": "D-Benrath Btf",
      "directionCode": "H",
      "route": "D-Rath  - Mörsenbroich - Heinrich-Heine-Allee  - D-Bilk  - Uni-Kliniken - Holthausen - D-Benrath Btf",
      "type": 3,
      "day": "1",
      "month": "2",
      "year": "2019",
      "hour": "16",
      "minute": "20",
      "orgDay": "1",
      "orgHour": "16",
      "orgMinute": "16",
      "countdown": 19,
      "platform": "Bstg. 1",
      "delay": "4",
      "isRealTime": true,
      "isDateOverflow": false,
      "lineInfo": {
        "lineInfo": {
          "text": "",
          "priority": 0
        },
        "lineBlocking": {
          "text": "",
          "priority": 0
        }
      },
      "fullTime": 1549034400,
      "orgFullTime": 1549034160,
      "supplement": "",
      "key": "179"
    },
    {
      "name": "S6",
      "lineNumber": "S6",
      "lineCode": "92E06",
      "subname": "S-Bahn",
      "direction": "Worringen S-Bahn,Worringen",
      "directionCode": "H",
      "route": "Worringen S-Bahn,Worringen",
      "type": 2,
      "day": "1",
      "month": "2",
      "year": "2019",
      "hour": "16",
      "minute": "19",
      "orgDay": "1",
      "orgHour": "16",
      "orgMinute": "19",
      "countdown": 18,
      "platform": "1",
      "delay": "0",
      "isRealTime": true,
      "isDateOverflow": false,
      "lineInfo": {
        "lineInfo": {
          "text": "",
          "priority": 0
        },
        "lineBlocking": {
          "text": "",
          "priority": 0
        }
      },
      "fullTime": 1549034340,
      "orgFullTime": 1549034340,
      "supplement": "",
      "key": "31600"
    },
    {
      "name": "S6",
      "lineNumber": "S6",
      "lineCode": "92E06",
      "subname": "S-Bahn",
      "direction": "Essen Hauptbahnhof",
      "directionCode": "R",
      "route": "Essen Hauptbahnhof",
      "type": 2,
      "day": "1",
      "month": "2",
      "year": "2019",
      "hour": "16",
      "minute": "21",
      "orgDay": "1",
      "orgHour": "16",
      "orgMinute": "21",
      "countdown": 20,
      "platform": "2",
      "delay": "0",
      "isRealTime": true,
      "isDateOverflow": false,
      "lineInfo": {
        "lineInfo": {
          "text": "",
          "priority": 0
        },
        "lineBlocking": {
          "text": "",
          "priority": 0
        }
      },
      "fullTime": 1549034460,
      "orgFullTime": 1549034460,
      "supplement": "",
      "key": "30697"
    }
  ],
  "departureInfo": {
    "stopInfo": {
      "text": ""
    },
    "stopBlocking": {
      "text": ""
    },
    "areaInfo": {
      "text": ""
    },
    "areaBlocking": {
      "text": ""
    }
  },
  "globalInfo": "",
  "stationName": "Düsseldorf, Rath S",
  "stationInfo": {
    "automat": "Fahrscheinautomat",
    "sitzen": "Sitzgelegenheiten"
  },
  "currentTime": 1549033285,
  "currentTimeReal": 1549033285
};