import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RequireAuth() {
  const location = useLocation();
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem("access");
    setToken(access);
    setChecked(true);
  }, []);

  if (!checked) {
    return null; // prevents white screen during refresh
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
