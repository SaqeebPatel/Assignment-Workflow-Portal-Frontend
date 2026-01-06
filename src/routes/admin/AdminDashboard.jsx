import React from "react";
import { useGetAdminStatsQuery } from "../../services/adminApiSlice";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  const statCards = [
    {
      title: "Total Teachers",
      value: stats?.totalTeachers || 0,
      icon: "👨‍🏫",
      color: "bg-blue-500",
    },
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: "👨‍🎓",
      color: "bg-green-500",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: "👥",
      color: "bg-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary">Admin Dashboard</h1>
        <p className="text-textSecondary mt-2">
          Welcome to the administration panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-card rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-textSecondary">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-textPrimary mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white text-xl`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
