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
  LineChart,
  Line,
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
    upcomingInterviews: 0,
    successRate: 0,
    mostAppliedCompany: "-",
    resumeVersions: 0,
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

  const monthlyData = applications.reduce((acc, app) => {
    if (!app.applicationDate) return acc;

    const month = new Date(app.applicationDate).toLocaleString("default", {
      month: "short",
    });

    const existingMonth = acc.find((item) => item.month === month);

    if (existingMonth) {
      existingMonth.applications += 1;
    } else {
      acc.push({
        month,
        applications: 1,
      });
    }

    return acc;
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">InternTrack Dashboard</h1>

        <p className="page-subtitle">
          Track your internship applications and progress with clear analytics and fast insights.
        </p>

        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-label">Total Applications</div>
            <div className="stat-value">{stats.total}</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Interview</div>
            <div className="stat-value">{stats.interview}</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Accepted</div>
            <div className="stat-value">{stats.accepted}</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{stats.rejected}</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Upcoming Interviews</div>
            <div className="stat-value">{stats.upcomingInterviews}</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Resume Versions</div>
            <div className="stat-value">{stats.resumeVersions}</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Success Rate</div>
            <div className="stat-value">{stats.successRate}%</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Top Company</div>
            <div className="stat-value stat-value--small">
              {stats.mostAppliedCompany}
            </div>
          </div>
        </div>

        <div className="chart-grid">
          <div className="card">
            <h2 className="card-title">Application Status Distribution</h2>

            <div className="chart-wrapper">
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
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Applications by Status</h2>

            <div className="chart-wrapper">
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
        </div>

        <div className="card card-highlight">
          <h2 className="card-title">Monthly Application Trend</h2>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="list-grid">
          <div className="card">
            <h2 className="card-title">Recent Applications</h2>

            {recentApplications.length === 0 ? (
              <p className="empty-state">No applications found.</p>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="activity-item">
                  <h3>{app.companyName}</h3>
                  <p>{app.position}</p>
                  <small>
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
                <div key={app.id} className="activity-item">
                  <h3>{app.companyName}</h3>
                  <p>{app.position}</p>
                  <small>
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