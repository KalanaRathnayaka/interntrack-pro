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

  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    status: "Pending",
    applicationDate: "",
    interviewDate: "",
    notes: "",
  });

  useEffect(() => {
  async function loadData() {
    try {
      const applicationsResponse = await api.get("/applications");
      setApplications(applicationsResponse.data);

      const companiesResponse = await api.get("/companies");
      setCompanies(companiesResponse.data);

    } catch (error) {
      console.error(error);
    }
  }

  loadData();
}, []);

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
      status: "Pending",
      applicationDate: "",
      interviewDate: "",
      notes: "",
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
      companyName: app.companyName,
      position: app.position,
      status: app.status,
      applicationDate: app.applicationDate,
      interviewDate: app.interviewDate,
      notes: app.notes || "",
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
              placeholder="Notes"
              value={formData.notes}
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

        {applications.length === 0 ? (
          <div className="card empty-state">
            No applications found. Add your first application above.
          </div>
        ) : (
          <div className="card table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Application Date</th>
                  <th>Interview Date</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.companyName}</td>
                    <td>{app.position}</td>
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
                    <td>{app.notes || "-"}</td>
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