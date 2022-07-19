const API_SERVER = "http://27.71.235.82";


export default async function getDataFireAlarm(V_P_SEND, V_P_EMAIL, V_P_TOKEN) {
    return await fetch(`${API_SERVER}/FireAlarmNotification/GetDataFireAlarm`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SEND: V_P_SEND,
          EMAIL_ADDRESS: V_P_EMAIL,
          TOKEN: V_P_TOKEN,
        }),
      })
        .then((response) => response.json())
        .then((json) => {return Object.values(json)});
}
export async function DeleteFireAlarm(V_P_EMAIL, V_P_ORD) {
  // declare the async data fetching function
  return await fetch(`${API_SERVER}/FireAlarmNotification/DeleteFireAlarm`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      EMAIL_ADDRESS: V_P_EMAIL,
      ORD: V_P_ORD,
    }),
  })
    .then((response) => response.json())
    .then((json) => {return Object.values(json)})
    .catch((error) => {
      console.error(error);
    });
}
export async function getDataScadaAlarm(V_P_SEND, V_P_EMAIL, V_P_TOKEN) {
  return await fetch(`${API_SERVER}/FireAlarmNotification/GetDataScadaAlarm`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        SEND: V_P_SEND,
        EMAIL_ADDRESS: V_P_EMAIL,
        TOKEN: V_P_TOKEN,
      }),
    })
      .then((response) => response.json())
      .then((json) => {return Object.values(json)});
}
export async function DeleteScadaAlarm(V_P_EMAIL, V_P_ORD) {
  // declare the async data fetching function
  return await fetch(`${API_SERVER}/FireAlarmNotification/DeleteScadaAlarm`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      EMAIL_ADDRESS: V_P_EMAIL,
      ORD: V_P_ORD,
    }),
  })
    .then((response) => response.json())
    .then((json) => {return Object.values(json)})
    .catch((error) => {
      console.error(error);
    });
}