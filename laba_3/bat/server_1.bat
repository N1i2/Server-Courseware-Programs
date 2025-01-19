@echo off

start chrome http://localhost:5000

cd ../servers
node server_1.js

exit