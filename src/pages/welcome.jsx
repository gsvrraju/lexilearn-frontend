import React from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "../assets/videos/lexilearn_promo.mp4";
import DashboardPage from "./dashboard";
import ExamPage from "./exampage";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={() => navigate("/login")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default WelcomePage;




// api s


// DashboardPage
// GET /learning/levels
// GET /learning/:levelId/classes

// video page
// PUT /learning/class-complete

// {
//   "level_id": 1,
//   "class_id": 2
// }

// ExamPage
// GET /learning/questions/:classId

// submit Exam
// PUT /learning/exam-result


// {
//   "level_id": 1,
//   "class_id": 5,
//   "score": 9,
//   "percentage": 90,
//   "passed": true
// }


// unlock level
// PUT /learning/unlock-level
// {
//   "level_id": 2
// }