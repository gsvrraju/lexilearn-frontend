import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

function ExamPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { levelId } = state || {};

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!levelId) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE}/learning/questions/${levelId}`)
      .then((res) => {
        console.log("Questions Response:", res.data);

        if (res.data.success) {
          setQuestions(res.data.data);
        } else {
          setQuestions([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setQuestions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [levelId]);

  const handleAnswer = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const submitExam = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        user_id: userId,
        level_id: levelId,
        answers: questions.map((q, index) => ({
          question_id: q.question_id,
          selected_answer: answers[index],
        })),
      };

      console.log("Submitting Exam:", payload);

      const { data } = await axios.post(
        `${API_BASE}/learning/exam/submit`,
        payload
      );

      console.log("Exam Result:", data);

    navigate("/score", {
  state: {
    score: data.score,
    total: data.total,
    percentage: data.percentage,
    passed: data.passed,
    levelId: levelId,
    userId: userId,
  },
});
    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data.message || "Exam Submission Failed");
      } else {
        alert("Unable to connect to server.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "80px" }}>
        Loading Questions...
      </h2>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fdf6f8,#f4e6ea)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#c48b96" }}>
            📝 {levelId} Exam
          </h1>

          <h3>Total Questions : {questions.length}</h3>
        </div>

        {questions.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h2>No Questions Found</h2>
          </div>
        ) : (
          questions.map((q, index) => (
            <div
              key={q.question_id}
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "15px",
                marginBottom: "20px",
              }}
            >
              <h3>Question {index + 1}</h3>

              <h2
                style={{
                  color: "#c48b96",
                }}
              >
                {q.question}
              </h2>

              {q.options.map((option) => (
                <label
                  key={option}
                  style={{
                    display: "block",
                    padding: "12px",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={(e) =>
                      handleAnswer(index, e.target.value)
                    }
                  />

                  {" "}
                  {option}
                </label>
              ))}
            </div>
          ))
        )}

        {questions.length > 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            <button
              onClick={submitExam}
              disabled={submitting}
              style={{
                padding: "15px 40px",
                background: "#c48b96",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "18px",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Submitting..." : "✅ Submit Exam"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamPage;