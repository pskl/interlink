import openai
import os
import time

class OpenaiImpl:
  def ask_question(self, question, prompt, model):
    for i in range(15):
        try:
            response = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY")).chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": question}
                ]
            )
            int_response = int(response.choices[0].message.content)
            return int_response
        except ValueError:
            time.sleep(1)
            print("Retrying the same question\n")
            continue
    else:
        raise ValueError("POST request is not returning integer response. Model is misbehaving, needs further inspection.")
