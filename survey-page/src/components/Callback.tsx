import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const [form_id, setForm_id] = useState<string>("");
  const [access_token, setAccess_token] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  // CSRFトークンの取得関数
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("http://localhost:3000/" + "csrf-token", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      throw error;
    }
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
          .then(async (data) => {
            window.localStorage.setItem("access_token", token);
            setAccess_token(token);
            window.localStorage.setItem("name", data.name);
            window.localStorage.setItem("email", data.email);

            fetch("http://localhost:3000/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "csrf-token":await fetchCSRFToken(),
              },
              body: JSON.stringify({
                user_email: data.email,
              }),
              credentials: "include",
            }).then((response) => console.log(response.json()));

            const form_id = window.localStorage.getItem("form_id");
            if (form_id) {
              setForm_id(form_id);
            }

            const encodedName = encodeURIComponent(data.name);
            const encodedEmail = encodeURIComponent(data.email);

            navigate(
              `/Answer/${form_id}?access_token=${token}&name=${encodedName}&email=${encodedEmail}`
            );
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        console.error("Token not found");
        navigate(`/`);
      }
    }
  }, [navigate, form_id]);

  return <div>Loading...</div>;
};

export { Callback };
