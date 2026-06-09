import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../App.css";

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
  });

  useEffect(() => {
  async function loadResumes() {
    try {
      const response = await api.get("/resumes");
      setResumes(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  loadResumes();
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
      title: "",
      description: "",
      fileUrl: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await api.put(
          `/resumes/${editingId}`,
          formData
        );

        setResumes((current) =>
          current.map((resume) =>
            resume.id === editingId ? response.data : resume
          )
        );

        resetForm();
        return;
      }

      const response = await api.post("/resumes", formData);

      setResumes((current) => [...current, response.data]);

      resetForm();
    } catch (error) {
      console.error(error);
      alert("Failed to save resume");
    }
  };

  const handleEdit = (resume) => {
    setEditingId(resume.id);

    setFormData({
      title: resume.title,
      description: resume.description,
      fileUrl: resume.fileUrl,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;

    try {
      await api.delete(`/resumes/${id}`);

      setResumes((current) =>
        current.filter((resume) => resume.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete resume");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">Resume Management</h1>

        <p className="page-subtitle">
          Manage and track different versions of your CV.
        </p>

        <div className="card">
          <h2 className="card-title">
            {editingId ? "Update Resume" : "Add New Resume"}
          </h2>

          <form
            className="form-grid"
            onSubmit={handleSubmit}
          >
            <input
              name="title"
              placeholder="Resume Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <input
              name="fileUrl"
              placeholder="Google Drive Resume Link"
              value={formData.fileUrl}
              onChange={handleChange}
              required
            />

            <button
              className="primary-btn"
              type="submit"
            >
              {editingId ? "Update Resume" : "Add Resume"}
            </button>

            {editingId && (
              <button
                className="secondary-btn"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {resumes.length === 0 ? (
          <div className="card empty-state">
            No resumes found.
          </div>
        ) : (
          <div className="card table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Resume</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {resumes.map((resume) => (
                  <tr key={resume.id}>
                    <td>{resume.title}</td>

                    <td>{resume.description}</td>

                    <td>
                      <button
                        className="primary-btn"
                        onClick={() =>
                          window.open(
                            resume.fileUrl,
                            "_blank"
                          )
                        }
                      >
                        Open Resume
                      </button>
                    </td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(resume)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(resume.id)
                        }
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

export default Resumes;