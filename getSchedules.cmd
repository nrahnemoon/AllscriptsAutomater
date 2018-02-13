@echo off

call authenticationInfo.cmd

:: Sets %mainFolder% variable
call globalVars.cmd

set patientCSV=%mainFolder%\PatientDocs\patients.csv

set appointmentsCSV=%mainFolder%\PatientDocs\appointments.csv

set daysInFuture=3

cscript getSchedules.js "getSchedules" %username% %password% %patientCSV% %appointmentsCSV% %daysInFuture% %emailUsername% %emailPassword%
