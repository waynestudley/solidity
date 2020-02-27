import { uuid } from "uuidv4";
import axios from "axios";

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

  let applicationId = 120; //dev
  const hostname = window.location.hostname;
  if (hostname === "testf2f.moneyexpert.com") {
    applicationId = 119; //test
  } else if (hostname === "f2f.moneyexpert.com") {
    applicationId = 118; //live
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

  axios
    .request({
      method: "POST",
      url:
        "http://monitoringws.moneyexpert.com/systemmonitoring.asmx/InsertLogGetV2",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: encodedDataToSend
    })
    .catch(function(error) {
      
      if (error.response) {
        // Request made and server responded
        console.log("LogError");
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("LogError", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("LogError", error.message);
      }
      
    });
}
