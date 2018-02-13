@echo off

call authenticationInfo.cmd

:: Sets %mainFolder% variable
call globalVars.cmd

set patientCSV=%mainFolder%\PatientDocs\patients.csv

cscript getPatients.js "getPatients" %patientCSV% %username% %password%
