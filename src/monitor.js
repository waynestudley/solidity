import { uuid } from "uuidv4";

export function getSession() {
  return window.sessionStorage.getItem("sessionId");
}

export function initLog() {
  window.sessionStorage.setItem("sessionId", uuid());
}

export function insertLog(level, description, message) {
  let levelLookup = [];
  levelLookup[1] = "Normal";
  levelLookup[2] = "Validation";
  levelLookup[3] = "Error";
  levelLookup[4] = "Warning";

  console.log(levelLookup[level], description, message);

  let applicationId = 117; //dev
  const hostname = window.location.hostname;
  if (hostname === "testf2f.moneyexpert.com") {
    applicationId = 116; //test
  } else if (hostname === "f2f.moneyexpert.com") {
    applicationId = 115; //live
  }

  const dataToSend = {
    intApplicationId: applicationId,
    intLogCategoryId: 40, // "Javascript"
    intLogType: level,
    strDescription: description,
    strMessage: message,
    strSessionId: getSession() || ""
  };

  const encodedDataToSend = Object.entries(dataToSend).reduce(
    (str, [key, value]) => `${str}&${key}=${encodeURIComponent(value)}`,
    ""
  );

  /* 
  let intApplicationId:	
  intLogCategoryId:	
  intLogType:	
  strDescription:	
  strMessage:	
  strSessionId:
  */
  if (hostname !== "f2f.moneyexpert.com") {
    fetch(
      "http://monitoringws.moneyexpert.com/systemmonitoring.asmx/InsertLogGetV2",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: encodedDataToSend
      }
    )
      .then(function(data) {
        //console.log("Request success: ", data);
      })
      .catch(function(error) {
        console.log("LogError: ", error);
      });
  }
}
