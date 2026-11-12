// Swaps any <div data-include="name"> for the contents of partials/name.html
(async function () {
  // Work out the site root from where this script lives (js/ is one level below root)
  const root = new URL("..", document.currentScript.src).href;

  for (const el of document.querySelectorAll("[data-include]")) {
    try {
      const res = await fetch(root + "partials/" + el.dataset.include + ".html");
      if (!res.ok) throw new Error("HTTP " + res.status);
      el.outerHTML = (await res.text()).replaceAll("{{root}}", root);
    } catch (err) {
      console.warn("Include failed:", el.dataset.include, err);
    }
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();