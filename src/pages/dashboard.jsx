import { useState, useEffect } from "react";
import axios from "axios";
import bgImage from "../assets/images/dashboard-bg.jpg";
import EnglishTopics from "./englishtopics";

const API_BASE = "http://127.0.0.1:8000";

const DashboardPage = () => {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userId = user.user_id || user.id || "";

  const fullName = user.full_name || user.name || "Student";

  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [classes, setClasses] = useState([]);
  const [progress, setProgress] = useState(null);

  // ==========================================
  // Load Progress
  // ==========================================

  useEffect(() => {

    if (!userId) return;

    axios
      .get(`${API_BASE}/learning/progress/${userId}`)
      .then((res) => {

        console.log("PROGRESS", res.data);

        // Backend returns the object directly
        setProgress(res.data);

      })
      .catch(console.log);

  }, [userId]);

  // ==========================================
  // Load Levels
  // ==========================================

  useEffect(() => {

    axios
      .get(`${API_BASE}/learning/levels`)
      .then((res) => {

        setLevels(res.data);

      })
      .catch(console.log);

  }, []);

  // ==========================================
  // Select Current Level
  // ==========================================

  useEffect(() => {

    if (progress?.current_level) {

      setSelectedLevel(progress.current_level);

    }

  }, [progress]);

  // ==========================================
  // Load Classes
  // ==========================================

  useEffect(() => {

    if (!selectedLevel || !userId) return;

    axios
      .get(
        `${API_BASE}/learning/${selectedLevel}/classes/${userId}`
      )
      .then((res) => {

        console.log("CLASSES", res.data);

        setClasses(res.data);

      })
      .catch(console.log);

  }, [selectedLevel, userId]);

  // ==========================================
  // Statistics
  // ==========================================

  const totalCompleted =
    classes.filter(c => c.is_completed).length;

  const totalClasses = classes.length;

  const percentage =
    totalClasses > 0
      ? (totalCompleted / totalClasses) * 100
      : 0;

  const currentLevel =
    progress?.current_level || "LEVEL1";

  const unlockedLevels =
    progress?.unlocked_levels?.length || 1;

  return (
        <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        backgroundImage: `linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.45)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}

      <div
        style={{
          position: "relative",
          background: "linear-gradient(135deg,#1f1f1f,#c48b96)",
          color: "#fff",
          padding: "30px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "17px",
            right: "30px",
            background: "linear-gradient(135deg,#ffcc00,#ff9800)",
            color: "#fff",
            padding: "7px 15px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "18px",
            letterSpacing: "1px",
            border: "2px solid rgba(255,255,255,.3)",
            boxShadow: "0 6px 15px rgba(249,0,141,.13)",
          }}
        >
          {userId}
        </div>

        <h1>Welcome Back, {fullName} 👋</h1>

        <p>
          Continue your English learning journey with Lexi Learn
          English.
        </p>
      </div>

      {/* Statistics */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          title="Completed Classes"
          value={`${totalCompleted}/${totalClasses}`}
        />

        <StatCard
          title="Current Level"
          value={currentLevel}
        />

        <StatCard
          title="Unlocked Levels"
          value={unlockedLevels}
        />

        <StatCard
          title="Completion"
          value={`${percentage.toFixed(0)}%`}
        />
      </div>

      {/* Overall Progress */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "30px",
        }}
      >
        <h2>Overall Progress</h2>

        <div
          style={{
            background: "#ddd",
            height: "18px",
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "15px",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: "#c48b96",
            }}
          />
        </div>

        <h3 style={{ marginTop: "15px" }}>
          {totalCompleted}/{totalClasses} Classes Completed
        </h3>
      </div>

      {/* English Topics */}

      <EnglishTopics
        levels={levels}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
      />
    </div>
  );
};

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        width: "220px",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h2
        style={{
          color: "#c48b96",
          marginBottom: "10px",
        }}
      >
        {value}
      </h2>

      <p>{title}</p>
    </div>
  );
}

export default DashboardPage;