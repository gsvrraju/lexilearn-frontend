import  { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/signup-bg.jpg";

function SignupPage() {
  const navigate = useNavigate();

 const [form, setForm] = useState({
  name: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  nativeLanguage: "",

  learningPurpose: "",
  twoHours: "",
  twoHundredHours: "",
  willingStudent: "",
  preferredTime: "",

  voice: null,
});
const mediaRecorderRef = useRef(null);
const audioChunksRef = useRef([]);

const [isRecording, setIsRecording] = useState(false);
const [audioURL, setAudioURL] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const audioUrl = URL.createObjectURL(audioBlob);

      setAudioURL(audioUrl);

      setForm((prev) => ({
        ...prev,
        voice: audioBlob,
      }));
    };

    mediaRecorder.start();

    setIsRecording(true);
  } catch {
    alert("Microphone permission denied");
  }
};

const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }
};

  const [loading, setLoading] = useState(false);

const handleSignup = async () => {
  if (
    !form.name ||
    !form.email ||
    !form.mobile ||
    !form.password ||
    !form.confirmPassword ||
    !form.nativeLanguage ||
    !form.learningPurpose ||
    !form.twoHours ||
    !form.twoHundredHours ||
    !form.willingStudent ||
    !form.preferredTime
  ) {
    alert("Please fill all fields.");
    return;
  }

  if (form.password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      full_name: form.name,
      email: form.email,
      mobile_number: form.mobile,
      password: form.password,
      confirm_password: form.confirmPassword,
      native_language: form.nativeLanguage,
      learning_goal: form.learningPurpose,
      daily_two_hours: form.twoHours === "Yes",
      total_200_hours: form.twoHundredHours === "Yes",
      willing_to_learn: form.willingStudent === "Yes",
      preferred_learning_time: form.preferredTime,

      // Voice is optional
      voice_sample_url: "",
    };

  const response = await axios.post(
      "http://127.0.0.1:8000/auth/signup",
      payload
    );

    console.log("Signup Response:", response.data);

    if (!response.data.success) {
      alert(response.data.message);
      return;
    }

    const userId = response.data.user_id;

    console.log("User ID:", userId);

    // Upload voice recording
    if (form.voice) {

      const audioFormData = new FormData();

      audioFormData.append("user_id", userId);

      audioFormData.append(
        "audio",
        form.voice,
        "introduction.webm"
      );

      const uploadResponse = await axios.post(
        "http://127.0.0.1:8000/audio/upload",
        audioFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Audio Uploaded:", uploadResponse.data);
    }

    alert("Account Created Successfully!");

    navigate("/login");

  } catch (error) {

  console.log("========== ERROR ==========");
  console.log(error);
  console.log(error.response);
  console.log(error.request);
  console.log(error.message);

  if(error.response){
      console.log(error.response.data);
  }


    if (error.response) {

      if (typeof error.response.data === "string") {
        alert(error.response.data);
      }

      else if (error.response.data.message) {
        alert(error.response.data.message);
      }

      else if (error.response.data.detail) {

        if (Array.isArray(error.response.data.detail)) {
          alert(error.response.data.detail[0].msg);
        } else {
          alert(error.response.data.detail);
        }

      }

      else {
        alert("Signup Failed");
      }

    } else {
      alert("Server Not Responding");
    }

  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        ...styles.container,
        backgroundImage: `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.6)),url(${bgImage})`,
      }}
    >
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account 🚀</h1>

        <p style={styles.subtitle}>
          Join Lexi Learn English and start your learning journey.
        </p>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          style={styles.input}
        />
<input
  type="password"
  name="confirmPassword"
  placeholder="Confirm Password"
  value={form.confirmPassword}
  onChange={handleChange}
  minLength={8}
  style={styles.input}
/>
        

        

        <select
          name="nativeLanguage"
          value={form.nativeLanguage}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Native Language</option>
          <option>Telugu</option>
          <option>Hindi</option>
          <option>Tamil</option>
          <option>Kannada</option>
          <option>Malayalam</option>
          <option>English</option>
          <option>Other</option>
        </select>

<label style={styles.label}>
Why do you want to learn English?
</label>

<select

  name="learningPurpose"
  value={form.learningPurpose}
  onChange={handleChange}
  style={styles.input}
>
  <option value="">Select Reason</option>

  <option value="Improve my career opportunities">
    Improve my career opportunities
  </option>

  <option value="Communicate confidently with people">
    Communicate confidently with people
  </option>

  <option value="Prepare for job interviews">
    Prepare for job interviews
  </option>

  <option value="Prepare for competitive examinations">
    Prepare for competitive examinations
  </option>
