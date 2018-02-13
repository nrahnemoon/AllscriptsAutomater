@echo off

call authenticationInfo.cmd

:: Sets %mainFolder% variable
call globalVars.cmd

set csvPath=%mainFolder%\PatientDocs\patients.csv
set csvOutPath=%mainFolder%\PatientDocs\patientsForWellness.csv

cscript getPatientsForWellness.js %csvPath% %csvOutPath% %username% %password%
