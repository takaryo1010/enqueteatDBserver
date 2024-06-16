import React, { useEffect, useState } from "react";
import "./ToggleBar.css";
import { useLocation } from "react-router-dom";

interface ToggleBarProps {
  isOpen: boolean;
  name: string | undefined;
  email: string | undefined;
  toggleOpen: () => void;
}

const parseHashParams = (hash: string) => {
  const params = new URLSearchParams(hash.substring(1));
  return {
    access_token: params.get("access_token"),
  };
};

export const ToggleBar: React.FC<ToggleBarProps> = ({
  isOpen,
  name,
  toggleOpen,
  email,
}) => {
  const [forms, setForms] = useState<
    { form_title: string; form_id: number; form_administrator: string }[]
  >([]);
  const url = "http://localhost:3000/";
  const location = useLocation();

  const {
    access_token,
  } = parseHashParams(window.location.hash);

  useEffect(() => {
    setForms([]);
    fetchForms();
  }, [isOpen, location.hash]);

  const fetchForms = async () => {
    try {
      const res = await fetch(url + "forms/" + (email), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setForms(
        data.map((form: any) => ({
          form_title: form.form_title,
          form_id: form.form_id,
          form_administrator: form.form_administrator,
        }))
      );
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  return (
    <div className={`toggle-bar ${isOpen ? "open" : ""}`}>
      <button className="toggle-button" onClick={toggleOpen}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      {isOpen && (
        <nav className="nav-menu">
          <p className="toggle-title">作成済みフォーム</p>
          <ul>
            {forms.map((form) => (
              <li key={form.form_id}>
                <a
                  href={
                    "View/" +
                    form.form_id.toString() +
                    `?access_token=${access_token}&name=${name}&email=${email}`
                  }
                >
                  {form.form_title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};
