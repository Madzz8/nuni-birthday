// تشغيل المفاجأة يوم 8 بتوقيت السعودية (+03:00)
const TARGET_ISO_KSA = "2026-01-08T00:00:00+03:00";
const $ = (id) => document.getElementById(id);
const targetMs = Date.parse(TARGET_ISO_KSA);

function pad2(n) { return String(n).padStart(2, "0"); }

let birthdayShown = false;
let timer = null;

const micBtn = $("micBtn");
const micStatus = $("micStatus");

function setMicStatus(msg) {
  if (micStatus) micStatus.textContent = msg;
}

function hideButtons() {
  const row = document.querySelector(".btnRow");
  if (row) row.classList.add("hidden");
}

function revealMessage() {
  $("flame").classList.add("out");
  $("msg").classList.remove("hidden");
  hideButtons();
  setMicStatus("🎉");
}

function showBirthday() {
  if (birthdayShown) return;
  birthdayShown = true;

  if (timer) { clearInterval(timer); timer = null; }

  const cd = $("countdown");
  const bd = $("birthday");

  cd.classList.add("fade-out");
  $("subtitle").textContent = "اليوم يومك يا نوني 💗";

  setTimeout(() => {
    cd.classList.add("hidden");
    bd.classList.remove("hidden");
    bd.classList.add("fade-in");
  }, 500);
}

function updateCountdown() {
  const diff = targetMs - Date.now();
  if (diff <= 0) { showBirthday(); return; }

  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  $("d").textContent = days;
  $("h").textContent = pad2(hours);
  $("m").textContent = pad2(mins);
  $("s").textContent = pad2(secs);
}

timer = setInterval(updateCountdown, 250);
updateCountdown();

$("test").addEventListener("click", showBirthday);
$("blow").addEventListener("click", () => { showBirthday(); revealMessage(); });

/* ===== Mic Blow (سهل) ===== */
let blown = false;

async function startMicBlow() {
  showBirthday();

  if (blown) return;

  if (!window.isSecureContext) {
    setMicStatus("افتحيها من GitHub Pages (https) عشان المايك يشتغل.");
    return;
  }

  try {
    setMicStatus("جاري تجهيز المايك…");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);

    const THRESHOLD = 0.075; // حساسية أعلى
    const NOISE_GATE = 5.2;
    const HOLD_FRAMES = 5;
    const TIMEOUT = 9000;

    let hit = 0;
    const start = Date.now();

    micBtn.disabled = true;
    micBtn.textContent = "انفخي الآن… 💨";
    setMicStatus("انفخي باتجاه المايك 💨");

    const stopAll = () => {
      stream.getTracks().forEach(t => t.stop());
      ctx.close();
    };

    const loop = () => {
      analyser.getByteTimeDomainData(data);

      // RMS
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      // noisiness
      let diffSum = 0;
      for (let i = 1; i < data.length; i++) {
        diffSum += Math.abs(data[i] - data[i - 1]);
      }
      const noisiness = diffSum / data.length;

      const looksLikeBlow = (rms > THRESHOLD) && (noisiness > NOISE_GATE);

      if (looksLikeBlow) hit++;
      else hit = Math.max(0, hit - 1);

      if (hit >= HOLD_FRAMES) {
        blown = true;
        stopAll();
        micBtn.textContent = "سلام يا 🎀";
        setMicStatus("🎉 نفخة قوية! انطفأت");
        revealMessage();
        return;
      }

      if (Date.now() - start > TIMEOUT) {
        stopAll();
        micBtn.disabled = false;
        micBtn.textContent = "ما ضبط؟ جرّبي مرة ثانية 🎤";
        setMicStatus("جرّبي أقرب للمايك.");
        return;
      }

      requestAnimationFrame(loop);
    };

    loop();
  } catch (e) {
    micBtn.disabled = false;
    micBtn.textContent = "انفخي الشمعة 🎤💨";
    setMicStatus("اسمحي بالمايك من إعدادات الموقع.");
    console.error(e);
  }
}

micBtn.addEventListener("click", startMicBlow);

console.log("APP JS LOADED ✅");
