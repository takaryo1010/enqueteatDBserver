import React, { useEffect } from "react";

interface AuthProps {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: { name: string; email: string } | null) => void;
}

export const Auth: React.FC<AuthProps> = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const clientId =
    "606359673208-a1tb3fao58u4sbla1gn0cg28809la9an.apps.googleusercontent.com";

  const handleAuthClick = () => {
    const redirectUri = new URL(window.location.href).origin;
    const scope =
      "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = authUrl;
    
  };

  const handleSignoutClick = () => {
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = new URL(window.location.href).origin;
    window.localStorage.removeItem("access_token");
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get("access_token");
      if (token) {
        fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setIsAuthenticated(true);
            setUser({ name: data.name, email: data.email });
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  }, [setIsAuthenticated, setUser]);

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <h2>ログインしてください</h2>
          <button onClick={handleAuthClick} className="auth-button">
            Googleでログイン
          </button>
        </div>
      ) : (
        <div>
          <p>ログイン中: {user?.name}</p>
          <button onClick={handleSignoutClick} className="auth-button">
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};
