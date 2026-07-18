import  { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

function ScorePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state) {
      navigate("/dashboard");
      return;
    }
  }, [state, navigate]);

  if (!state) return null;

  const {
    score,
    total,
    percentage,
    passed,
    levelId,
    userId,
  } = state;

  // ==========================================
  // Save Exam Result
  // ==========================================

  useEffect(() => {
    if (!passed) return;

    const saveExam = async () => {
      try {
        await axios.put(`${API_BASE}/learning/exam-result`, {
          user_id: userId,
          level_id: levelId,
          score,
          percentage: Number(percentage),
          passed: true,
        });

        console.log("✅ Exam Result Saved");
      } catch (err) {
        console.log(err);
      }
    };

    saveExam();
  }, [passed, score, percentage, levelId, userId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fdf6f8,#f5e8ec)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "650px",
          background: "#fff",
          padding: "45px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,.12)",
        }}
      >
        <h1
          style={{
            color: "#c48b96",
            marginBottom: "20px",
          }}
        >
          🎉 Exam Completed
        </h1>

        <h3
          style={{
            color: "#666",
          }}
        >
          {levelId}
        </h3>

        <h2
          style={{
            marginTop: "30px",
            color: "#555",
          }}
        >
          Your Score
        </h2>

        <div
          style={{
            fontSize: "80px",
            fontWeight: "bold",
            color: "#c48b96",
            marginTop: "10px",
          }}
        >
          {score}
          <span
            style={{
              fontSize: "38px",
              color: "#777",
            }}
          >
            /{total}
          </span>
        </div>

        <h1
          style={{
            color: passed ? "#28a745" : "#dc3545",
            marginTop: "10px",
          }}
        >
          {percentage}%
        </h1>

        <h2
          style={{
            marginTop: "25px",
            color: passed ? "#28a745" : "#dc3545",
          }}
        >
          {passed
            ? "🎉 Congratulations! Level Completed"
            : "❌ You need at least 80% to unlock the next level."}
        </h2>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "15px 35px",
              background: "#c48b96",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🏠 Dashboard
          </button>

          {!passed && (
            <button
              onClick={() =>
                navigate("/exam", {
                  state: {
                    levelId,
                  },
                })
              }
              style={{
                padding: "15px 35px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🔄 Retry Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScorePage;