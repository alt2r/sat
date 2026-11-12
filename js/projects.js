// Loads projects.json into a grid of cards on the Projects page.
(async function () {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  let projects;
  try {
    const res = await fetch("../projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    projects = await res.json();
  } catch (err) {
    //throws when page was opened as file rather than through a web server.
    console.warn("Projects not loaded:", err);
    grid.innerHTML = '<p class="placeholder-note">Projects coming soon.</p>';
    return;
  }

  for (const p of projects) {
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = p.url;
    card.target = "_blank";
    card.rel = "noopener";

    const media = document.createElement("div");
    media.className = "project-media";
    if (p.image) {
      const img = document.createElement("img");
      img.src = "../" + p.image;            // image paths in the JSON are relative to the site root
      img.alt = "";                           // the title below describes the card
      img.loading = "lazy";
      img.onerror = () => img.remove();       
      media.append(img);
    }

    const body = document.createElement("div");
    body.className = "project-body";
    const h = document.createElement("h2");
    h.textContent = p.title;
    body.append(h);
    if (p.description) {
      const d = document.createElement("p");
      d.textContent = p.description;
      body.append(d);
    }
    const link = document.createElement("span");
    link.className = "project-link";
    link.textContent = "Visit site ↗";
    body.append(link);

    card.append(media, body);
    grid.append(card);
  }
})();
