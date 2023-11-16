import json

class TestBase():
  def __init__(self, model, implementation, prompt, samples) -> None:
    self.model = model
    self.implementation = implementation
    self.prompt = prompt
    self.samples = samples

  # Save test run to json file so that it can be replayed without triggering HTTP requests
  def serialize(self, questions, answers):
      id = self.test_id()
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
