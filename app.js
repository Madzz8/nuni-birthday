// تشغيل المفاجأة يوم 8 بتوقيت السعودية (+03:00)
const TARGET_ISO_KSA = "2026-01-08T00:00:00+03:00";

const $ = (id) => document.getElementById(id);

const targetMs = Date.parse(TARGET_ISO_KSA);

function pad2(n){ return String(n).padStart(2, "0"); }

function showBirthday(){
    const cd = $("countdown");
    const bd = $("birthday");
  
    cd.classList.add("fade-out");
  
    setTimeout(() => {
      cd.classList.add("hidden");
      bd.classList.remove("hidden");
      bd.classList.add("fade-in");
    }, 500);
  }
  

function updateCountdown(){
  const diff = targetMs - Date.now();

  if(diff <= 0){
    showBirthday();
    return;
  }

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

setInterval(updateCountdown, 250);
updateCountdown();

// زر تجربة المفاجأة
$("test").addEventListener("click", showBirthday);

// إطفاء الشمعة
$("blow").addEventListener("click", () => {
  $("flame").classList.add("out");
  $("msg").classList.remove("hidden");
});
