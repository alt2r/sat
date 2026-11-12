// Loads reviews.json into the home page; auto-advances only when the cards overflow.
(async function () {
  const section = document.getElementById("reviews");
  const track = document.getElementById("review-track");
  if (!section || !track) return;

  let reviews;
  try {
    const res = await fetch("reviews.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    reviews = await res.json();
  } catch (err) {
    // Usually means the page was opened as file:// rather than through a web server.
    console.warn("Reviews not loaded:", err);
    section.hidden = true;
    return;
  }
  if (!Array.isArray(reviews) || reviews.length === 0) { section.hidden = true; return; }

  for (const r of reviews) {
    const fig = document.createElement("figure");
    fig.className = "review";
    fig.dataset.service = "digital"; //makes the reviews orange, used to have other functionality
    const quote = document.createElement("blockquote");
    quote.textContent = r.quote;
    const cap = document.createElement("figcaption");
    const name = document.createElement("strong");
    name.textContent = r.name;
    cap.append(name, r.context || "");
    fig.append(quote, cap);
    track.append(fig);
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null, paused = false;

  const overflows = () => track.scrollWidth > track.clientWidth + 4;

  function step() {
    if (paused) return;
    const card = track.querySelector(".review");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + card.offsetWidth + gap });
  }

  function update() {
    const fits = !overflows();
    track.classList.toggle("fits", fits);
    clearInterval(timer);
    if (!fits && !reduceMotion) timer = setInterval(step, 6000);
  }

  // Pause while someone is reading or interacting
  ["mouseenter", "focusin", "touchstart"].forEach(e => track.addEventListener(e, () => { paused = true; }, { passive: true }));
  ["mouseleave", "focusout"].forEach(e => track.addEventListener(e, () => { paused = false; }));
  window.addEventListener("resize", update);
  update();
})();
