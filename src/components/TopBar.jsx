import React, { useEffect, useRef, useState } from "react";
import "./TopBar.css";
import pedrodappsIcon from "../assets/pedrodapps_icon.png";
import { getUser, logout } from "../lib/auth";

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      const target = e.target;
      if (open) {
        if (
          menuRef.current && !menuRef.current.contains(target) &&
          btnRef.current && !btnRef.current.contains(target)
        ) {
          setOpen(false);
        }
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  const handleToggle = () => setOpen((v) => !v);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setOpen(false);
      // força navegação limpa pós-logout
      window.location.replace("/login");
    }
  };

  const initial = (user?.email || "").trim().charAt(0).toUpperCase() || "P";

  return (
    <header className="topbar" role="banner">
      <div className="topbar__left">
        <img src={pedrodappsIcon} alt="Pedro dApps" className="topbar__brand" />
        <span className="topbar__title" aria-hidden="true">Pedro dApps</span>
      </div>
      <div className="topbar__right" aria-label="User menu" role="navigation">
        <button
          ref={btnRef}
          className="topbar__avatar-btn"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls="topbar-menu"
          title={user?.email || "Conta"}
          onClick={handleToggle}
        >
          {user?.picture ? (
            <img src={user.picture} alt="Avatar" className="topbar__avatar" />
          ) : (
            <span className="topbar__avatar topbar__avatar--fallback" aria-hidden="true">
              {initial}
            </span>
          )}
        </button>

        {open && (
          <div ref={menuRef} id="topbar-menu" role="menu" className="topbar__menu">
            <button role="menuitem" className="topbar__menu-item" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}