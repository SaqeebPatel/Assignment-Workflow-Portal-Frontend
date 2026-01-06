// src/routes/teacher/Profile.jsx
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useSelector } from "react-redux";

export default function TeacherProfile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-xl bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-textPrimary mb-4">
        My Profile
      </h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-textSecondary">Teacher</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-semibold">Email:</span> {user?.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {user?.role}
        </p>
      </div>
    </div>
  );
}