</select>


<label style={styles.label}>
Can you spend two hours every day on this course?
</label>

<div style={styles.radioGroup}>
  <label>
    <input
      type="radio"
      name="twoHours"
      value="Yes"
      checked={form.twoHours === "Yes"}
      onChange={handleChange}
    />
    Yes
  </label>

  <label>
    <input
      type="radio"
      name="twoHours"
      value="No"
      checked={form.twoHours === "No"}
      onChange={handleChange}
    />
    No
  </label>
</div>
<label style={styles.label}>
Are you able to spend 200 hours on this course?
</label>

<div style={styles.radioGroup}>
  <label>
    <input
      type="radio"
      name="twoHundredHours"
      value="Yes"
      checked={form.twoHundredHours === "Yes"}
      onChange={handleChange}
    />
    Yes
  </label>

  <label>
    <input
      type="radio"
      name="twoHundredHours"
      value="No"
      checked={form.twoHundredHours === "No"}
      onChange={handleChange}
    />
    No
  </label>
</div>
<label style={styles.label}>
Are you willing to learn like a student?
</label>

<div style={styles.radioGroup}>
  <label>
    <input
      type="radio"
      name="willingStudent"
      value="Yes"
      checked={form.willingStudent === "Yes"}
      onChange={handleChange}
    />
    Yes
  </label>

  <label>
    <input
      type="radio"
      name="willingStudent"
      value="No"
      checked={form.willingStudent === "No"}
      onChange={handleChange}
    />
    No
  </label>
</div>
<label style={styles.label}>
What time do you prefer to learn this course every day?
</label>

<div style={styles.radioGroup}>
  <label>
    <input
      type="radio"
      name="preferredTime"
      value="Morning"
      checked={form.preferredTime === "Morning"}
      onChange={handleChange}
    />
    Morning
  </label>

  <label>
    <input
      type="radio"
      name="preferredTime"
      value="Afternoon"
      checked={form.preferredTime === "Afternoon"}
      onChange={handleChange}
    />
    Afternoon
  </label>

  <label>
    <input
      type="radio"
      name="preferredTime"
      value="Evening"
      checked={form.preferredTime === "Evening"}
      onChange={handleChange}
    />
    Evening
  </label>
</div>
<label style={styles.label}>
  🎤 Record Your Self Introduction
</label>

<div style={{ marginBottom: "20px" }}>
  {!isRecording ? (
    <button
      type="button"
      onClick={startRecording}
      style={{
        ...styles.recordButton,
        background: "#28a745",
      }}
    >
      🎙 Start Recording
    </button>
  ) : (
    <button
      type="button"
      onClick={stopRecording}
      style={{
        ...styles.recordButton,
        background: "#dc3545",
      }}
    >
      ⏹ Stop Recording
    </button>
  )}
</div>

{audioURL && (
  <div
    style={{
      display: "flex",
      gap: "10px",
      alignItems: "center",
      marginBottom: "20px",
    }}
  >
    <audio
      controls
      controlsList="nodownload"
      disablePictureInPicture
      src={audioURL}
    />

    <button
      type="button"
      onClick={() => {
        setAudioURL("");
        setForm((prev) => ({
          ...prev,
          voice: null,
        }));
      }}
      style={{
        background: "#dc3545",
        color: "#fff",
        border: "none",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      🗑 Delete
    </button>
  </div>
)}    

        
<button
  type="button"
  style={styles.button}
  onClick={handleSignup}
  disabled={loading}
>
  {loading ? "Creating Account..." : "Sign Up"}
</button>
        <p style={styles.text}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "40px 0",
  },

  card: {
    width: "450px",
    background: "rgba(255,255,255,.12)",
    backdropFilter: "blur(12px)",
    padding: "35px",
    borderRadius: "20px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,.3)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#ddd",
  },

  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
  },

  file: {
    width: "100%",
    marginBottom: "20px",
    color: "#fff",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(#c48b96,#c48b96,#c48b96)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  text: {
    textAlign: "center",
    marginTop: "20px",
  },

  link: {
    color: "#c48b96",
    cursor: "pointer",
    fontWeight: "bold",
  },
  radioGroup: {
  display: "flex",
  gap: "25px",
  marginBottom: "20px",
  color: "#fff",
  alignItems: "center",
  flexWrap: "wrap",
},
recordButton: {
  width: "100%",
  padding: "12px",
  border: "none",
  color: "#fff",
  fontSize: "16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
},
};

export default SignupPage;