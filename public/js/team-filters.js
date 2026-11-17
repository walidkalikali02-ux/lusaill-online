// Keep /team static while preserving useful q/role filters and shareable URLs.
(() => {
  const form = document.getElementById("team-filters");
  const grid = document.getElementById("team-grid");
  const count = document.getElementById("team-count");
  const empty = document.getElementById("team-empty");
  const reset = document.getElementById("team-reset");
  if (!(form instanceof HTMLFormElement) || !grid || !count || !empty || !reset) return;
  const search = form.querySelector('[name="q"]');
  const role = form.querySelector('[name="role"]');
  if (!(search instanceof HTMLInputElement) || !(role instanceof HTMLSelectElement)) return;

  const cards = [...grid.querySelectorAll("[data-team-search][data-team-role]")];
  const normalize = value => String(value).normalize("NFKC")
    .replace(/[ً-ْ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").toLowerCase();
  const params = new URLSearchParams(window.location.search);
  search.value = (params.get("q") || "").slice(0, 120);
  const savedRole = params.get("role") || "";
  role.value = [...role.options].some(item => item.value === savedRole) ? savedRole : "";

  function filterCards() {
    const query = normalize(search.value.trim().slice(0, 120));
    const selectedRole = role.value;
    let visible = 0;
    for (const card of cards) {
      const matches = (!query || normalize(card.dataset.teamSearch || "").includes(query)) &&
        (!selectedRole || card.dataset.teamRole === selectedRole);
      card.style.display = matches ? "" : "none";
      if (matches) visible++;
    }
    count.textContent = visible.toLocaleString("ar-EG") + " من " + cards.length.toLocaleString("ar-EG") + " ملفًا";
    empty.style.display = visible ? "none" : "";
    reset.style.display = query || selectedRole ? "" : "none";
  }

  function saveFilters() {
    const next = new URL(window.location.href);
    next.searchParams.delete("q");
    next.searchParams.delete("role");
    if (search.value.trim()) next.searchParams.set("q", search.value.trim().slice(0, 120));
    if (role.value) next.searchParams.set("role", role.value);
    next.hash = "team-directory";
    window.history.replaceState(null, "", next);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    saveFilters();
    filterCards();
  });
  search.addEventListener("input", filterCards);
  role.addEventListener("change", filterCards);
  window.addEventListener("popstate", () => {
    const q = new URLSearchParams(window.location.search);
    search.value = (q.get("q") || "").slice(0, 120);
    const value = q.get("role") || "";
    role.value = [...role.options].some(item => item.value === value) ? value : "";
    filterCards();
  });
  filterCards();
})();
