import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl =
    "https://pdf-password-remover-qe3i.onrender.com/api/pdf/unlock";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      setLoading(true);

      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to unlock PDF");
      }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Get original filename without extension
    const originalName = file.name.replace(/\.pdf$/i, "");
    const newFileName = `${originalName}_unlocked.pdf`;

    const a = document.createElement("a");
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    } catch (error) {
      alert("Error unlocking PDF. Please check password.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      {/* Loading Overlay */}
      {loading && (
        <div style={overlayStyle}>
          <div style={spinnerStyle}></div>
          <p style={{ marginTop: 20 }}>Unlocking PDF...</p>
        </div>
      )}

      <div style={cardStyle}>
        <h1 style={titleStyle}>🔓 PDF Password Remover</h1>
        <p style={subtitleStyle}>
          Securely remove password protection from your PDF files.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={fileUploadStyle}>
            {file ? file.name : "Click to upload PDF"}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: "none" }}
            />
          </label>

          <input
            type="password"
            placeholder="Enter PDF Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Unlock PDF
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #661c1c, #ab3d0e)",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
  boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(15px)",
  padding: "40px 30px",
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  width: "100%",
  maxWidth: "420px",
  textAlign: "center",
  color: "#fff",
};

const titleStyle: React.CSSProperties = {
  marginBottom: "10px",
  fontSize: "26px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "14px",
  marginBottom: "25px",
  opacity: 0.85,
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const fileUploadStyle: React.CSSProperties = {
  border: "2px dashed rgba(255,255,255,0.6)",
  padding: "18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "0.3s",
};

const inputStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  fontSize: "14px",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "#ffffff",
  color: "#010009",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",
};

/* Loading overlay */
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  zIndex: 999,
};

/* Spinner */
const spinnerStyle: React.CSSProperties = {
  width: "50px",
  height: "50px",
  border: "5px solid #fff",
  borderTop: "5px solid transparent",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

/* Add spinner animation */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`, styleSheet.cssRules.length);

export default App;
