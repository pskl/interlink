const folderFiles = {
  "interlink_mistral_big5": "test_8346320627440787020.json",
  "interlink_gpt-4_darktriad": "test_12232222970715529377.json",
}
var folderPath;

document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startContainer');
  Object.keys(folderFiles).forEach(folder => {
    const button = document.createElement('button');
    button.textContent = folder;
    button.addEventListener('click', () => loadFolder(folder, folderFiles[folder]));
    startButton.appendChild(button);
  });
});

const strokeWidth = 1.5
const strokeColor = 'black'
var svgContainer
var path
var yScale = d3.scaleLinear().range([4 * window.innerHeight / 100, 0])
var lineGenerator = d3.line().curve(d3.curveBasis)
  .x(function (d) { return d.x })
  .y(function (d) { return yScale(d.y) });

function loadFolder(folderName, fileName) {
    folderPath = `answers/${folderName}`;
    fetch(`${folderPath}/${fileName}`)
    .then(response => response.json())
    .then(data => {
      displayBanner(data);
      preloadImages(data.answers);
      svgContainer = d3.select('#intensityGraph').append('svg').attr('height', '100%').attr('width', '100%');
      path = svgContainer.append('path')
        .attr('d', lineGenerator([])) // Start with an empty data array
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeWidth)
        .attr('fill', 'none')
      drawGrid(svgContainer);
      displayChat(data.answers, data.score)
      document.getElementById('startContainer').remove()
    });
}

function displayBanner(data) {
  document.getElementById('testNameContent').textContent = `${data.test}`;
  document.getElementById('modelContent').textContent = `${data.model}`;
  document.getElementById('promptContent').textContent = `"${data.prompt}"`;
}

function preloadImages(answers) {
  const imageDisplay = document.getElementById('image-display');
  answers.forEach(item => {
    const img = document.createElement('img');
    img.src = `${folderPath}/images/question_${item.index}.jpg`;
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

function playAnswer(answerNumber) {
  const answerAudio = new Audio(`${folderPath}/speech/answer_${answerNumber}.mp3`);
  answerAudio.play().catch(console.error);
  return answerAudio;
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

function displayChat(answers, score) {
  const container = document.getElementById('chat-container');
  const images = document.getElementById('image-display').children;

  let i = 0;

  function nextQuestion() {
    if (i < answers.length) {
      displayQuestion(answers[i], container);
      playAudioForQuestion(answers[i].index)
        .onended = () => {
          scrollToBottom(container);
          displayAnswer(answers[i], container);
          playAnswer(answers[i].sample).onended = () => {
            const img = images[i];
            img.style.display = 'inline-block';
            updateIntensityGraph(answers[i], i, answers.length);
            i++;
            scrollImageIntoView(img);
            nextQuestion();
          };
        }
    } else {
      displayScore(score);
    }
  }

  nextQuestion();
}

function scrollImageIntoView(img) {
  setTimeout(() => {
    const container = document.getElementById('image-display');
    const scrollLeft = img.offsetLeft - container.offsetLeft;
    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  }, 50);
}

function displayScore(score) {
  const container = document.getElementById('chat-container');

  for (const [trait, value] of Object.entries(score)) {
    scoreText = `${trait}: ${value}\n`;
    const scoreDiv = document.createElement('div');
    scoreDiv.classList.add('question');
    scoreDiv.textContent = scoreText;
    container.appendChild(scoreDiv);
  }
}

function scrollToBottom(el) {
  const totalScrollDistance = el.scrollHeight - el.scrollTop;
  const scrollDuration = 1000;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const scrollStep = Math.min(progress / scrollDuration, 1) * totalScrollDistance;
    el.scrollTop += scrollStep;

    if (progress < scrollDuration) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}

function updateIntensityGraph(answer, index, totalAnswers) {
  const maxIntensity = 10;
  const widthIncrement = window.innerWidth / totalAnswers;
  let currentX = index * widthIncrement;
  const intensity = answer.sample;
  yScale.domain([0, maxIntensity]);

  var dataPoint = { "x": currentX, "y": intensity };
  var currentData = path.datum();

  if (!currentData) {
    currentData = [];
  }

  currentData.push(dataPoint);

  path.datum(currentData)
    .attr('d', lineGenerator);

  var totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(700)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);
}

function drawGrid(svgContainer) {
  var width = window.innerWidth;
  var height = 4 * window.innerHeight / 100;

  var numVerticalLines = window.innerWidth / 20;
  var numHorizontalLines = window.innerHeight / 300;

  for (let i = 0; i <= numHorizontalLines; i++) {
    svgContainer.append("line")
      .attr("x1", 0)
      .attr("y1", height / numHorizontalLines * i)
      .attr("x2", width)
      .attr("y2", height / numHorizontalLines * i)
      .attr("stroke", strokeColor)
      .attr("stroke-width", 0.2);
  }

  for (let i = 0; i <= numVerticalLines; i++) {
    svgContainer.append("line")
      .attr("x1", width / numVerticalLines * i)
      .attr("y1", 0)
      .attr("x2", width / numVerticalLines * i)
      .attr("y2", height)
      .attr("stroke", strokeColor)
      .attr("stroke-width", 0.2);
  }
}
