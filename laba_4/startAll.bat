@echo off

cd bat

for %%f in (*.bat) do (
	start ./ClientT.exe
)