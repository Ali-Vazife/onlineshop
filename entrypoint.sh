#!/bin/sh
# This script checks if the container is started for the first time.

CONTAINER_FIRST_STARTUP="CONTAINER_FIRST_STARTUP"
if [ ! -e /$CONTAINER_FIRST_STARTUP ]; then
    touch /$CONTAINER_FIRST_STARTUP
    # place your script that you only want to run on first startup.
    node /usr/src/app/dev-data/mockData.js && npm start

else
    # script that should run the rest of the times (instances where you 
    # stop/restart containers).
    npm start
fi
