import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../App.css";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    website: "",
    location: "",
  });

  useEffect(() => {
    async function loadCompanies() {
      try {
        const response = await api.get("/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Failed to load companies", error);
      }
    }

    loadCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      website: "",
      location: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await api.put(`/companies/${editingId}`, formData);

        setCompanies((current) =>
          current.map((company) =>
            company.id === editingId ? response.data : company
          )
        );

        resetForm();
        return;
      }

      const response = await api.post("/companies", formData);
      setCompanies((current) => [...current, response.data]);
      resetForm();
    } catch (error) {
      console.error("Failed to save company", error);
      alert("Failed to save company.");
    }
  };

  const handleEdit = (company) => {
    setEditingId(company.id);

    setFormData({
      name: company.name,
      website: company.website,
      location: company.location,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;

    try {
      await api.delete(`/companies/${id}`);

      setCompanies((current) =>
        current.filter((company) => company.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete company", error);
      alert("Failed to delete company.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">Companies</h1>

        <p className="page-subtitle">
          Manage companies related to your internship applications.
        </p>

        <div className="card">
          <h2 className="card-title">
            {editingId ? "Update Company" : "Add New Company"}
          </h2>

          <form className="form-grid" onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Company Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
            />

            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <button className="primary-btn" type="submit">
              {editingId ? "Update Company" : "Add Company"}
            </button>

            {editingId && (
              <button className="secondary-btn" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {companies.length === 0 ? (
          <div className="card empty-state">
            No companies found. Add your first company above.
          </div>
        ) : (
          <div className="card table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Website</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.name}</td>
                    <td>{company.website || "-"}</td>
                    <td>{company.location || "-"}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(company)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(company.id)}
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

export default Companies;