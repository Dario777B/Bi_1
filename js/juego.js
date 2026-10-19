(() => {
  "use strict";

  const rooms = [
    {
      topic: "SALA DE SISTEMAS",
      greeting: "¡Grrr! La primera puerta está sellada.",
      question: "Para generar ventaja corporativa, ¿qué debo construir?",
      choices: ["Un Data Warehouse", "Un sistema de información", "Una base de datos plana"],
      answer: 1,
      hint: "Piensa en una solución que reúna personas, procesos, datos y tecnología para apoyar el trabajo.",
      success: "¡Exacto! Un sistema de información integra recursos para apoyar operaciones y crear valor."
    },
    {
      topic: "SALA DE DECISIONES",
      greeting: "¡He encontrado un patrón entre los cristales!",
      question: "Los datos muestran que cierto producto se vende más los viernes. ¿Qué hago?",
      choices: ["Ignorarlo: los datos deciden por sí solos", "Tomar una decisión basada en datos y contexto", "Borrar los datos para evitar sesgos"],
      answer: 1,
      hint: "La evidencia ayuda, pero también hay que considerar el contexto del negocio y el criterio humano.",
      success: "¡Buena elección! BI aporta evidencia para decidir; las personas la interpretan con contexto."
    },
    {
      topic: "SALA DE ETL",
      greeting: "¡Fuego! Encontré datos duplicados y fechas desordenadas.",
      question: "Necesito limpiar, validar y unificar esos datos. ¿En qué fase ETL estoy?",
      choices: ["Extracción", "Transformación", "Carga"],
      answer: 1,
      hint: "Es la etapa intermedia: prepara y mejora los datos antes de enviarlos al destino.",
      success: "¡Limpieza impecable! Transformar prepara los datos y verifica que tengan calidad."
    },
    {
      topic: "SALA DE HERRAMIENTAS BI",
      greeting: "¡Ya casi llegamos al tesoro del conocimiento!",
      question: "¿Qué herramienta puedo usar para visualizar datos y crear un dashboard interactivo?",
      choices: ["Power BI", "Un servidor FTP", "Un editor de texto sin gráficos"],
      answer: 0,
      hint: "Busca una plataforma de análisis que conecte datos y permita crear informes visuales.",
      success: "¡Sí! Power BI convierte los datos en visualizaciones para explorar y comunicar hallazgos."
    }
  ];

  const elements = {
    roomLabel: document.getElementById("roomLabel"),
    roomTopic: document.getElementById("roomTopic"),
    greeting: document.getElementById("dragonGreeting"),
    roomQuestion: document.getElementById("roomQuestion"),
    choiceList: document.getElementById("choiceList"),
    answerHint: document.getElementById("answerHint"),
    feedback: document.getElementById("gameFeedback"),
    continueButton: document.getElementById("continueButton"),
    xpValue: document.getElementById("xpValue"),
    finalXp: document.getElementById("finalXp"),
    progress: document.querySelector(".game-progress"),
    progressBar: document.getElementById("gameProgressBar"),
    dragonScene: document.getElementById("dragonScene"),
    gameRoom: document.getElementById("gameRoom"),
    victoryScreen: document.getElementById("victoryScreen"),
    restartButton: document.getElementById("restartGame"),
    roomMarkers: [...document.querySelectorAll("[data-room-marker]")]
  };

  let currentRoom = 0;
  let experience = 0;
  let answered = false;

  function updateProgress(completedRooms) {
    elements.progressBar.style.width = `${(completedRooms / rooms.length) * 100}%`;
    elements.progress.setAttribute("aria-valuenow", String(completedRooms));
    elements.roomMarkers.forEach((marker, index) => {
      marker.classList.toggle("is-current", index === currentRoom && completedRooms < rooms.length);
      marker.classList.toggle("is-complete", index < completedRooms);
    });
  }

  function renderRoom() {
    const room = rooms[currentRoom];
    answered = false;
    elements.roomLabel.textContent = `SALA ${currentRoom + 1} DE ${rooms.length}`;
    elements.roomTopic.textContent = room.topic;
    elements.greeting.textContent = room.greeting;
    elements.roomQuestion.textContent = room.question;
    elements.answerHint.hidden = true;
    elements.feedback.hidden = true;
    elements.feedback.classList.remove("is-incorrect");
    elements.continueButton.hidden = true;
    elements.dragonScene.dataset.mood = "happy";
    elements.dragonScene.classList.remove("is-correct");
    elements.choiceList.replaceChildren();

    room.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.innerHTML = `<span class="choice-key">${String.fromCharCode(65 + index)}</span><span>${choice}</span>`;
      button.addEventListener("click", () => chooseAnswer(index));
      elements.choiceList.append(button);
    });
    updateProgress(currentRoom);
  }

  function chooseAnswer(selectedIndex) {
    if (answered) return;
    const room = rooms[currentRoom];
    const isCorrect = selectedIndex === room.answer;
    const choices = [...elements.choiceList.querySelectorAll(".choice-button")];

    if (!isCorrect) {
      elements.dragonScene.dataset.mood = "sad";
      elements.feedback.textContent = "¡Uy! Esa respuesta no abre la puerta. Prueba otra vez.";
      elements.feedback.classList.add("is-incorrect");
      elements.feedback.hidden = false;
      elements.answerHint.textContent = `Pista de Briz: ${room.hint}`;
      elements.answerHint.hidden = false;
      choices[selectedIndex].classList.add("is-wrong");
      choices[selectedIndex].disabled = true;
      return;
    }

    // Una respuesta correcta otorga XP una sola vez y desbloquea el avance.
    answered = true;
    experience += 25;
    elements.xpValue.textContent = String(experience);
    elements.dragonScene.dataset.mood = currentRoom === rooms.length - 1 ? "celebrate" : "happy";
    elements.dragonScene.classList.add("is-correct");
    choices.forEach((button, index) => {
      button.disabled = true;
      if (index === room.answer) button.classList.add("is-correct");
    });
    elements.feedback.textContent = room.success;
    elements.feedback.classList.remove("is-incorrect");
    elements.feedback.hidden = false;
    elements.answerHint.hidden = true;
    elements.continueButton.textContent = currentRoom === rooms.length - 1 ? "Reclamar el tesoro" : "Entrar a la siguiente sala";
    elements.continueButton.hidden = false;
    updateProgress(currentRoom + 1);
  }

  function advanceRoom() {
    if (currentRoom === rooms.length - 1) {
      elements.gameRoom.hidden = true;
      elements.victoryScreen.hidden = false;
      elements.finalXp.textContent = String(experience);
      elements.roomLabel.textContent = "MISIÓN COMPLETADA";
      elements.roomMarkers.forEach((marker) => marker.classList.add("is-complete"));
      return;
    }
    currentRoom += 1;
    renderRoom();
  }

  function restartGame() {
    currentRoom = 0;
    experience = 0;
    elements.xpValue.textContent = "0";
    elements.gameRoom.hidden = false;
    elements.victoryScreen.hidden = true;
    renderRoom();
  }

  elements.continueButton.addEventListener("click", advanceRoom);
  elements.restartButton.addEventListener("click", restartGame);
  renderRoom();
})();
