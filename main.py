from lib.pid5 import Pid5
from lib.bigfive import BigFive
import argparse
import random
import os

from lib.implementations import OllamaImpl
from lib.implementations import OpenaiImpl

parser = argparse.ArgumentParser(description='Process the model name.')
parser.add_argument('--model', type=str, default='gpt-3.5-turbo',
                    help='the model to use')

parser.add_argument('--test', type=str, default='pid5',
                    help='the test to use')

parser.add_argument('--prompt', type=str, default=None,
                    help='the prompt to use')

parser.add_argument('--image', type=bool, default=False,
                    help='whether to generate images for each items')

parser.add_argument('--tts', type=bool, default=False,
                    help='whether to generate tts samples for each items')

parser.add_argument('--samples', type=int, default=220,
                    help='max number of samples')

parser.add_argument('--seed', type=int, default=int.from_bytes(os.urandom(8), byteorder="big"))

args = parser.parse_args()

valid_api_models = ["gpt-4", "gpt-3.5-turbo"]

valid_local_models = [ "mistral", "llama2", "llama2-uncensored"]

if args.model not in valid_api_models + valid_local_models:
    raise ValueError('Invalid model name')

if args.model in valid_local_models:
    implementation = OllamaImpl()
else:
    implementation = OpenaiImpl()

TESTS = {
    Pid5.ID: Pid5,
    BigFive.ID: BigFive
}

test = TESTS[args.test](args, implementation).answer()