@echo off

git add .

set /p mensagem="Mensagem do commit: "

git commit -m "%mensagem%"

git push

gh pr create --base development --fill

pause