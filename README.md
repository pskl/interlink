# Interlink

Interlink is a CLI tool for psychometric benchmarking of LLMs. It submits any large language model to a series of questions, processes the scores and outputs the final result directly to terminal.

## Install dependencies

`pip install -r requirements.txt`

## Run it

Example:

`python main.py --model gpt-4 --test bigfive`

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

System prompt: `"Lets roleplay and imagine you could answer the following questions with a number from 0 to 3 where 0='Very False or Often False', 1='Sometimes or Somewhat False', 2='Sometimes or Somewhat True', 3='Very True or Often True'. Do not comment on the question and just answer with a number please."`

| Domain         | gpt-3.5-turbo |gpt-4|llama2-uncensored|llama2|mistral|pskl|
|----------------|-------|---|--|--|--|--|
| Antagonism     | 1.41  |x|0.16|x|0.79|x|
| Detachment     | 1.51  |x|0.42|x|1.09|x|
| Disinhibition  | 1.49  |x|0.31|x|1.01|x|
| Negative Affect| 1.72  |x|0.2|x|1.18|x|
| Psychoticism   | 1.6   |x|0.03|x|1.08|x|

## BigFive sample results

System prompt: `"Lets roleplay and imagine you could answer the following questions with a number from 1 to 5, where 5=disagree, 4=slightly disagree, 3=neutral, 2=slightly agree, and 1=agree. Do not comment on the question and just answer with a number."`

| Trait            | gpt-3.5-turbo |gpt-4|llama2-uncensored|llama2|mistral|pskl|
|------------------|-------|--|--|--|--|--|
| Extraversion     | 50.0  |50.0|47.0|x|48.0|x|
| Agreeableness    | 44.0  |34.0|36.0|x|43.0|x|
| Conscientiousness| 45.0  |33.0|42.0|x|47.0|x|
| Neuroticism      | 68.0  |70.0|79.0|x|70.0|x|
| Openness         | 42.0  |28.0|37.0|x|39.0|x|
