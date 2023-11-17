import json
import requests
import time

class OllamaImpl:
  def ask_question(self, question, prompt, model):
      url = "http://localhost:11434/api/generate"
      data = json.dumps({
          "model": model,
          "stream": False,
          "prompt": prompt + "\n Here is the question, remember to reply with just a number as previously instructed: \n" + question
      })
      for i in range(15):
          try:
              response = requests.post(url, headers={"Content-Type": "application/json"}, data=data)
              response_dict = response.json()
              int_response = int(response_dict['response'])
              return int_response
          except ValueError:
              time.sleep(1)
              print("Retrying the same question\n")
              continue
          except KeyError:
              print("Response body does not contain 'response'")
              break
      else:
          raise ValueError("POST request is not returning integer response. Model is misbehaving, needs further inspection.")