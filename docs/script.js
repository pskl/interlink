const folderPath = "answers/interlink_mistral_big5"

document.getElementById('startButton').addEventListener('click', function() {
  fetch(`${folderPath}/test_9832989361105039657.json`)
  .then(response => response.json())
  .then(data => {
      displayBanner(data);
      preloadImages(data.answers);
      displayChat(data.answers);
      this.remove();
  });
});

function displayBanner(data) {
  document.getElementById('testName').textContent = `${data.test}`;
  document.getElementById('model').textContent = `${data.model}`;
  document.getElementById('prompt').textContent = `"${data.prompt}"`;
}

function preloadImages(answers) {
  const imageDisplay = document.getElementById('image-display');
  answers.forEach(item => {
    const img = document.createElement('img');
    img.src = `${folderPath}/images/question_${item.index}.png`;
    img.style.display = 'none';
    imageDisplay.appendChild(img);
  });
}

function playAudioForQuestion(index) {
  const audioPath = `${folderPath}/speech/question_${index}.mp3`;
  const audio = new Audio(audioPath);
  audio.play().catch(console.error);
  return audio;
}

function playBeep(answerNumber) {
  const beepAudio = new Audio('./answer.mp3');
  beepAudio.playbackRate = 1 / (answerNumber);  // smaller answerNumber will yield higher pitch
  beepAudio.play().catch(console.error);
  return beepAudio;
}


function displayQuestion(item, container) {
  const indexDiv = document.createElement('div');
  indexDiv.classList.add('question-index');
  indexDiv.textContent = `Q#${item.index}`;

  const questionDiv = document.createElement('div');
  questionDiv.classList.add('question');
  questionDiv.textContent = item.question;

  container.appendChild(indexDiv);
  container.appendChild(questionDiv);
}

function displayAnswer(item, container) {
  const answerDiv = document.createElement('div');
  answerDiv.classList.add('answer');
  answerDiv.textContent = item.sample;
  container.appendChild(answerDiv);
}

function displayChat(answers) {
  const container = document.getElementById('chat-container');
  const images = document.getElementById('image-display').children;

  let i = 0;

  function nextQuestion() {
    displayQuestion(answers[i], container);
    scrollToBottom(container);
    playAudioForQuestion(answers[i].index)
      .onended = () => {
      displayAnswer(answers[i], container);
      scrollToBottom(container);
      playBeep(parseFloat(answers[i].sample)).onended = () => {
        scrollToBottom(container);
        const img = images[i];
        img.style.display = 'inline-block';
        img.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        updateIntensityGraph(answers[i], i, answers.length);
        i++;
        if (i < answers.length) nextQuestion();
      };
    }
  }

  nextQuestion();
}

function scrollToBottom(el) {
  el.scrollTop = el.scrollHeight;
  // setTimeout(() => {
  //     el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  // }, 1000);
}

function updateIntensityGraph(answer, index, totalAnswers) {
  const canvas = document.getElementById('intensityGraph');
  const ctx = canvas.getContext('2d');

  if (index === 0) {
      canvas.width = window.innerWidth;
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
  }

  const maxIntensity = 10;
  const widthIncrement = canvas.width / totalAnswers;
  let currentX = index * widthIncrement;

  const intensity = answer.sample;
  const y = canvas.height - (intensity / maxIntensity) * canvas.height;

  if (index === 0) {
      ctx.moveTo(currentX, y);
  } else {
      ctx.lineTo(currentX, y);
      ctx.stroke();
  }
}
