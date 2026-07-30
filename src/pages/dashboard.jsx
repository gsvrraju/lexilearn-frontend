import { useState, useEffect } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import axios from "axios";
import bgImage from "../assets/images/dashboard-bg.jpg";
import EnglishTopics from "./englishtopics";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userId = user.user_id || user.id || "";

  const fullName = user.full_name || user.name || "Student";

  const [levels, setLevels] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [classes, setClasses] = useState([]);
  const [progress, setProgress] = useState(null);
  const [indianRank, setIndianRank] = useState(null);

  const [messages, setMessages] = useState([
  {
    sender: "bot",
    text: "Hi! I'm Lexi AI 👋 Ask me anything about English.",
  },
]);

const [question, setQuestion] = useState("");
const [loading, setLoading] = useState(false);

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
  // Load Indian Rank
  // ==========================================

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${API_BASE}/ai/assessment/${userId}`)
      .then((res) => {
        console.log("ASSESSMENT", res.data);

        if (res.data?.success) {
          setIndianRank(res.data.data?.indian_rank || null);
        }
      })
      .catch((err) => {
        console.log("ASSESSMENT ERROR", err);
        setIndianRank(null);
      });
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
      .get(`${API_BASE}/learning/${selectedLevel}/classes/${userId}`)
      .then((res) => {
        console.log("CLASSES", res.data);

        setClasses(res.data);
      })
      .catch(console.log);
  }, [selectedLevel, userId]);

  // ==========================================
  // Statistics
  // ==========================================

  const totalCompleted = classes.filter(c => c.is_completed).length;

  const totalClasses = classes.length;

  const percentage =
    totalClasses > 0
      ? (totalCompleted / totalClasses) * 100
      : 0;

  const currentLevel =
    progress?.current_level || "LEVEL1";

  const unlockedLevels =
    progress?.unlocked_levels?.length || 1;

  const navigate = useNavigate();

  const firstLetter = fullName
    ? fullName.charAt(0).toUpperCase()
    : "S";

    const sendMessage = async () => {
  if (!question.trim()) return;

  const userMessage = {
    sender: "user",
    text: question,
  };

  setMessages((prev) => [...prev, userMessage]);
  setLoading(true);

  try {
    const res = await axios.post(`${API_BASE}/ai/chat`, {
      message: question,
      user_id: userId,
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: res.data.reply,
      },
    ]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Sorry, I couldn't answer that.",
      },
    ]);
  }

  setQuestion("");
  setLoading(false);
};

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
          padding: "50px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >

        {/* Profile Avatar */}

        <div
          onClick={() => navigate("/profile")}
          title="View Profile"
          style={{
            position: "absolute",
            top: "18px",
            right: "20px",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "#ffffff",
            color: "#c48b96",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "3px solid rgba(255,255,255,.4)",
            boxShadow: "0 5px 12px rgba(0,0,0,.2)",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {firstLetter}
        </div>

        {/* Indian Rank */}

        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "100px",
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
          {indianRank !== null
            ? `Rank  : ${Number(indianRank).toLocaleString("en-IN")}`
            : "Rank  : N/A"}
        </div>

        <h1>Welcome Back, {fullName} 👋</h1>

        <p style={{marginTop:"20px"}}>
          Continue your English learning journey with Lexi Learn English.
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
          padding: "35px",
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

      {/* Floating AI Chat */}

      {openChat && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "30px",
            width: "550px",
            height: "450px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,.3)",
            overflow: "hidden",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#c48b96",
              color: "white",
              padding: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Lexi AI Assistant 🤖</span>

            <FaTimes
              style={{ cursor: "pointer" }}
              onClick={() => setOpenChat(false)}
            />
          </div>

          {/* ChatGPT */}
          <div
  style={{
    flex: 1,
    overflowY: "auto",
    padding: 15,
    background: "#f7f7f7",
  }}
>
  {messages.map((msg, index) => (
    <div
      key={index}
      style={{
        textAlign: msg.sender === "user" ? "right" : "left",
        marginBottom: 12,
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "10px 15px",
          borderRadius: 15,
          background: msg.sender === "user" ? "#c48b96" : "#ececec",
          color: msg.sender === "user" ? "#fff" : "#000",
          maxWidth: "80%",
        }}
      >
        {msg.text}
      </span>
    </div>
  ))}

  {loading && <p>Lexi AI is typing...</p>}
</div>

<div
  style={{
    display: "flex",
    padding: 10,
    borderTop: "1px solid #ddd",
  }}
>
  <input
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    placeholder="Ask anything..."
    style={{
      flex: 1,
      padding: 12,
      borderRadius: 10,
      border: "1px solid #ccc",
    }}
  />

  <button
    onClick={sendMessage}
    style={{
      marginLeft: 10,
      padding: "12px 20px",
      background: "#c48b96",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
    }}
  >
    Send
  </button>
</div>
        </div>
      )}

      {/* Floating Button */}

      <div
        onClick={() => setOpenChat(!openChat)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#c48b96",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,.3)",
          zIndex: 9999,
        }}
      >
        <FaRobot size={30} color="white" />
      </div>
    </div>
  );
};

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        width: "285px",
        padding: "50px",
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