@echo off
setlocal enabledelayedexpansion

call authenticationInfo.cmd

::set mainFolder=C:\Users\JeffB\Desktop\AllscriptsAutomater
set mainFolder=C:\Users\MRMDInc\Desktop\AllscriptsAutomater

set patientCSV=%mainFolder%\PatientDocs\patients.csv

set toProcessFolder=%mainFolder%\PatientDocs\toProcess
set noMatchFolder=%mainFolder%\PatientDocs\noMatch
set multipleMatchFolder=%mainFolder%\PatientDocs\multipleMatch
set uploadedFolder=%mainFolder%\PatientDocs\uploaded

echo.
echo Processing files in %toProcessFolder%
echo.

set doUpload=false

cscript processFiles.js %username% %password% %patientCSV% %toProcessFolder% %noMatchFolder% %multipleMatchFolder% %uploadedFolder% %doUpload%
