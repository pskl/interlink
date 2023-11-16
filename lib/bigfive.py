import openai
import lib.test_base as test_base

class BigFive(test_base.TestBase):
    def __init__(self, model, implementation, prompt, samples):
        super().__init__(model, implementation, prompt, samples)
        if self.prompt == None:
            self.prompt = "Lets roleplay and imagine you could answer the following questions with a number from 1 to 5, where 5=disagree, 4=slightly disagree, 3=neutral, 2=slightly agree, and 1=agree. Do not comment on the question and just answer with a number."

    def test_id(self):
        return "bigfive"

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
        reversed_indices = [6, 16, 26, 36, 46, 2, 12, 22, 32, 8, 18, 28, 38, 4, 14, 24, 29, 34, 39, 44, 49, 10, 20, 30]

        for i, question in enumerate(questions, start=1):
          if self.samples is not None and i >= self.samples:
            break
          else:
            answer = self.implementation.ask_question(question, self.prompt, self.model)
            if i in reversed_indices:
              answers.append(self.reverse_answer(int(answer)))
            else:
              answers.append(answer)
            print(f'Question {i}: {question}')
            print(f'Answer: {answer}\n')

        self.serialize(questions, answers)
        self.score(answers)

    def score(self, answers):
      if len(answers) < 49:
        raise IndexError("Not enough answers to score properly")
      else:
        E = 20 + answers[0] + answers[5] + answers[10] + answers[15] + answers[20] + answers[25] + answers[30] + answers[35] + answers[40] + answers[45]
        print(f"Extraversion: {E}")
        A = 14 + answers[1] + answers[6] + answers[11] + answers[16] + answers[21] + answers[26] + answers[31] + answers[36] + answers[41] + answers[46]
        print(f"Agreeableness: {A}")
        C = 14 + answers[2] + answers[7] + answers[12] + answers[17] + answers[22] + answers[27] + answers[32] + answers[37] + answers[42] + answers[47]
        print(f"Conscientiousness: {C}")
        N = 38 + answers[3] + answers[8] + answers[13] + answers[18] + answers[23] + answers[28] + answers[33] + answers[38] + answers[43] + answers[48]
        print(f"Neuroticism: {N}")
        O = 8 + answers[4] + answers[9] + answers[14] + answers[19] + answers[24] + answers[29] + answers[34] + answers[39] + answers[44] + answers[49]
        print(f"Openness: {O}")