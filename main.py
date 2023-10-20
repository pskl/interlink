from lib.pid5 import Pid5
from lib.bigfive import BigFive
import argparse

# Create the parser
parser = argparse.ArgumentParser(description='Process the model name.')
parser.add_argument('--model', type=str, default='gpt-3.5-turbo',
                    help='the model to use')

args = parser.parse_args()

valid_models = ["gpt-4", "gpt-3.5-turbo"]
if args.model not in valid_models:
    raise ValueError('Invalid model name')

test = Pid5(model=args.model)
test.answer()
test.score()
