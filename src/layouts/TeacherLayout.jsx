import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store";

export default function TeacherLayout() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const teacherName = user?.name || "Teacher";
  const firstLetter = teacherName.charAt(0).toUpperCase();

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
        min-h-screen
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Teacher Panel
        </div>

        <NavLink
          // to="profile"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 p-4 border-b border-gray-700 hover:bg-primary/20"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
            {firstLetter}
          </div>

          <div className="text-sm">
            <p className="font-semibold">{teacherName}</p>
            <p className="text-gray-400 text-xs">View Profile</p>
          </div>
        </NavLink>

        <nav className="p-4 space-y-2">
          <NavLink
            to="create-student"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Create Student
          </NavLink>

          <NavLink
            to="assignments"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Assignments
          </NavLink>

          <NavLink
            to="assignments-review"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Assignments Review
          </NavLink>

          <NavLink
            to="submitted-assignments"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Submitted Assignments
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-6 text-red-400 hover:text-red-500"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="flex-1">
        <header className="lg:hidden bg-secondary text-white p-3 flex items-center">
          <Menu onClick={() => setOpen(true)} className="cursor-pointer" />
          <span className="ml-3 font-semibold">Teacher Dashboard</span>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
