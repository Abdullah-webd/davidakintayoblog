import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line
} from "recharts";

const AdminUsersDash = () => {
  const [stats, setStats] = useState(null);
  const [visitorStats, setVisitorStats] = useState(null);

  const COLORS = ["#0A3150", "#1E3A8A", "#3B82F6"];

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/post/getAdminStats");
      const data = await res.json();
      setStats(data);
      console.log(data);
    };

    const fetchVisitors = async () => {
      const res = await fetch("/api/post/getVisitorCount");
      const data = await res.json();
      setVisitorStats(data);
    };

    fetchStats();
    fetchVisitors();
  }, []);

  if (!stats || !visitorStats) return <p>Loading...</p>;

  const pieData = [
    { name: "Likes", value: stats.totalLikes },
    { name: "Comments", value: stats.totalComments },
    { name: "Users", value: stats.totalUsers },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers}</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Total Likes</h2>
          <p className="text-3xl">{stats.totalLikes}</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Total Comments</h2>
          <p className="text-3xl">{stats.totalComments}</p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-[#0A3150]">Today's Visitors</h2>
          <p className="text-3xl font-bold text-[#0A3150]">{visitorStats.dailyVisitors}</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Bar Chart: Comments (30 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.commentsChart}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Donut Chart: Engagement Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Pie Chart: Total Stats</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Area Chart: Comments Flow</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.commentsChart}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="linear"
                dataKey="count"
                stroke="#1E3A8A"
                fill="#1E3A8A"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Visitors Bar Chart */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Weekly Visitors</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={visitorStats.weeklyVisitors}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0A3150" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Visitors Area Chart */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Monthly Visitors</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={visitorStats.monthlyVisitors}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#0A3150" fill="#bfdbfe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Visitors Line Chart */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Yearly Visitors</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={visitorStats.yearlyVisitors}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0A3150" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersDash;
