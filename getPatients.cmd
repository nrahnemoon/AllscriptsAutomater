@echo off

call authenticationInfo.cmd

::set mainFolder=C:\Users\JeffB\Desktop\AllscriptsAutomater
set mainFolder=C:\Users\nrahn\Desktop\AllscriptsAutomater
set patientCSV=%mainFolder%\PatientDocs\patients.csv

cscript getPatients.js "getPatients" %patientCSV% %username% %password%
