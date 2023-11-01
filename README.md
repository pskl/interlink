# Interlink

Interlink is a CLI tool for psychometric benchmarking of LLMs. It submits any large language model to a series of questions, processes the scores and outputs the final result directly to terminal.

## Run it

Example:
```
python main.py --model gpt-4 --test bigfive
```

Models supported:
- [x] gpt-3.5-turbo
- [x] gpt-4
- [x] llama2-uncensored
- [x] llama2
- [x] mistral

Tests supported:
- [x] [PID-5](https://www.psychiatry.org/File%20Library/Psychiatrists/Practice/DSM/APA_DSM5_The-Personality-Inventory-For-DSM-5-Full-Version-Adult.pdf)
- [x] [Big Five](https://openpsychometrics.org/tests/IPIP-BFFM/)

## PID-5 sample results

| Domain         | gpt-3.5-turbo |gpt-4|llama2-uncensored|llama2|mistral|pskl|
|----------------|-------|---|--|--|--|--|
| Antagonism     | 1.41  |x|2.36|x|2.86|x|
| Detachment     | 1.51  |x|2.86|x|2.02|x|
| Disinhibition  | 1.49  |x|1.79|x|2.53|x|
| Negative Affect| 1.72  |x|2.15|x|2.58|x|
| Psychoticism   | 1.6   |x|1.75|x|2.52|x|

## BigFive sample results

| Trait            | gpt-3.5-turbo |gpt-4|llama2-uncensored|llama2|mistral|pskl|
|------------------|-------|--|--|--|--|--|
| Extraversion     | 50.0  |50.0|47.0|x|48.0|x|
| Agreeableness    | 44.0  |34.0|36.0|x|43.0|x|
| Conscientiousness| 45.0  |33.0|42.0|x|47.0|x|
| Neuroticism      | 68.0  |70.0|79.0|x|70.0|x|
| Openness         | 42.0  |28.0|37.0|x|39.0|x|
