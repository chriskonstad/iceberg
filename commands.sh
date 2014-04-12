#!/bin/bash

#Uptime in ms
cat /proc/uptime | awk '{ print $1 }'
