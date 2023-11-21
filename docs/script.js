const folderPath = "answers/interlink_mistral_big5"

document.addEventListener('DOMContentLoaded', function () {
  fetch(`${folderPath}/test_9832989361105039657.json`)
    .then(response => response.json())
    .then(data => {
      displayBanner(data);
      displayChat(data.answers);
      preloadImages(data.answers);
    });
});

function displayBanner(data) {
  document.getElementById('testName').textContent = `${data.test}`;
  document.getElementById('model').textContent = `${data.model}`;
  document.getElementById('prompt').textContent = `${data.prompt}`;
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

function displayChat(answers) {
  const container = document.getElementById('chat-container');
  const images = document.getElementById('image-display').children;
  let delay = 0;

  answers.forEach((item, index) => {
    // Display question
    setTimeout(() => {
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('question');
      questionDiv.textContent = item.question;
      container.appendChild(questionDiv);

      container.scrollTop = container.scrollHeight;
    }, delay);

    delay += 1000; // delay for question to answer transition

    setTimeout(() => {
      const answerDiv = document.createElement('div');
      answerDiv.classList.add('answer');
      answerDiv.textContent = item.sample;
      container.appendChild(answerDiv);

      container.scrollTop = container.scrollHeight;
      const img = images[index];
      img.style.display = 'inline-block';
      img.scrollIntoView({ behavior: 'smooth', inline: 'start' });

    }, delay);

    delay += 1000; // delay for answer to next question transition
  });

}
