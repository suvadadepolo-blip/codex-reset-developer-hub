const card = document.querySelector("#forecast-card");
const p24 = document.querySelector("#p24");
const p48 = document.querySelector("#p48");
const confidence = document.querySelector("#confidence");
const forecastTime = document.querySelector("#forecast-time");

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

async function loadForecast() {
  try {
    const response = await fetch("https://codex-reset.com/api/forecast", {
      headers: { accept: "application/json" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const rounded24 = data?.probabilities?.rounded_24h;
    const rounded48 = data?.probabilities?.rounded_48h;
    if (!Number.isFinite(rounded24) || !Number.isFinite(rounded48)) {
      throw new Error("Documented probability fields were unavailable");
    }

    p24.textContent = `${rounded24}%`;
    p48.textContent = `${rounded48}%`;
    confidence.textContent = data.confidence || "Not stated";
    const updated = formatTime(data.updated_at);
    forecastTime.textContent = updated
      ? `API updated ${updated}. Data: codex-reset.com`
      : "Live response loaded. Data: codex-reset.com";
  } catch (error) {
    p24.textContent = "—";
    p48.textContent = "—";
    confidence.textContent = "Unavailable";
    forecastTime.textContent = "The live preview could not load. Open the full documentation or API directly.";
  } finally {
    card.setAttribute("aria-busy", "false");
  }
}

loadForecast();
