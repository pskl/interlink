import json
import requests

class OllamaImpl:
  def ask_question(self, question, prompt, model):
      url = "http://localhost:11434/api/generate"
      data = json.dumps({
          "model": model,
          "stream": False,
          "prompt": prompt + "\n" + question
      })
      response = requests.post(url, headers={"Content-Type": "application/json"}, data=data)
      response_dict = response.json()
      return response_dict['response']