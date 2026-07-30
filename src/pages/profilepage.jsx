import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

const ProfilePage = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userId = user.user_id || user.id || "";

  const [progress, setProgress] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);

  // Load AI Assessment / Indian Rank
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${API_BASE}/ai/assessment/${userId}`)
      .then((res) => {
        console.log("PROFILE ASSESSMENT", res.data);

        if (res.data?.success) {
          setEvaluation(res.data.data);
        }
      })
      .catch((err) => {
        console.log("PROFILE ASSESSMENT ERROR", err);
        setEvaluation(null);
      });
  }, [userId]);

  // Load Progress
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${API_BASE}/learning/progress/${userId}`)
      .then((res) => {
        console.log("PROFILE PROGRESS", res.data);
        setProgress(res.data);
      })
      .catch(console.log);
  }, [userId]);

  // Load Classes
  useEffect(() => {
    if (!progress?.current_level) return;

    axios
      .get(
        `${API_BASE}/learning/${progress.current_level}/classes/${userId}`
      )
      .then((res) => {
        console.log("PROFILE CLASSES", res.data);
        setClasses(res.data);
        setLoading(false);
      })
      .catch(console.log);
  }, [progress, userId]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        Loading Profile...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f7",
        padding: "35px",
      }}
    >
      {/* Back Button */}

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          border: "none",
          background: "#c48b96",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "12px",
          cursor: "pointer",
          marginBottom: "25px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Profile Header */}

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          display: "flex",
          alignItems: "center",
          gap: "25px",
          boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          marginBottom: "30px",
        }}
      >
        <img
          src={`https://ui-avatars.com/api/?name=${user.full_name}&background=c48b96&color=fff&size=200`}
          alt="Profile"
          style={{
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            border: "5px solid #c48b96",
            fontSize: "35px",
          }}
        />

        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: 0,
              color: "#333",
              fontSize: "30px",
            }}
          >
            {user.full_name}
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: "8px",
              fontSize: "20px",
              marginBottom: "5px",
            }}
          >
            {user.email}
          </p>

          <p
            style={{
              color: "#666",
              marginTop: "8px",
              fontSize: "20px",
              marginBottom: "5px",
            }}
          >
            <strong>User ID :</strong> {user.user_id}
          </p>

          <span
            style={{
              display: "inline-block",
              background: "#c48b96",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "30px",
              fontWeight: "bold",
              marginTop: "10px",
              fontSize: "18px",
            }}
          >
            {progress?.current_level}
          </span>
        </div>
      </div>

      {/* Indian Rank */}

      <div
        style={{
          background: "#c48b96",
          color: "#fff",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
          marginBottom: "30px",
          boxShadow: "0 10px 25px rgba(8, 8, 8, 0.3)",
        }}
      >
        <h2>🏆 Indian Rank</h2>

        <h1
          style={{
            fontSize: "50px",
            margin: "15px 0",
          }}
        >
          {evaluation?.indian_rank !== undefined && evaluation?.indian_rank !== null
            ? `#${Number(evaluation.indian_rank).toLocaleString("en-IN")}`
            : "#N/A"}
        </h1>

        <p>
          Keep practicing to improve your national ranking 🚀
        </p>
      </div>

      {/* Exam Results */}

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>📝 Exam Results</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#c48b96",
                color: "#fff",
              }}
            >
              <th style={head}>Level</th>
              <th style={head}>Score</th>
              <th style={head}>Percentage</th>
              <th style={head}>Status</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(progress?.level_exams || {}).map(
              ([level, exam]) => (
                <tr key={level}>
                  <td style={cell}>{level}</td>

                  <td style={cell}>{exam.score}</td>

                  <td style={cell}>{exam.percentage}%</td>

                  <td style={cell}>
                    {exam.completed ? (
                      <span
                        style={{
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >
                        ✅ Passed
                      </span>
                    ) : exam.unlocked ? (
                      <span
                        style={{
                          color: "#ff9800",
                          fontWeight: "bold",
                        }}
                      >
                        ⏳ Retry
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#999",
                          fontWeight: "bold",
                        }}
                      >
                        🔒 Locked
                      </span>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Completed Classes */}

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "20px",
          boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          marginBottom: "30px",
        }}
      >
        <h2>✅ Completed Classes</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {classes.filter((c) => c.is_completed).length > 0 ? (
            classes
              .filter((c) => c.is_completed)
              .map((item) => (
                <div
                  key={item.class_id}
                  style={{
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    padding: "12px 18px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                >
                  ✅ {item.class_name || item.class_id}
                </div>
              ))
          ) : (
            <p>No completed classes.</p>
          )}
        </div>
      </div>

      {/* Personal Information */}

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>👤 Personal Information</h2>

        <Info title="User ID" value={user.user_id} />
        <Info title="Email" value={user.email} />
        <Info title="Mobile Number" value={user.mobile_number} />
        <Info title="Native Language" value={user.native_language} />
        <Info title="Learning Goal" value={user.learning_goal} />
        <Info
          title="Preferred Learning Time"
          value={user.preferred_learning_time}
        />
      </div>
    </div>
  );
};

const Info = ({ title, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 0",
      borderBottom: "1px solid #eee",
    }}
  >
    <strong>{title}</strong>
    <span>{value || "-"}</span>
  </div>
);

const head = {
  padding: "15px",
  textAlign: "left",
};

const cell = {
  padding: "15px",
  borderBottom: "1px solid #eee",
};

export default ProfilePage;