(() => {
  "use strict";

  const teams = [
    { name: "Barcelona SC", short: "BAR", played: 10, wins: 7, draws: 2, losses: 1, goalsFor: 18, goalsAgainst: 7, points: 23, cards: 17, trend: [0, 3, 6, 9, 12, 15, 16, 19, 20, 23] },
    { name: "Independiente del Valle", short: "IDV", played: 10, wins: 6, draws: 2, losses: 2, goalsFor: 16, goalsAgainst: 10, points: 20, cards: 14, trend: [0, 3, 6, 7, 10, 13, 16, 17, 20, 20] },
    { name: "LDU Quito", short: "LDU", played: 10, wins: 5, draws: 2, losses: 3, goalsFor: 15, goalsAgainst: 11, points: 17, cards: 19, trend: [0, 3, 4, 7, 10, 10, 13, 14, 17, 17] },
    { name: "Orense SC", short: "ORE", played: 10, wins: 4, draws: 4, losses: 2, goalsFor: 14, goalsAgainst: 11, points: 16, cards: 16, trend: [0, 1, 4, 7, 8, 11, 12, 13, 16, 16] },
    { name: "U. Católica", short: "UTC", played: 10, wins: 3, draws: 4, losses: 3, goalsFor: 12, goalsAgainst: 13, points: 13, cards: 21, trend: [0, 3, 4, 4, 7, 8, 9, 10, 13, 13] },
    { name: "Emelec", short: "EME", played: 10, wins: 2, draws: 4, losses: 4, goalsFor: 11, goalsAgainst: 15, points: 10, cards: 24, trend: [0, 1, 4, 4, 5, 8, 8, 9, 10, 10] },
    { name: "Aucas", short: "AUC", played: 10, wins: 1, draws: 4, losses: 5, goalsFor: 9, goalsAgainst: 16, points: 7, cards: 22, trend: [0, 0, 1, 4, 4, 5, 6, 7, 7, 7] },
    { name: "Mushuc Runa", short: "MUS", played: 10, wins: 0, draws: 2, losses: 8, goalsFor: 8, goalsAgainst: 20, points: 2, cards: 26, trend: [0, 0, 1, 1, 1, 2, 2, 2, 2, 2] }
  ].map((team) => ({ ...team, goalDiff: team.goalsFor - team.goalsAgainst }));

  const colors = { green: "#296b48", lime: "#c4df59", blue: "#6a94d4", coral: "#e88369", grid: "#e7ece5", muted: "#7d8980" };
  const filter = document.getElementById("teamFilter");
  const tableBody = document.getElementById("standingsBody");
  const legend = document.getElementById("resultsLegend");
  const chartFont = { family: "Inter, sans-serif", size: 9 };

  teams.forEach((team) => {
    const option = document.createElement("option");
    option.value = team.short;
    option.textContent = team.name;
    filter.append(option);
  });

  const commonPlugins = {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#19251f",
      titleFont: { family: "Inter, sans-serif", size: 11, weight: "700" },
      bodyFont: chartFont,
      padding: 10,
      displayColors: true,
      cornerRadius: 2
    }
  };

  const goalsChart = new Chart(document.getElementById("goalsChart"), {
    type: "bar",
    data: { labels: teams.map((team) => team.short), datasets: [{ label: "Goles a favor", data: teams.map((team) => team.goalsFor), backgroundColor: teams.map(() => colors.green), hoverBackgroundColor: colors.lime, borderRadius: 1, maxBarThickness: 30 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { ...commonPlugins, tooltip: { ...commonPlugins.tooltip, callbacks: { title: (items) => teams.find((team) => team.short === items[0].label)?.name || items[0].label, label: (item) => ` ${item.raw} goles` } } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: colors.muted, font: chartFont } }, y: { beginAtZero: true, suggestedMax: 20, grid: { color: colors.grid }, border: { display: false, dash: [3, 3] }, ticks: { stepSize: 5, color: colors.muted, font: chartFont, padding: 8 } } } }
  });

  const resultsChart = new Chart(document.getElementById("resultsChart"), {
    type: "doughnut",
    data: { labels: ["Victorias", "Empates", "Derrotas"], datasets: [{ data: [28, 24, 28], backgroundColor: [colors.green, colors.lime, colors.coral], borderColor: "#fafbf7", borderWidth: 4, hoverOffset: 5 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "69%", plugins: { ...commonPlugins, tooltip: { ...commonPlugins.tooltip, callbacks: { label: (item) => ` ${item.label}: ${item.raw} partidos-equipo` } } } }
  });

  const pointsChart = new Chart(document.getElementById("pointsChart"), {
    type: "line",
    data: { labels: Array.from({ length: 10 }, (_, index) => `F${index + 1}`), datasets: [{ label: teams[0].name, data: teams[0].trend, borderColor: colors.green, backgroundColor: "rgba(41,107,72,.1)", fill: true, tension: .34, pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: colors.green, borderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { ...commonPlugins, tooltip: { ...commonPlugins.tooltip, callbacks: { label: (item) => ` ${item.dataset.label}: ${item.raw} puntos` } } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: colors.muted, font: chartFont } }, y: { beginAtZero: true, suggestedMax: 25, grid: { color: colors.grid }, border: { display: false }, ticks: { stepSize: 5, color: colors.muted, font: chartFont } } } }
  });

  const cardsChart = new Chart(document.getElementById("cardsChart"), {
    type: "bar",
    data: { labels: teams.map((team) => team.short), datasets: [{ label: "Tarjetas amarillas", data: teams.map((team) => team.cards), backgroundColor: teams.map(() => "#d3a54d"), hoverBackgroundColor: colors.coral, borderRadius: 1, maxBarThickness: 14 }] },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { ...commonPlugins, tooltip: { ...commonPlugins.tooltip, callbacks: { title: (items) => teams.find((team) => team.short === items[0].label)?.name || items[0].label, label: (item) => ` ${item.raw} tarjetas amarillas` } } }, scales: { x: { beginAtZero: true, suggestedMax: 30, grid: { color: colors.grid }, border: { display: false }, ticks: { stepSize: 10, color: colors.muted, font: chartFont } }, y: { grid: { display: false }, border: { display: false }, ticks: { color: colors.muted, font: chartFont } } } }
  });

  const radarChart = new Chart(document.getElementById("radarChart"), {
    type: "radar",
    data: { labels: ["Ataque", "Puntos", "Defensa", "Disciplina", "Victorias"], datasets: [] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { ...commonPlugins, tooltip: { ...commonPlugins.tooltip, callbacks: { label: (item) => ` ${item.dataset.label}: ${item.raw}` } } }, scales: { r: { beginAtZero: true, max: 10, ticks: { display: false, stepSize: 2 }, grid: { color: colors.grid }, angleLines: { color: colors.grid }, pointLabels: { color: colors.muted, font: { family: "Inter, sans-serif", size: 8 } } } } }
  });

  function renderTable() {
    tableBody.replaceChildren();
    teams.forEach((team, index) => {
      const row = document.createElement("tr");
      if (index < 4) row.classList.add("playoff-row");
      row.innerHTML = `<td>${String(index + 1).padStart(2, "0")}</td><td class="team-cell"><span class="team-emblem">${team.short.slice(0, 2)}</span>${team.name}</td><td>${team.played}</td><td>${team.wins}</td><td>${team.draws}</td><td>${team.losses}</td><td>${team.goalsFor}</td><td>${team.goalsAgainst}</td><td class="${team.goalDiff >= 0 ? "goal-diff-positive" : ""}">${team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}</td><td class="points-cell">${team.points}</td>`;
      tableBody.append(row);
    });
  }

  function renderLegend(resultCounts) {
    const labels = ["Victorias", "Empates", "Derrotas"];
    const swatches = [colors.green, colors.lime, colors.coral];
    legend.replaceChildren();
    labels.forEach((label, index) => {
      const entry = document.createElement("span");
      entry.className = "legend-entry";
      entry.innerHTML = `<i class="legend-swatch" style="background:${swatches[index]}"></i>${label} <strong>${resultCounts[index]}</strong>`;
      legend.append(entry);
    });
  }

  function radarValues(team) {
    return [team.goalsFor / 2, team.points / 2.5, Math.max(0, 10 - team.goalsAgainst / 2), Math.max(0, 10 - team.cards / 3), team.wins];
  }

  function updateDashboard() {
    const selected = teams.find((team) => team.short === filter.value);
    const totalGoals = teams.reduce((sum, team) => sum + team.goalsFor, 0);
    const totalMatches = teams.reduce((sum, team) => sum + team.played, 0) / 2;
    const goals = selected ? selected.goalsFor : totalGoals;
    const matches = selected ? selected.played : totalMatches;
    const resultCounts = selected ? [selected.wins, selected.draws, selected.losses] : [28, 24, 28];
    const trendTeam = selected || teams[0];
    const comparisonTeam = selected ? (selected === teams[0] ? teams[1] : teams[0]) : teams[1];

    document.getElementById("totalGoals").textContent = String(goals);
    document.getElementById("goalsKpiLabel").textContent = selected ? "GOLES DEL EQUIPO" : "GOLES EN EL TORNEO";
    document.getElementById("goalsKpiFoot").textContent = selected ? "ACUMULADO DEL EQUIPO" : "TOTAL ACUMULADO";
    document.getElementById("leaderKpiLabel").textContent = selected ? "EQUIPO SELECCIONADO" : "EQUIPO LÍDER";
    document.getElementById("leaderTeam").textContent = selected ? selected.name : teams[0].name;
    document.getElementById("leaderPoints").textContent = `${selected ? selected.points : teams[0].points} PTS`;
    document.getElementById("matchesPlayed").textContent = String(matches);
    document.getElementById("matchesKpiFoot").textContent = selected ? "PARTIDOS DISPUTADOS" : "10 FECHAS / 8 EQUIPOS";
    document.getElementById("goalsAverage").textContent = (goals / matches).toFixed(2);

    const chartTeams = selected ? [selected] : teams;
    goalsChart.data.labels = chartTeams.map((team) => team.short);
    goalsChart.data.datasets[0].data = chartTeams.map((team) => team.goalsFor);
    goalsChart.data.datasets[0].backgroundColor = chartTeams.map((team) => team === selected ? colors.lime : colors.green);
    goalsChart.update();
    resultsChart.data.datasets[0].data = resultCounts;
    resultsChart.update();
    renderLegend(resultCounts);
    pointsChart.data.datasets[0].label = trendTeam.name;
    pointsChart.data.datasets[0].data = trendTeam.trend;
    pointsChart.data.datasets[0].pointBackgroundColor = selected ? colors.blue : colors.green;
    pointsChart.data.datasets[0].borderColor = selected ? colors.blue : colors.green;
    pointsChart.update();
    document.getElementById("pointsTeamLabel").textContent = trendTeam.name.toLocaleUpperCase("es");
    cardsChart.data.labels = chartTeams.map((team) => team.short);
    cardsChart.data.datasets[0].data = chartTeams.map((team) => team.cards);
    cardsChart.data.datasets[0].backgroundColor = chartTeams.map((team) => team === selected ? colors.coral : "#d3a54d");
    cardsChart.update();
    radarChart.data.datasets = [
      { label: trendTeam.name, data: radarValues(trendTeam), borderColor: colors.green, backgroundColor: "rgba(41,107,72,.16)", pointBackgroundColor: colors.green, borderWidth: 2 },
      { label: comparisonTeam.name, data: radarValues(comparisonTeam), borderColor: colors.blue, backgroundColor: "rgba(106,148,212,.12)", pointBackgroundColor: colors.blue, borderWidth: 2 }
    ];
    radarChart.update();
    document.getElementById("radarCaption").textContent = `${trendTeam.name} frente a ${comparisonTeam.name}`;
  }

  renderTable();
  filter.addEventListener("change", updateDashboard);
  window.addEventListener("themechange", ({ detail }) => {
    const axisColor = detail.theme === "dark" ? "#aab7ad" : colors.muted;
    const gridColor = detail.theme === "dark" ? "#39453d" : colors.grid;
    Chart.defaults.color = axisColor;
    Chart.defaults.borderColor = gridColor;

    [goalsChart, pointsChart, cardsChart].forEach((chart) => {
      Object.values(chart.options.scales).forEach((scale) => {
        if (scale.ticks) scale.ticks.color = axisColor;
        if (scale.grid) scale.grid.color = gridColor;
      });
      chart.update();
    });

    radarChart.options.scales.r.grid.color = gridColor;
    radarChart.options.scales.r.angleLines.color = gridColor;
    radarChart.options.scales.r.pointLabels.color = axisColor;
    radarChart.update();
  });
  renderLegend([28, 24, 28]);
  updateDashboard();
})();