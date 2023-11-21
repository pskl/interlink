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
  document.getElementById('testName').textContent = `protocol: ${data.test}`;
  document.getElementById('model').textContent = `model: ${data.model}`;
  document.getElementById('prompt').textContent = `prompt: ${data.prompt}`;
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
  audio.play().catch(e => {
      console.error("Audio playback failed:", e);
  });
  return audio;
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
  let delay = 0;

  answers.forEach((item, index) => {
      setTimeout(() => {
          const audio = playAudioForQuestion(item.index);
          displayQuestion(item, container);
          container.scrollTop = container.scrollHeight;

          audio.onended = () => {
              displayAnswer(item, container);
              container.scrollTop = container.scrollHeight;

              const img = images[index];
              img.style.display = 'inline-block';
              img.scrollIntoView({ behavior: 'smooth', inline: 'start' });
              updateIntensityGraph(item, index, answers.length);
          };
      }, delay);

      delay += 3500;
  });
}

function updateIntensityGraph(answer, index, totalAnswers) {
  const canvas = document.getElementById('intensityGraph');
  const ctx = canvas.getContext('2d');

  // Set the canvas width to fill the screen width
  if (index === 0) {
      canvas.width = window.innerWidth;
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
  }

  const maxIntensity = 10; // Assuming intensity ranges from 0 to 3
  const widthIncrement = canvas.width / totalAnswers;
  let currentX = index * widthIncrement;

  const intensity = answer.sample; // The intensity value
  const y = canvas.height - (intensity / maxIntensity) * canvas.height;

  if (index === 0) {
      ctx.moveTo(currentX, y);
  } else {
      ctx.lineTo(currentX, y);
      ctx.stroke();
  }
}
