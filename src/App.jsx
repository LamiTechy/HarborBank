import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser]     = useState(null);
  const [screen, setScreen] = useState("login");

  useEffect(() => {
    const savedUser = localStorage.getItem("fvb_current_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("fvb_current_user");
      }
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("fvb_current_user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
    localStorage.removeItem("fvb_current_user");
  };

  if (user) return <Dashboard user={user} onLogout={handleLogout} />;
  if (screen === "signup") return <Signup onSignup={handleLogin} onBack={() => setScreen("login")} />;
  return <Login onLogin={handleLogin} onSignup={() => setScreen("signup")} />;
}
