@echo off

call authenticationInfo.cmd

::set mainFolder=C:\Users\JeffB\Desktop\AllscriptsAutomater
set mainFolder=C:\Users\nrahn\Desktop\AllscriptsAutomater
set csvPath=%mainFolder%\PatientDocs\patients.csv
set csvOutPath=%mainFolder%\PatientDocs\patientsForWellness.csv

cscript getPatientsForWellness.js %csvPath% %csvOutPath% %username% %password%
