#!/bin/bash

# Check if a directory was provided as an argument
if [ $# -eq 0 ]; then
    # If no argument, use the current directory
    DIR="."
else
    # Use the provided directory
    DIR="$1"
fi

python3 -m http.server 8069 --directory "$DIR" > /dev/null 2>&1 &
sleep 1
chromium-browser --start-fullscreen \
                 --disable-session-crashed-bubble \
                 --disable-infobars \
                 --autoplay-policy=no-user-gesture-required \
                 --disable-features=PreloadMediaEngagementData,MediaEngagementBypassAutoplayPolicies \
                 "http://localhost:8069"
