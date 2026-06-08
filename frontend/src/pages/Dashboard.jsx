import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../App.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  });

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const statsResponse = await api.get("/applications/stats");
        setStats(statsResponse.data);

        const appsResponse = await api.get("/applications");
        setApplications(appsResponse.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    }

    loadDashboard();
  }, []);

  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "Interview", value: stats.interview },
    { name: "Accepted", value: stats.accepted },
    { name: "Rejected", value: stats.rejected },
  ];

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

  const recentApplications = applications.slice().reverse().slice(0, 5);

  const upcomingInterviews = applications
    .filter(
      (app) =>
        app.interviewDate &&
        app.status &&
        app.status.toLowerCase().includes("interview")
    )
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">InternTrack Dashboard</h1>

        <p className="page-subtitle">
          Track your internship applications and progress.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div className="card">
            <h3>Total Applications</h3>
            <h1>{stats.total}</h1>
          </div>

          <div className="card">
            <h3>Pending</h3>
            <h1>{stats.pending}</h1>
          </div>

          <div className="card">
            <h3>Interview</h3>
            <h1>{stats.interview}</h1>
          </div>

          <div className="card">
            <h3>Accepted</h3>
            <h1>{stats.accepted}</h1>
          </div>

          <div className="card">
            <h3>Rejected</h3>
            <h1>{stats.rejected}</h1>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "25px",
            marginBottom: "30px",
          }}
        >
          <div className="card">
            <h2 className="card-title">Application Status Distribution</h2>

            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="card-title">Applications by Status</h2>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "25px",
          }}
        >
          <div className="card">
            <h2 className="card-title">Recent Applications</h2>

            {recentApplications.length === 0 ? (
              <p className="empty-state">No applications found.</p>
            ) : (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid #374151",
                  }}
                >
                  <h3>{app.companyName}</h3>
                  <p style={{ color: "#d1d5db" }}>{app.position}</p>
                  <small style={{ color: "#9ca3af" }}>
                    Status: {app.status} | Applied: {app.applicationDate || "-"}
                  </small>
                </div>
              ))
            )}
          </div>

          <div className="card">
            <h2 className="card-title">Upcoming Interviews</h2>

            {upcomingInterviews.length === 0 ? (
              <p className="empty-state">No upcoming interviews.</p>
            ) : (
              upcomingInterviews.map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid #374151",
                  }}
                >
                  <h3>{app.companyName}</h3>
                  <p style={{ color: "#d1d5db" }}>{app.position}</p>
                  <small style={{ color: "#9ca3af" }}>
                    Interview Date: {app.interviewDate || "-"}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;