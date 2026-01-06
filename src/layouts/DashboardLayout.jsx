import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const menu =
    user?.role === "teacher"
      ? [{ name: "Create Assignment" }, { name: "My Assignments" }]
      : [{ name: "Assignments" }, { name: "My Submissions" }];

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`
          fixed lg:static z-40
          w-64 bg-secondary text-white
          transform transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          {user?.role === "teacher" ? "Teacher" : "Student"} Panel
        </div>

        <nav className="p-4 space-y-2">
          {menu.map((item) => (
            <div
              key={item.name}
              className="p-2 rounded cursor-pointer hover:bg-primary"
            >
              {item.name}
            </div>
          ))}

          <button
            onClick={logout}
            className="w-full mt-4 flex items-center gap-2 text-red-400 hover:text-red-500"
          >
            Logout
          </button>
        </nav>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <main className="flex-1 lg:ml-64">
        <header className="lg:hidden bg-secondary text-white p-3 flex items-center">
          <Menu onClick={() => setOpen(true)} className="cursor-pointer" />
          <span className="ml-3 font-semibold">Dashboard</span>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
