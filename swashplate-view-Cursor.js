function drawSectionSchematic() {
  const title = chart.querySelector("h3");
  const cap = document.getElementById("chart-cap");
  title.textContent = "Uniball sleeve, section schematic";
  title.style.color = "#00e5ff";
  cap.textContent = "Viewing-plane diagram of the stack. Proportions are illustrative. The parts are not removed.";
  plot.setAttribute("aria-label", "Schematic section through the mast, uniball, and both swash-plate rings.");
  plot.innerHTML = `
    <rect x="36" y="16" width="18" height="86" fill="#344257"/>
    <circle cx="72" cy="58" r="20" fill="#8b98a8" stroke="#00e5ff" stroke-width="1"/>
    <rect x="96" y="64" width="78" height="14" fill="#344257" stroke="#9aa6b6"/>
    <rect x="100" y="40" width="70" height="12" fill="#4d6078" stroke="#00e5ff"/>
    <circle cx="124" cy="58" r="3" fill="#e7edf5"/>
    <circle cx="146" cy="58" r="3" fill="#e7edf5"/>
    <text x="8" y="108" fill="#9aa6b6" font-size="9">mast</text>
    <text x="58" y="108" fill="#9aa6b6" font-size="9">uniball</text>
    <text x="118" y="108" fill="#9aa6b6" font-size="9">two rings</text>`;
}
