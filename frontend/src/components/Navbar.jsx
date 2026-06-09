import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.brand}>
                <div style={styles.logo}></div>
                <h2 style={styles.title}>InternTrack Pro</h2>
            </div>

            <div style={styles.navLinks}>
                <NavLink
                    to="/dashboard"
                    style={({ isActive }) => ({
                        ...styles.link,
                        ...(isActive ? styles.activeLink : {}),
                    })}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/companies"
                    style={({ isActive }) => ({
                        ...styles.link,
                        ...(isActive ? styles.activeLink : {}),
                    })}
                >
                    Companies
                </NavLink>

                <NavLink
                    to="/applications"
                    style={({ isActive }) => ({
                        ...styles.link,
                        ...(isActive ? styles.activeLink : {}),
                    })}
                >
                    Applications
                </NavLink>

                <NavLink
                    to="/resumes"
                    style={({ isActive }) => ({
                        ...styles.link,
                        ...(isActive ? styles.activeLink : {}),
                    })}
                >
                    Resumes
                </NavLink>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 32px",
        background: "linear-gradient(145deg, #ffffff, #f8fafc)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow:
            "0 8px 20px rgba(0, 0, 0, 0.08), inset 1px 1px 2px rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
    },

    brand: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },

    logo: {
        width: 40,
        height: 40,
        borderRadius: 12,
        background: "linear-gradient(145deg, #3b82f6, #2563eb)",
        boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)",
    },

    title: {
        fontSize: "18px",
        fontWeight: 800,
        letterSpacing: "0.04em",
        color: "#0f172a",
        margin: 0,
    },

    navLinks: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
    },

    link: {
        color: "#0f172a",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: "14px",
        padding: "10px 16px",
        borderRadius: "12px",
        transition: "all 0.25s ease",
    },

    activeLink: {
        background: "linear-gradient(145deg, #3b82f6, #2563eb)",
        color: "#ffffff",
        boxShadow: "0 8px 16px rgba(37, 99, 235, 0.25)",
    },

    logoutBtn: {
        padding: "10px 18px",
        background: "linear-gradient(145deg, #ef4444, #dc2626)",
        color: "white",
        border: "none",
        borderRadius: 12,
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: "0 8px 16px rgba(239, 68, 68, 0.2)",
    },
};

export default Navbar;