import json
import openai
import os
import random
import requests

class TestBase():
  def __init__(self, args, implementation) -> None:
    self.implementation = implementation
    self.model = args.model
    self.prompt = args.prompt
    self.samples = args.samples
    self.seed = args.seed
    self.prompt = args.prompt
    self.tts = args.tts
    self.image = args.image

    if self.prompt is None:
       self.prompt = self.__class__.DEFAULT_PROMPT

  def answer_folder_path(self):
     return f"answers/interlink_{self.model}_{self.__class__.ID}"

  def answer(self):
    questions = []
    with open(f'questions/{self.__class__.ID}.txt', 'r') as f:
        for line in f:
            _, question = line.split(' ', 1)  # split on the first space
            questions.append(question.strip())
    answers = []
    for (i, question) in enumerate(questions, start=1):
        if i >= self.samples:
            break
        else:
          answer = self.implementation.ask_question(question, self.prompt, self.model)

          if self.tts:
            self.generate_tts(question, i)

          if self.image:
            self.generate_image(question, answer, i)

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
      os.makedirs(self.answer_folder_path(), exist_ok=True)
      json_file = f'{self.answer_folder_path()}/test_{self.seed}.json'
      result = {
          "model": self.model,
          "test": self.__class__.ID,
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

  def generate_tts(self, question, index):
    speech_path = f"{self.answer_folder_path()}/speech/"
    os.makedirs(speech_path, exist_ok=True)
    speech_file_path = f"{speech_path}/question_{index}.mp3"
    if not os.path.exists(speech_file_path):
      response = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY")).audio.speech.create(
        model="tts-1",
        voice="nova",
        input=question
      )
      response.stream_to_file(speech_file_path)

  def generate_image(self, question, answer, index):
    images_path = f"{self.answer_folder_path()}/images"
    os.makedirs(images_path, exist_ok=True)
    image_file_path = f"{images_path}/question_{index}.png"
    if not os.path.exists(image_file_path):
      response = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY")).images.generate(
        model="dall-e-3",
        prompt=f"an illustration of the sentence in which the intensity of what is represented as integer is: {answer}. Here is the sentence: '{question}'. in style of a rorschach test, monochrome, abstract, no visible text, white background",
        size="1024x1024",
        quality="standard",
        n=1,
      )
      image_url = response.data[0].url
      image_response = requests.get(image_url)
      if image_response.status_code == 200:
          with open(image_file_path, 'wb') as file:
              file.write(image_response.content)
          print(f"Image saved as {image_file_path}")
      else:
          print(f"Failed to retrieve image. Status code: {image_response.status_code}")