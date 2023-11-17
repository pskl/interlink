import lib.test_base as test_base

class Pid5(test_base.TestBase):
    ID = 'pid5'

    WORD_SCORES = {
        "Anhedonia": [1, 23, 26, 30, 124, 155, 157, 189],
        "Anxiousness": [79, 93, 95, 96, 109, 110, 130, 141, 174],
        "Attention Seeking": [14, 43, 74, 111, 113, 173, 191, 211],
        "Callousness": [11, 13, 19, 54, 72, 73, 90, 153, 166, 183, 198, 200, 207, 208],
        "Deceitfulness": [41, 53, 56, 76, 126, 134, 142, 206, 214, 218],
        "Depressivity": [27, 61, 66, 81, 86, 104, 119, 148, 151, 163, 168, 169, 178, 212],
        "Distractibility": [6, 29, 47, 68, 88, 118, 132, 144, 199],
        "Eccentricity": [5, 21, 24, 25, 33, 52, 55, 70, 71, 152, 172, 185, 205],
        "Emotional Lability": [18, 62, 102, 122, 138, 165, 181],
        "Grandiosity": [40, 65, 114, 179, 187, 197],
        "Hostility": [28, 32, 38, 85, 92, 116, 158, 170, 188, 216],
        "Impulsivity": [4, 16, 17, 22, 58, 204],
        "Intimacy Avoidance": [89, 97, 108, 120, 145, 203],
        "Irresponsibility": [31, 129, 156, 160, 171, 201, 210],
        "Manipulativeness": [107, 125, 162, 180, 219],
        "Perceptual Dysregulation": [36, 37, 42, 44, 59, 77, 83, 154, 192, 193, 213, 217],
        "Perseveration": [46, 51, 60, 78, 80, 100, 121, 128, 137],
        "Restricted Affectivity": [8, 45, 84, 91, 101, 167, 184],
        "Rigid Perfectionism": [34, 49, 105, 115, 123, 135, 140, 176, 196, 220],
        "Risk Taking": [3, 7, 35, 39, 48, 67, 69, 87, 98, 112, 159, 164, 195, 215],
        "Separation Insecurity": [12, 50, 57, 64, 127, 149, 175],
        "Submissiveness": [9, 15, 63, 202],
        "Suspiciousness": [2, 103, 117, 131, 133, 177, 190],
        "Unusual Beliefs & Experiences": [94, 99, 106, 139, 143, 150, 194, 209],
        "Withdrawal": [10, 20, 75, 82, 136, 146, 147, 161, 182, 186],
    }
    DOMAIN_SCORES = {
        "Negative Affect": ["Emotional Lability", "Anxiousness", "Separation Insecurity"],
        "Detachment": ["Withdrawal", "Anhedonia", "Intimacy Avoidance"],
        "Antagonism": ["Manipulativeness", "Deceitfulness", "Grandiosity"],
        "Disinhibition": ["Irresponsibility", "Impulsivity", "Distractibility"],
        "Psychoticism": ["Unusual Beliefs & Experiences", "Eccentricity", "Perceptual Dysregulation"],
    }

    REVERSED_INDICES = [7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, 215]

    def __init__(self, model, implementation, prompt, samples):
        super().__init__(model, implementation, prompt, samples)
        if self.prompt == None:
            self.prompt = "Lets roleplay and imagine you could answer the following questions with a number from 0 to 3 where 0='Very False or Often False', 1='Sometimes or Somewhat False', 2='Sometimes or Somewhat True', 3='Very True or Often True'. Do not comment on the question and just answer with a number please."

    # For items keyed negatively
    def reverse_answer(self, answer):
        return 3 - int(answer)

    def score(self, answers):
      average_scores = {}
      for word, indices in Pid5.WORD_SCORES.items():
          total = sum(answers[i - 1] for i in indices if i - 1 < len(answers))
          average_score = total / len(indices)
          average_scores[word] = average_score
          print(f"Facet score for {word} is {total}")
      for domain, components in sorted(Pid5.DOMAIN_SCORES.items(), key=lambda x: x[0]):
          total = sum(average_scores[component] for component in components)
          average = total / len(components)
          print(f"The domain score for {domain} is {round(average, 2)}")