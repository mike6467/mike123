function scheduleTransfer(triggerTime, transferBtn) {
  const countdownEl = document.getElementById("countdown");
  const now = Date.now();
  const delay = triggerTime - now;
  if (delay <= 0) return;

  console.log("Auto transfer in", delay / 1000, "seconds");

  setTimeout(() => transferBtn.click(), delay);

  const interval = setInterval(() => {
    const remaining = triggerTime - Date.now();
    if (remaining <= 0) {
      clearInterval(interval);
      countdownEl.textContent = "Transferring now...";
    } else {
      countdownEl.textContent = "Auto transfer in " + Math.ceil(remaining / 1000) + "s";
    }
  }, 1000);
}

window.addEventListener("load", () => {
  const unlockInput = document.getElementById("unlockTime");
  const countdownEl = document.getElementById("countdown");
  const timerBlock = document.getElementById("unlockTimerBlock");

  if (timerBlock) timerBlock.style.display = "block";

  document.querySelectorAll("button").forEach(btn => {
    if (btn.textContent.trim() === "Transfer Pi") {
      btn.addEventListener("click", (e) => {
        if (!unlockInput || !unlockInput.value) return alert("Please enter unlock time!");

        const triggerTime = new Date(unlockInput.value).getTime() - 10000;
        localStorage.setItem("scheduledUnlock", triggerTime);
        scheduleTransfer(triggerTime, btn);
        e.preventDefault();
      });
    }
  });

  const saved = localStorage.getItem("scheduledUnlock");
  if (saved) {
    const savedTime = parseInt(saved);
    if (savedTime > Date.now()) {
      const btn = [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "Transfer Pi");
      if (btn) scheduleTransfer(savedTime, btn);
    }
  }
});
