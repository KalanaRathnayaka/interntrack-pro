import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 30px",
                background: "#111827",
                borderBottom: "1px solid #374151",
            }}
        >
            <h2 style={{ color: "white" }}>InternTrack Pro</h2>

            <div style={{ display: "flex", gap: "20px" }}>
                <Link
                    to="/dashboard"
                    style={{ color: "white", textDecoration: "none" }}
                >
                    Dashboard
                </Link>
                <Link to="/companies" style={{ color: "white", textDecoration: "none" }}>
                    Companies
                </Link>

                <Link
                    to="/applications"
                    style={{ color: "white", textDecoration: "none" }}
                >
                    Applications
                </Link>

                <button
                    onClick={handleLogout}
                    style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        cursor: "pointer",
                        borderRadius: "5px",
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;