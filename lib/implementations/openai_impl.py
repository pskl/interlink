import openai
import os

class OpenaiImpl:
  def ask_question(self, question, prompt, model):
      response = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY")).chat.completions.create(
          model=model,
          messages=[
              {"role": "system", "content": prompt},
              {"role": "user", "content": question}
          ]
      )
      return response.choices[0].message.content