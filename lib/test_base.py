import json
import openai
import os

class TestBase():
  def __init__(self, model, implementation, prompt, samples) -> None:
    self.model = model
    self.implementation = implementation
    self.prompt = prompt
    self.samples = samples

  def answer(self):
    questions = []
    with open(f'questions/{self.__class__.ID}.txt', 'r') as f:
        for line in f:
            _, question = line.split(' ', 1)  # split on the first space
            questions.append(question.strip())
    answers = []
    for (i, question) in enumerate(questions, start=1):
        if self.samples is not None and i >= self.samples:
            break
        else:
          answer = self.implementation.ask_question(question, self.prompt, self.model)

          # self.generate_tts(question)

          if i in self.__class__.REVERSED_INDICES:
            answers.append(self.reverse_answer(int(answer)))
          else:
            answers.append(answer)

          print(f'Question {i}: {question}')
          print(f'Answer: {answer}\n')

    self.serialize(questions, answers)
    self.score(answers)

  # Save test run to json file so that it can be replayed without triggering HTTP requests
  def serialize(self, questions, answers):
      id = self.__class__.ID
      json_file = f'answers/interlink_{self.model}_{id}.json'
      result = {
          "model": self.model,
          "test": id,
          "prompt": self.prompt,
          "answers": []
      }
      for i, answer in enumerate(answers, start=1):
          result["answers"].append({
              "index": i,
              "question": questions[i-1],
              "sample": answer
          })
      try:
          with open(json_file, 'w') as file:
              json.dump(result, file, indent=4)
      except Exception as e:
          print("Error writing to file: ", e)

  def generate_tts(self, question):
    speech_file_path = f"speech/{question}.mp3"
    response = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY")).audio.speech.create(
      model="tts-1",
      voice="nova",
      input=question
    )
    response.stream_to_file(speech_file_path)