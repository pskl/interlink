class TestBase():
  def __init__(self, model, implementation, prompt) -> None:
    self.model = model
    self.implementation = implementation
    self.prompt = prompt