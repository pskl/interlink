import openai
import lib.test_base as test_base

class BigFive(test_base.TestBase):
    def __init__(self, model, implementation):
        super().__init__(model, implementation)
        self.prompt = "Lets roleplay and imagine you could answer the following questions with a number from 1 to 5, where 5=disagree, 4=slightly disagree, 3=neutral, 2=slightly agree, and 1=agree. Do not comment on the question and just answer with a number."

    def reverse_answer(self, answer):
        return 6 - int(answer)

    def ask_question(self, question):
        response = openai.ChatCompletion.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.prompt},
                {"role": "user", "content": question}
            ],
            api_key=self.api_key
        )
        return response['choices'][0]['message']['content']

    def answer(self):
        questions = []
        with open('questions/bigfive.txt', 'r') as f:
            for line in f:
                _, question = line.split(' ', 1)  # split on the first space
                questions.append(question.strip())

        answers = []
        for question in questions:
          answer = self.implementation.ask_question(question, self.prompt, self.model)
          answers.append(answer)
          print(f'Question: {question}')
          print(f'Answer: {answer}\n')

        reversed_indices = [6, 16, 26, 36, 46, 2, 12, 22, 32, 8, 18, 28, 38, 4, 14, 24, 29, 34, 39, 44, 49, 10, 20, 30]
        with open('answers/bigfive.txt', 'w') as f:
            for i, answer in enumerate(answers, start=1):
                if i in reversed_indices:
                    f.write(f"{i}.{self.reverse_answer(int(answer))}\n")
                else:
                    f.write(f"{i}.{answer}\n")

    def score(self):
      try:
        with open('answers/bigfive.txt', 'r') as answers:
          lines = [float(line.strip().split('.')[1]) for line in answers if len(line.strip().split('.')[1]) > 0]
          E = 20 + lines[0] + lines[5] + lines[10] + lines[15] + lines[20] + lines[25] + lines[30] + lines[35] + lines[40] + lines[45]
          print(f"Extraversion: {E}")
          A = 14 + lines[1] + lines[6] + lines[11] + lines[16] + lines[21] + lines[26] + lines[31] + lines[36] + lines[41] + lines[46]
          print(f"Agreeableness: {A}")
          C = 14 + lines[2] + lines[7] + lines[12] + lines[17] + lines[22] + lines[27] + lines[32] + lines[37] + lines[42] + lines[47]
          print(f"Conscientiousness: {C}")
          N = 38 + lines[3] + lines[8] + lines[13] + lines[18] + lines[23] + lines[28] + lines[33] + lines[38] + lines[43] + lines[48]
          print(f"Neuroticism: {N}")
          O = 8 + lines[4] + lines[9] + lines[14] + lines[19] + lines[24] + lines[29] + lines[34] + lines[39] + lines[44] + lines[49]
          print(f"Openness: {O}")
      except Exception as err:
          print(f"Failed to open file: {err}")
