import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../App.css";

const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
      return "#16a34a";
    case "Rejected":
      return "#dc2626";
    case "Interview":
    case "Interview Scheduled":
      return "#2563eb";
    default:
      return "#ca8a04";
  }
};

function Applications() {
  const [applications, setApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [resumes, setResumes] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    resumeId: "",
    resumeTitle: "",
    status: "Pending",
    applicationDate: "",
    interviewDate: "",
    notes: "",
    interviewMode: "",
    interviewRound: "",
    interviewResult: "Waiting",
    interviewNotes: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const applicationsResponse = await api.get("/applications");
        setApplications(applicationsResponse.data);

        const companiesResponse = await api.get("/companies");
        setCompanies(companiesResponse.data);

        const resumesResponse = await api.get("/resumes");
        setResumes(resumesResponse.data);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    }

    loadData();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const companyName = app.companyName || "";
    const position = app.position || "";
    const status = app.status || "";

    const matchesSearch =
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      companyName: "",
      position: "",
      resumeId: "",
      resumeTitle: "",
      status: "Pending",
      applicationDate: "",
      interviewDate: "",
      notes: "",
      interviewMode: "",
      interviewRound: "",
      interviewResult: "Waiting",
      interviewNotes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await api.put(`/applications/${editingId}`, formData);

        setApplications((current) =>
          current.map((app) => (app.id === editingId ? response.data : app))
        );

        resetForm();
        return;
      }

      const response = await api.post("/applications", formData);
      setApplications((current) => [...current, response.data]);
      resetForm();
    } catch (error) {
      console.error("Failed to save application", error);
      alert("Failed to save application.");
    }
  };

  const handleEdit = (app) => {
    setEditingId(app.id);

    setFormData({
      companyName: app.companyName || "",
      position: app.position || "",
      resumeId: app.resumeId || "",
      resumeTitle: app.resumeTitle || "",
      status: app.status || "Pending",
      applicationDate: app.applicationDate || "",
      interviewDate: app.interviewDate || "",
      notes: app.notes || "",
      interviewMode: app.interviewMode || "",
      interviewRound: app.interviewRound || "",
      interviewResult: app.interviewResult || "Waiting",
      interviewNotes: app.interviewNotes || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      await api.delete(`/applications/${id}`);

      setApplications((current) => current.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Failed to delete application", error);
      alert("Failed to delete application.");
    }
  };

  const getDaysRemaining = (interviewDate) => {
    if (!interviewDate) return "-";

    const today = new Date();
    const interview = new Date(interviewDate);

    today.setHours(0, 0, 0, 0);
    interview.setHours(0, 0, 0, 0);

    const diffTime = interview - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Passed";
    if (diffDays === 0) return "Today";

    return `${diffDays} Days Left`;
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">Applications</h1>

        <p className="page-subtitle">
          Manage your internship applications in one place.
        </p>

        <div className="card">
          <h2 className="card-title">
            {editingId ? "Update Application" : "Add New Application"}
          </h2>

          <form className="form-grid" onSubmit={handleSubmit}>
            <select
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            >
              <option value="">Select Company</option>

              {companies.map((company) => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>

            <input
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleChange}
              required
            />

            <select
              name="resumeId"
              value={formData.resumeId}
              onChange={(e) => {
                const selectedResume = resumes.find(
                  (resume) => resume.id === e.target.value
                );

                setFormData({
                  ...formData,
                  resumeId: selectedResume?.id || "",
                  resumeTitle: selectedResume?.title || "",
                });
              }}
            >
              <option value="">Select Resume</option>

              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title}
                </option>
              ))}
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Interview">Interview</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>

            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
            />

            <input
              name="notes"
              placeholder="Application Notes"
              value={formData.notes}
              onChange={handleChange}
            />

            <select
              name="interviewMode"
              value={formData.interviewMode}
              onChange={handleChange}
            >
              <option value="">Interview Mode</option>
              <option value="Online">Online</option>
              <option value="Physical">Physical</option>
              <option value="Phone">Phone</option>
            </select>

            <select
              name="interviewRound"
              value={formData.interviewRound}
              onChange={handleChange}
            >
              <option value="">Interview Round</option>
              <option value="HR">HR</option>
              <option value="Technical">Technical</option>
              <option value="Final">Final</option>
            </select>

            <select
              name="interviewResult"
              value={formData.interviewResult}
              onChange={handleChange}
            >
              <option value="Waiting">Waiting</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
            </select>

            <input
              name="interviewNotes"
              placeholder="Interview Notes"
              value={formData.interviewNotes}
              onChange={handleChange}
            />

            <button className="primary-btn" type="submit">
              {editingId ? "Update Application" : "Add Application"}
            </button>

            {editingId && (
              <button className="secondary-btn" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">Search & Filter Applications</h2>

          <div className="form-grid">
            <input
              type="text"
              placeholder="Search by company or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Interview">Interview</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <p style={{ marginTop: "15px", color: "#9ca3af" }}>
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="card empty-state">
            No applications found. Add your first application above.
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="card empty-state">
            No matching applications found.
          </div>
        ) : (
          <div className="card table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Resume Used</th>
                  <th>Status</th>
                  <th>Application Date</th>
                  <th>Interview Date</th>
                  <th>Countdown</th>
                  <th>Mode</th>
                  <th>Round</th>
                  <th>Result</th>
                  <th>Notes</th>
                  <th>Interview Notes</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.companyName}</td>
                    <td>{app.position}</td>
                    <td>{app.resumeTitle || "-"}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: getStatusColor(app.status) }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>{app.applicationDate || "-"}</td>
                    <td>{app.interviewDate || "-"}</td>
                    <td>{getDaysRemaining(app.interviewDate)}</td>
                    <td>{app.interviewMode || "-"}</td>
                    <td>{app.interviewRound || "-"}</td>
                    <td>{app.interviewResult || "-"}</td>
                    <td>{app.notes || "-"}</td>
                    <td>{app.interviewNotes || "-"}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(app)}>
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(app.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Applications;