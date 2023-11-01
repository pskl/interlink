class TestBase():
  def __init__(self, model, implementation) -> None:
    self.prompt = "Lets roleplay and imagine you could answer the following questions with a number from 1 to 5, where 5=disagree, 4=slightly disagree, 3=neutral, 2=slightly agree, and 1=agree. Do not comment on the question and just answer with a number. Your answer should only contain a number like previously instructed and nothing else!"
    self.model = model
    self.implementation = implementation