@echo off
setlocal enabledelayedexpansion

set username="jeff.paarsa"
set password="INSERT_PASSWORD_HERE"
::set mainFolder=C:\Users\JeffB\Desktop\AllscriptsAutomater
set mainFolder=C:\Users\nrahn\Desktop\AllscriptsAutomater
set patientCSV=%mainFolder%\PatientDocs\patients.csv
set toProcessFolder=%mainFolder%\PatientDocs\toProcess
set noMatchFolder=%mainFolder%\PatientDocs\noMatch
set multipleMatchFolder=%mainFolder%\PatientDocs\multipleMatch
set uploadedFolder=%mainFolder%\PatientDocs\uploaded

echo.
echo Processing files in %toProcessFolder%
echo.

cscript processFiles.js %username% %password% %patientCSV% %toProcessFolder% %noMatchFolder% %multipleMatchFolder% %uploadedFolder%
