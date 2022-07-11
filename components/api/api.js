const API_SERVER = "http://27.71.235.82";

export default async function getDataFireAlarm(V_P_SEND) {
    return await fetch(`${API_SERVER}/FireAlarmNotification/GetDataFireAlarm`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SEND: V_P_SEND,
        }),
      })
        .then((response) => response.json())
        .then((json) => {return json});
}