import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminName = user?.name || "Admin";
  const firstLetter = adminName.charAt(0).toUpperCase();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded transition
     ${isActive ? "bg-primary text-white" : "hover:bg-primary/20"}`;

  const handleLogout = () => {
    setOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed lg:static z-40 w-64 bg-secondary text-white
        transform transition-transform
        h-screen
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>

        <div className="flex items-center gap-3 p-4 border-b border-gray-700">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
            {firstLetter}
          </div>

          <div className="text-sm">
            <p className="font-semibold">{adminName}</p>
            <p className="text-gray-400 text-xs">Administrator</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/teachers"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Teachers
          </NavLink>

          <NavLink
            to="/admin/students"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Students
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-6 text-red-400 hover:text-red-500"
          >
            Logout
          </button>
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="flex-1 ">
        <header className="lg:hidden bg-secondary text-white p-3 flex items-center">
          <Menu onClick={() => setOpen(true)} className="cursor-pointer" />
          <span className="ml-3 font-semibold">Admin Dashboard</span>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
