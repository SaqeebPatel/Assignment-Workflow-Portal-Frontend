import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store";

export default function StudentLayout() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const studentName = user?.name || "Student";
  
  const firstLetter = studentName.charAt(0).toUpperCase();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition
     ${
       isActive
         ? "bg-primary text-white"
         : "text-gray-200 hover:bg-primary/30 hover:text-white"
     }`;
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
          Student Panel
        </div>

        <NavLink
          // to="profile"
           onClick={() => setOpen(false)}
          className="flex items-center gap-3 p-4 border-b border-gray-700 hover:bg-primary/30 transition"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
            {firstLetter}
          </div>
          <div className="text-sm">
            <p className="font-semibold">{studentName}</p>
            <p className="text-gray-400 text-xs">View Profile</p>
          </div>
        </NavLink>

        <nav className="p-4 space-y-2">
          <NavLink to="assignments" className={linkClass}
           onClick={() => setOpen(false)}
          >
            Assignments
          </NavLink>
          <NavLink to="submit-assignment" className={linkClass}
           onClick={() => setOpen(false)}
          >
            Submit Assignment
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

      <main className="flex-1">
        <header className="lg:hidden bg-secondary text-white p-3 flex items-center">
          <Menu onClick={() => setOpen(true)} className="cursor-pointer" />
          <span className="ml-3 font-semibold">Student Dashboard</span>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
