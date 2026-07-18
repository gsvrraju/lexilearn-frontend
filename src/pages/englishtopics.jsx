import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

const EnglishTopics = ({
  levels,
  selectedLevel,
  setSelectedLevel,
}) => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?.user_id || user?.id;

  const [classes, setClasses] = useState([]);
  const [openLevel, setOpenLevel] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Load Progress
  // ==========================================
  useEffect(() => {

    if (!userId) return;

    axios
      .get(`${API_BASE}/learning/progress/${userId}`)
      .then((res) => {

        console.log("Progress:", res.data);

        // Backend returns the object directly
        setProgress(res.data);

      })
      .catch(console.log);

  }, [userId]);

  // ==========================================
  // Auto Open Current Level
  // ==========================================

  useEffect(() => {

    if (selectedLevel) {

      setOpenLevel(selectedLevel);

    }

  }, [selectedLevel]);

  // ==========================================
  // Load Classes
  // ==========================================

  useEffect(() => {

    if (!selectedLevel || !userId) return;

    const loadClasses = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `${API_BASE}/learning/${selectedLevel}/classes/${userId}`
        );

        console.log("Loaded Classes:", res.data);

        setClasses(res.data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    loadClasses();

  }, [selectedLevel, userId]);

  // ==========================================
  // Handle Level Click
  // ==========================================

  const handleLevelClick = (levelId) => {

    if (
      progress &&
      !progress.unlocked_levels.includes(levelId)
    ) {
      return;
    }

    setSelectedLevel(levelId);
    setOpenLevel(levelId);

  };

  // ==========================================
  // Check Level Unlock
  // ==========================================

  const isLevelUnlocked = (levelId) => {

  if (!progress) return false;

  return progress.unlocked_levels?.includes(levelId);

  };

  // ==========================================
  // Check Exam Unlock
  // ==========================================

  const isExamUnlocked = () => {

    if (!progress) return false;

    return progress.level_exams?.[selectedLevel]?.unlocked;

  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (
      <h2
        style={{
          color: "#fff",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        Loading Classes...
      </h2>
    );

  }
    return (
    <>
      <h2
        style={{
          color: "#fff",
          marginBottom: "25px",
          fontWeight: "bold",
        }}
      >
        📚 English Learning Topics
      </h2>

      {/* ============================
    LEVEL CARDS
============================ */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  }}
>
  {levels.map((level) => {

    const unlocked = isLevelUnlocked(level.level_id);

    return (
      <div
        key={level.level_id}
        onClick={() => unlocked && handleLevelClick(level.level_id)}
        style={{
          background: unlocked ? "#ffffff" : "#e6e6e6",
          padding: "25px",
          borderRadius: "18px",
          cursor: unlocked ? "pointer" : "not-allowed",
          opacity: unlocked ? 1 : 0.65,
          transition: "0.3s",
          border:
            openLevel === level.level_id
              ? "3px solid #c48b96"
              : "3px solid transparent",
          boxShadow: "0 5px 15px rgba(0,0,0,.08)",
        }}
      >
        <h2
          style={{
            color: "#c48b96",
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {level.level_id}

          {!unlocked && (
            <span style={{ fontSize: "28px" }}>
              🔒
            </span>
          )}
        </h2>

        <p
          style={{
            marginTop: "18px",
            fontSize: "20px",
            color: "#444",
          }}
        >
          {level.total_classes} Classes
        </p>

        <p
          style={{
            color: "#666",
            fontWeight: "600",
          }}
        >
          {unlocked
            ? openLevel === level.level_id
              ? "▲ Open"
              : "▼ Click to Open"
            : "🔒 Locked"}
        </p>
      </div>
    );

  })}
</div>

      {/* ============================
          CLASSES
      ============================ */}

      {openLevel === selectedLevel && (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {classes.map((topic) => (
            <div
              key={topic.class_id}
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "18px",
                boxShadow: "0 5px 15px rgba(0,0,0,.08)",
              }}
            >
              <h3
                style={{
                  color: "#c48b96",
                  marginBottom: "10px",
                }}
              >
                Class {topic.class_number}
              </h3>

              <h2>{topic.title}</h2>

              <p
                style={{
                  color: "#666",
                  minHeight: "45px",
                }}
              >
                {topic.description ||
                  "Start learning English with this lesson."}
              </p>

              {/* Progress */}

              <div
                style={{
                  background: "#ddd",
                  height: "10px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    width: topic.is_completed
                      ? "100%"
                      : "0%",
                    height: "100%",
                    background: "#c48b96",
                  }}
                />
              </div>

              {topic.is_completed && (
                <p
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  ✅ Completed
                </p>
              )}

              {!topic.is_completed &&
                topic.is_unlocked && (
                  <p
                    style={{
                      color: "#ff9800",
                      fontWeight: "bold",
                      marginTop: "15px",
                    }}
                  >
                    ▶ Ready to Learn
                  </p>
                )}

              {!topic.is_unlocked && (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  🔒 Locked
                </p>
              )}

              <button
                disabled={!topic.is_unlocked}
                onClick={() =>
                  navigate("/video", {
                    state: {
                      classId: topic.class_id,
                      levelId: selectedLevel,
                      classNumber: topic.class_number,
                      totalClasses: classes.length,
                    },
                  })
                }
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  color: "#fff",
                  background: topic.is_unlocked
                    ? "#c48b96"
                    : "gray",
                  cursor: topic.is_unlocked
                    ? "pointer"
                    : "not-allowed",
                }}
              >
                {topic.is_unlocked
                  ? "▶ START"
                  : "🔒 LOCKED"}
              </button>
            </div>
          ))}
        </div>

        {/* ============================
            FINAL ASSESSMENT
        ============================ */}

        <div
          style={{
            marginTop: "30px",
            background: "#fff",
            padding: "25px",
            borderRadius: "18px",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              color: "#28a745",
              marginBottom: "10px",
            }}
          >
            📝 Final Assessment
          </h2>

          <h3>{selectedLevel} Exam</h3>

          <p
            style={{
              color: "#666",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            Complete this exam to unlock the next level.
          </p>

          <button
            disabled={!isExamUnlocked()}
            onClick={() =>
              navigate("/exam", {
                state: {
                  levelId: selectedLevel,
                },
              })
            }
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "17px",
              color: "#fff",
              background: isExamUnlocked()
                ? "#28a745"
                : "#9e9e9e",
              cursor: isExamUnlocked()
                ? "pointer"
                : "not-allowed",
            }}
          >
            {isExamUnlocked()
              ? "📝 START EXAM"
              : "🔒 EXAM LOCKED"}
          </button>
        </div>
      </>
    )}

      {/* ============================
          LEVEL EXAM
      ============================ */}

      {openLevel === selectedLevel &&
        isExamUnlocked() && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "35px",
            }}
          >
            <button
              onClick={() =>
                navigate("/exam", {
                  state: {
                    levelId: selectedLevel,
                  },
                })
              }
              style={{
                padding: "16px 40px",
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow:
                  "0 6px 15px rgba(0,0,0,.15)",
              }}
            >
              📝 START LEVEL EXAM
            </button>
          </div>
        )}
    </>
  );
};

export default EnglishTopics;