import { useEffect, useState } from "react";
import axios from "axios";
import LandingPage from "./LandingPage";
import MainApp from "./MainApp";
import Login from "./pages/Login";

export default function App() {

  const [step, setStep] = useState("loading");

  useEffect(() => {

    axios.get(
      "https://api.calmfit.in/api/auth/me",
      { withCredentials: true }
    )
      .then((res) => {

        if (res.data !== "anonymousUser") {
          setStep("main");
        } else {
          setStep("landing");
        }

      })
      .catch(() => {
        setStep("landing");
      });

  }, []);

  if (step === "loading") {
    return <div>Loading...</div>;
  }

  if (step === "landing") {
    return (
      <LandingPage
        onGetStarted={() => setStep("main")}
      />
    );
  }

  if (step === "login") {
    return <Login initialMode="login" />;
  }

  return (
    <MainApp
      goToLogin={() => setStep("login")}
    />
  );
}