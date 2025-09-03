import { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import Notes from "./pages/Notes";

interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth: string;
}

const API_BASE = "http://localhost:5000";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch {
      // not logged in
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch {
      console.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      {!user ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <Notes user={user} onLogout={logout} />
      )}
    </div>
  );
};

export default App;
