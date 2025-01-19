@echo off

if "%~1"=="" (
	echo "First item empty"
	exit
)
if "%~2"=="" (
	echo "Second item empty"
	exit
)

start chrome %2

cd ../servers
node %1