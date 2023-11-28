const folderPath = "answers/interlink_mistral_big5"
const strokeWidth = 1.5
const strokeColor = 'black'
var svgContainer
var path
var yScale = d3.scaleLinear().range([4 * window.innerHeight / 100, 0])
var lineGenerator = d3.line().curve(d3.curveBasis)
  .x(function (d) { return d.x })
  .y(function (d) { return yScale(d.y) });

document.getElementById('startButton').addEventListener('click', function () {
  fetch(`${folderPath}/test_2719711939644891597.json`)
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
      displayChat(data.answers)
      this.remove();
    });
});

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