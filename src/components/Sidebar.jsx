// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AppBrand from "./AppBrand";

const useActive = (to) => {
  const { pathname } = useLocation();
  return pathname === to || pathname.startsWith(`${to}/`);
};

const Item = ({ to, icon, label, onClick }) => {
  const active = useActive(to);
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export const SidebarPanel = ({ onNavigate }) => (
  <nav className="p-3 space-y-1">
    <Item to="/app/dashboard" icon="🏠" label="Dashboard" onClick={onNavigate} />
    <Item to="/app/download"  icon="⬇️" label="Download"  onClick={onNavigate} />
    <Item to="/app/subscription" icon="⭐" label="Subscription" onClick={onNavigate} />
    <Item to="/app/history" icon="🗂️" label="History" onClick={onNavigate} />
  </nav>
);

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 shrink-0">
      <div className="h-16 flex items-center justify-center border-b">
        <AppBrand size={30} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarPanel />
      </div>

      <div className="p-4 mt-auto border-t bg-gray-50">
        <div className="text-xs text-gray-500">Logged in as:</div>
        <div className="text-sm font-medium text-gray-900 leading-tight">{user?.username || "User"}</div>
        <div className="text-xs text-gray-700 truncate">{user?.email}</div>
      </div>
    </aside>
  );
}
