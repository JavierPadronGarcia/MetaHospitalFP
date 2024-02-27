import { Outlet, useNavigate } from "react-router-dom";
import { decodeToken } from "./shared/globalFunctions";
import { notification } from "antd";
import { useState } from "react";

export default function ExpireToken() {
  const [thirtyMinutesNofitication, setThirtyMinutesNofitication] = useState(false);
  const [tenMinutesNofitication, setTenMinutesNofitication] = useState(false);
  const navigate = useNavigate();
  const user = decodeToken();
  const currentTimestamp = Math.floor(Date.now() / 1000);

  if (user.exp < currentTimestamp) {
    localStorage.removeItem("token");
    notification.warning({
      placement: "top",
      message: 'La sesión ha expirado',
    });
    navigate("/");
  } else {
    const timeRemaining = user.exp - currentTimestamp;

    if (timeRemaining < (10 * 60) && !tenMinutesNofitication) {
      notification.warning({
        placement: "top",
        message: 'Quedan menos de 10 minutos antes de que la sesión expire',
      });
      setTenMinutesNofitication(true);
      setThirtyMinutesNofitication(true);
    }

    if (timeRemaining < (30 * 60) && timeRemaining > (10 * 60) && !thirtyMinutesNofitication) {
      notification.warning({
        placement: "top",
        message: 'Quedan menos de 30 minutos antes de que la sesión expire',
      });
      setThirtyMinutesNofitication(true);
    }
  }
  return <Outlet />;
}