import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

function VideoPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    levelId,
    classId,
    classNumber,
    totalClasses,
  } = location.state || {};

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id || user?.id;

  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [videoCompleted, setVideoCompleted] = useState(false);

  // ==========================================
  // Load Video
  // ==========================================

  useEffect(() => {
    if (!classId) return;

    axios
      .get(`${API_BASE}/learning/video/${classId}`)
      .then((res) => {
        if (res.data.success) {
          setVideoUrl(res.data.data.video_url);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [classId]);

  // ==========================================
  // Complete Class
  // ==========================================

  const handleVideoComplete = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/learning/classes/${classId}/complete`,
        {
          user_id: userId,
        }
      );

      console.log("CLASS COMPLETED", res.data);

      setVideoCompleted(true);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "60px",
        }}
      >
        Loading Video...
      </h2>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#fdf6f8,#f5e7eb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        }}
      >
        <h1
          style={{
            color: "#c48b96",
            marginBottom: 15,
          }}
        >
          🎥 {levelId} - Class {classNumber}
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: 25,
          }}
        >
          Watch the complete lesson.
        </p>

        <video
          width="100%"
          controls
          autoPlay
          onEnded={handleVideoComplete}
          style={{
            borderRadius: "15px",
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {videoCompleted && (
          <>
            <div
              style={{
                background: "#d4edda",
                color: "#155724",
                padding: "15px",
                marginTop: "20px",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              ✅ Lesson Completed Successfully!
            </div>

            <button
              onClick={() => {
                if (classNumber === totalClasses) {
                  navigate("/exam", {
                    state: {
                      levelId,
                      classId,
                    },
                  });
                } else {
                  navigate("/dashboard", {
                    state: {
                      openLevel: levelId,
                    },
                  });
                }
              }}
              style={{
                marginTop: 25,
                padding: "12px 35px",
                background: "#c48b96",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {classNumber === totalClasses
                ? "📝 Start Exam"
                : "Next Class"}
            </button>
          </>
        )}

        <button
          onClick={() =>
            navigate("/dashboard", {
              state: {
                openLevel: levelId,
              },
            })
          }
          style={{
            marginTop: 25,
            padding: "12px 25px",
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          🏠 Dashboard
        </button>
      </div>
    </div>
  );
}

export default VideoPage;


// PUT /learning/classes/:classId/complete
// PUT /learning/classComplete