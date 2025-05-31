import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const RouteLogger = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(
      "Current path:",
      location.pathname + location.search + location.hash
    );
  }, [location]);

  return null;
};

export const HashLogger = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = window.location.hash.substring(1);
      if (newPath) {
        navigate(newPath);
      } else {
        navigate("/");
      }
    };

    handleHashChange(); // Call once on mount to handle initial hash
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [navigate]);

  return null;
};