// ===== CONFIG =====
const SCRIPT_URL ="https://script.google.com/macros/s/AKfycbyWqpU3tt4dYZSzG8nDjQoNvRgl0VzjDTcXiuFjhHNHNsnLQIQlj1oaap77A8vlWO60mw/exec";
const questions = [
" "];
let targetQuestionIndex = 1;

let stopwatchInterval = null;
let startTime = null;

// ===== ENTRY POINT =====
document.addEventListener("DOMContentLoaded", isLogged);

function isLogged() {
  const studentData = localStorage.getItem("student");

  if (!studentData) {
    showLoginForm();
  } else {
    showQuestion();
  }
}

// ===== LOGIN / REGISTRATION =====
function showLoginForm() {
  const loginEl = document.getElementById("login");
  const questionEl = document.getElementById("question");

  if (questionEl) questionEl.style.display = "none";
  if (!loginEl) return;

  loginEl.style.display = "block";
  loginEl.innerHTML = `
        <div class="form-card">
            <h3 style="color: white; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">
                QUIZZERS ANONYMOUS
            </h3>
            <p style="color: white; font-size: 16px; margin-bottom: 20px;">
                Register to begin
            </p>

            <input type="text" id="name" placeholder="Name" title="Enter your Name" autocomplete="off">
            <input type="text" id="ph" placeholder="Phone Number" title="Enter your Phone Number" autocomplete="off">
            <input type="text" id="roll" placeholder="Roll No" title="Enter your Roll No" autocomplete="off">
            <input type="text" id="dept" placeholder="Department" title="Enter your Department" autocomplete="off">
            <input type="button" value="SUBMIT" onclick="SUBMIT()">
        </div>
    `;
}

function SUBMIT() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("ph").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const dept = document.getElementById("dept").value.trim();

  if (!name || !phone || !roll || !dept) {
    window.alert("Please fill in all fields before submitting.");
    return;
  }

  const data = { name, phone, roll, dept };

  localStorage.setItem("student", JSON.stringify(data));

  const loginEl = document.getElementById("login");
  if (loginEl) {
    loginEl.innerHTML = "";
    loginEl.style.display = "none";
  }

  showQuestion();
}

// ===== QUESTION PAGE =====
function showQuestion() {
  const status = JSON.parse(localStorage.getItem("submitStatus"));

if (status && status.qn === "1" && status.status === "submitted") {
    showSuccess();
    return;
}


  const loginEl = document.getElementById("login");
  const questionEl = document.getElementById("question");

  if (loginEl) loginEl.style.display = "none";
  if (questionEl) questionEl.style.display = "block";

  let studentData = localStorage.getItem("student");
  let studentName = "STUDENT";
  if (studentData) {
    let parsed = JSON.parse(studentData);
    if (parsed.name) studentName = parsed.name.toUpperCase();
  }

  let qDisplayNum = targetQuestionIndex + 1;

  if (questionEl) {
    questionEl.innerHTML = `
        <div class="form-card">
            <h3 style="color: white; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">
                QUIZZERS ANONYMOUS
            </h3>
            <p style="color: white; font-size: 16px; margin-bottom: 15px;">
                THEME:  <strong style="color: white;">HISTORY</strong>
            </p>

            <div style="margin-bottom: 15px;">
                <span style="font-size: 15px; font-weight: bold; color: white;">
                    Question ${qDisplayNum} of 13
                </span>
            </div>

            <div style="background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 10px; margin-bottom: 20px;">
                <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: white;">⏱ Time Elapsed</span>
                <div id="timerDisplay" style="font-size: 26px; font-weight: bold; font-family: monospace; color: white; margin-top: 2px;">00:00</div>
            </div>

            <p style="color: white; font-size: 19px; font-weight: 500; margin-bottom: 20px; line-height: 1.4;">

            </p>

            <input type="text" id="answer" placeholder="Type your answer" autocomplete="off">
            <input type="button" id="submitBtn" value="Submit Answer" onclick="confirmSubmission()">
        </div>

        <div id="confirmModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); justify-content:center; align-items:center; z-index:1000;">
            <div class="form-card" style="max-width: 380px; text-align: center; border: 1px solid rgba(255, 0, 255, 0.4);">
                <h3 style="color: white; margin-bottom: 12px; font-size: 22px;">Submit Answer?</h3>
                <p style="color: white; font-size: 15px; margin-bottom: 22px;">Are you sure you want to finalize your answer?</p>
                <div style="display: flex; gap: 10px;">
                    <input type="button" value="Cancel" onclick="closeModal()" style="background: rgba(255, 255, 255, 0.2); flex: 1;">
                    <input type="button" value="Submit" onclick="processAnswerSubmit()" style="flex: 1;">
                </div>
            </div>
        </div>
        `;
  }

  startStopwatch();
}

// ===== CONFIRMATION MODAL =====
function confirmSubmission() {
  const answerInput = document.getElementById("answer");
  const answer = answerInput ? answerInput.value.trim() : "";

  if (!answer) {
    window.alert("Please enter an answer before submitting.");
    return;
  }

  const modal = document.getElementById("confirmModal");
  if (modal) modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("confirmModal");
  if (modal) modal.style.display = "none";
}

// ===== STOPWATCH =====
function startStopwatch() {
  startTime = Date.now();
  const timerEl = document.getElementById("timerDisplay");

  updateStopwatchDisplay(timerEl, 0);

  stopwatchInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    updateStopwatchDisplay(document.getElementById("timerDisplay"), elapsedSeconds);
  }, 1000);
}

function updateStopwatchDisplay(timerEl, elapsedSeconds) {
  if (!timerEl) return;
  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
}

function stopStopwatch() {
  if (stopwatchInterval) {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
  }
  if (startTime == null) return 0;
  return Math.floor((Date.now() - startTime) / 1000);
}

// ===== SUBMISSION =====
async function processAnswerSubmit() {
  closeModal();

  const elapsedSeconds = stopStopwatch();

  const studentData = JSON.parse(localStorage.getItem("student"));
  if (!studentData) {
    console.error("No student data found in localStorage.");
    return;
  }

  const answerInput = document.getElementById("answer");
  const ans = answerInput ? answerInput.value : "";

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) submitBtn.disabled = true;
  if (answerInput) answerInput.disabled = true;

  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

  const dataPost = {
    name: studentData.name,
    phone: studentData.phone,
    roll: studentData.roll,
    dept: studentData.dept,
    qn: String(targetQuestionIndex + 1),
    ans: ans,
    timeTaken: `${minutes}:${seconds}`,
    timeTakenSeconds: elapsedSeconds,
    time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  };

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(dataPost)
    });

    localStorage.setItem("submitStatus", JSON.stringify({ qn:"2",status: "submitted" }));
    showSuccess();

  } catch (err) {
    console.error("Error:", err);
    window.alert("Submission failed — please try again.");
    if (submitBtn) submitBtn.disabled = false;
    if (answerInput) answerInput.disabled = false;
  }
}

// ===== SUCCESS PAGE =====
function showSuccess() {
  const questionEl = document.getElementById("question");
  const successEl = document.getElementById("success");

  if (questionEl) {
    questionEl.style.display = "none";
    questionEl.innerHTML = "";
  }

  if (successEl) {
    successEl.style.display = "block";
    successEl.innerHTML = `
        <div class="form-card">
            <h3 style="color: white; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">
                QUIZZERS ANONYMOUS
            </h3>
            <h1 style="color: white; font-size: 22px; margin: 10px 0;">Thank You!</h1>
            <p style="color: white; font-size: 15px;">Your response has been submitted successfully.</p>
        </div>
    `;
  }
}
