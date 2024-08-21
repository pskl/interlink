#!/bin/bash

python3 -m http.server 8000 --directory "." & chromium-browser --start-fullscreen "http://localhost:8000"
