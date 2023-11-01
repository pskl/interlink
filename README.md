# Interlink

Interlink is a psychometrics benchmark for LLMs. It submits any model to a series of questions, processes the scores and outputs the final result directly to terminal.

Models supported:
- [x] gpt-3.5-turbo
- [x] gpt-4

Tests supported:
- [x] [PID-5](https://www.psychiatry.org/File%20Library/Psychiatrists/Practice/DSM/APA_DSM5_The-Personality-Inventory-For-DSM-5-Full-Version-Adult.pdf)
- [x] [Big Five](https://openpsychometrics.org/tests/IPIP-BFFM/)

## PID-5 sample results

| Domain         | gpt-3.5-turbo |gpt-4|llama2-uncensored|llama2|mistral|
|----------------|-------|---|--|--|--|
| Antagonism     | 1.41  |x|2.36|x|x|
| Detachment     | 1.51  |x|2.86|x|x|
| Disinhibition  | 1.49  |x|1.79|x|x|
| Negative Affect| 1.72  |x|2.15|x|x|
| Psychoticism   | 1.6   |x|1.75|x|x|

## BigFive sample results

| Trait            | gpt-3.5-turbo |gpt-4|llama2-uncensored|llama2|mistral|
|------------------|-------|--|--|--|--|
| Extraversion     | 50.0  |50.0|47.0|x|x|
| Agreeableness    | 44.0  |34.0|36.0|x|x|
| Conscientiousness| 45.0  |33.0|42.0|x|x|
| Neuroticism      | 68.0  |70.0|79.0|x|x|
| Openness         | 42.0  |28.0|37.0|x|x|
