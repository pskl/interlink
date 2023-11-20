document.addEventListener('DOMContentLoaded', function() {
  fetch('answers/interlink_mistral_big5/test_7421833607082479695.json')
  .then(response => response.json())
  .then(data => {
      displayBanner(data);
      displayChat(data.answers);
  });
});

function displayBanner(data) {
  document.getElementById('testName').textContent = `${data.test}`;
  document.getElementById('model').textContent = `${data.model}`;
  document.getElementById('prompt').textContent = `${data.prompt}`;
}

function displayChat(answers) {
  const container = document.getElementById('chat-container');
  answers.forEach((item, index) => {
      setTimeout(() => {
          const questionDiv = document.createElement('div');
          questionDiv.classList.add('question');
          questionDiv.textContent = item.question;
          container.appendChild(questionDiv);

          const answerDiv = document.createElement('div');
          answerDiv.classList.add('answer');
          answerDiv.textContent = item.sample;
          container.appendChild(answerDiv);

          // Scroll to the latest message
          container.scrollTop = container.scrollHeight;
      }, index * 1000);
  });
}
