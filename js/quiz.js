(() => {
  "use strict";

  const questions = [
    { category: "DECISIONES", question: "¿Qué distingue principalmente una decisión basada en datos?", answers: ["Se apoya en evidencia medible y contexto", "Elimina por completo el criterio humano", "Siempre se toma más rápido"], correct: 0, explanation: "La evidencia informa la decisión, pero el contexto y el criterio humano siguen siendo esenciales." },
    { category: "DECISIONES", question: "¿Cuál de estas decisiones es estratégica?", answers: ["Reponer un producto esta tarde", "Elegir un nuevo mercado para expandirse", "Ajustar el turno de mañana"], correct: 1, explanation: "La expansión a un mercado nuevo define el rumbo y compromete recursos a largo plazo." },
    { category: "DECISIONES", question: "Una jefa de tienda cambia la distribución del personal para la próxima semana. ¿Qué tipo de decisión es?", answers: ["Estratégica", "Táctica", "Operativa"], correct: 1, explanation: "Organizar un plan de área a corto o mediano plazo corresponde al nivel táctico." },
    { category: "ETL", question: "En un proceso ETL, ¿qué ocurre durante la extracción?", answers: ["Se publican los datos en un dashboard", "Se obtienen datos desde sus fuentes", "Se eliminan todos los registros antiguos"], correct: 1, explanation: "Extract conecta con las fuentes y obtiene los datos que se necesitan procesar." },
    { category: "ETL", question: "¿Cuál es un ejemplo de transformación de datos?", answers: ["Unificar formatos de fecha y eliminar duplicados", "Descargar una tabla del CRM", "Abrir un informe de ventas"], correct: 0, explanation: "La transformación limpia, combina y valida los datos antes de cargarlos." },
    { category: "ETL", question: "¿Cuál es el propósito de la fase Load?", answers: ["Definir la pregunta de negocio", "Cargar los datos preparados en su destino", "Recolectar datos sin procesar"], correct: 1, explanation: "Load publica el conjunto transformado en un almacén o destino analítico." },
    { category: "BI", question: "¿Cuál es una buena práctica para un flujo ETL confiable?", answers: ["Sobrescribir el origen para ahorrar espacio", "Documentar reglas y monitorear la calidad", "Omitir validaciones si el archivo parece correcto"], correct: 1, explanation: "Documentación y controles de calidad hacen el flujo auditable y ayudan a detectar fallos." },
    { category: "BI", question: "¿Qué herramienta se usa comúnmente para crear visualizaciones interactivas?", answers: ["Power BI", "Apache Airflow", "Un servidor FTP"], correct: 0, explanation: "Power BI es una plataforma de análisis y visualización; Airflow orquesta flujos de trabajo." },
    { category: "BI", question: "Una tienda estima cuánto stock necesitará el próximo mes. ¿Qué aplicación de BI describe mejor este caso?", answers: ["Previsión de demanda", "Carga de datos", "Diseño de marca"], correct: 0, explanation: "La previsión analiza ventas y patrones para anticipar demanda y planificar inventario." },
    { category: "DECISIONES", question: "¿Por qué un gráfico correcto no garantiza una buena decisión?", answers: ["Los gráficos nunca representan datos reales", "La calidad, el contexto y la interpretación también importan", "Solo los modelos complejos sirven para decidir"], correct: 1, explanation: "Una visualización necesita datos confiables, contexto y una pregunta de negocio bien planteada." }
  ];

  const elements = {
    start: document.getElementById("quizStart"), play: document.getElementById("quizPlay"), result: document.getElementById("quizResult"),
    startButton: document.getElementById("startQuiz"), restartButton: document.getElementById("restartQuiz"),
    number: document.getElementById("questionNumber"), category: document.getElementById("questionCategory"), question: document.getElementById("questionText"),
    answers: document.getElementById("answerList"), feedback: document.getElementById("quizFeedback"), nextButton: document.getElementById("nextQuestion"),
    score: document.getElementById("scoreValue"), streak: document.getElementById("streakValue"), progress: document.getElementById("progressBar"),
    progressTrack: document.querySelector(".quiz-progress"), finalScore: document.getElementById("finalScore"), resultMedal: document.getElementById("resultMedal"),
    resultTitle: document.getElementById("resultTitle"), resultMessage: document.getElementById("resultMessage"), correct: document.getElementById("correctAnswers"), bestStreak: document.getElementById("bestStreak")
  };

  let currentIndex = 0;
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  let correctCount = 0;
  let answered = false;

  function startQuiz() {
    currentIndex = 0;
    score = 0;
    streak = 0;
    bestStreak = 0;
    correctCount = 0;
    elements.start.hidden = true;
    elements.result.hidden = true;
    elements.play.hidden = false;
    renderQuestion();
  }

  function renderQuestion() {
    const item = questions[currentIndex];
    answered = false;
    elements.number.textContent = String(currentIndex + 1).padStart(2, "0");
    elements.category.textContent = item.category;
    elements.question.textContent = item.question;
    elements.score.textContent = String(score);
    elements.streak.textContent = String(streak);
    elements.progress.style.width = `${(currentIndex / questions.length) * 100}%`;
    elements.progressTrack.setAttribute("aria-valuenow", String(currentIndex));
    elements.feedback.hidden = true;
    elements.feedback.classList.remove("feedback-incorrect");
    elements.nextButton.hidden = true;
    elements.answers.replaceChildren();

    item.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      button.innerHTML = `<span class="answer-key">${String.fromCharCode(65 + index)}</span><span>${answer}</span>`;
      button.addEventListener("click", () => selectAnswer(index));
      elements.answers.append(button);
    });
  }

  function selectAnswer(selectedIndex) {
    if (answered) return;
    answered = true;
    const item = questions[currentIndex];
    const isCorrect = selectedIndex === item.correct;
    const options = [...elements.answers.querySelectorAll(".answer-option")];
    options.forEach((option, index) => {
      option.disabled = true;
      if (index === item.correct) option.classList.add("is-correct");
      if (index === selectedIndex && !isCorrect) option.classList.add("is-incorrect");
    });

    if (isCorrect) {
      streak += 1;
      correctCount += 1;
      bestStreak = Math.max(bestStreak, streak);
      score += 10 + (streak > 1 ? 5 : 0);
      elements.feedback.textContent = `¡Correcto! ${item.explanation}${streak > 1 ? ` Racha de ${streak}: sumaste 5 puntos extra.` : ""}`;
    } else {
      streak = 0;
      elements.feedback.textContent = `No exactamente. ${item.explanation}`;
      elements.feedback.classList.add("feedback-incorrect");
    }

    elements.feedback.hidden = false;
    elements.score.textContent = String(score);
    elements.streak.textContent = String(streak);
    elements.nextButton.textContent = currentIndex === questions.length - 1 ? "Ver resultado" : "Siguiente pregunta";
    elements.nextButton.hidden = false;
  }

  function showResult() {
    elements.play.hidden = true;
    elements.result.hidden = false;
    elements.progress.style.width = "100%";
    elements.progressTrack.setAttribute("aria-valuenow", String(questions.length));
    elements.finalScore.textContent = String(score);
    elements.correct.textContent = `${correctCount} / ${questions.length}`;
    elements.bestStreak.textContent = String(bestStreak);

    let badge;
    if (score >= 120) badge = { name: "Platino", className: "medal-platinum", message: "Dominio sobresaliente: conectas los datos con decisiones de negocio." };
    else if (score >= 90) badge = { name: "Oro", className: "medal-gold", message: "Muy sólido. Ya tienes una gran base para pensar con datos." };
    else if (score >= 50) badge = { name: "Plata", className: "medal-silver", message: "Buen avance. Un poco más de práctica y afinas esos conceptos." };
    else badge = { name: "Bronce", className: "medal-bronze", message: "Cada respuesta suma experiencia. Vuelve a intentarlo y mejora tu racha." };

    elements.resultMedal.className = `result-medal ${badge.className}`;
    elements.resultTitle.textContent = `Insignia ${badge.name}`;
    elements.resultMessage.textContent = badge.message;
  }

  elements.startButton.addEventListener("click", startQuiz);
  elements.restartButton.addEventListener("click", startQuiz);
  elements.nextButton.addEventListener("click", () => {
    if (currentIndex === questions.length - 1) showResult();
    else {
      currentIndex += 1;
      renderQuestion();
    }
  });
})();