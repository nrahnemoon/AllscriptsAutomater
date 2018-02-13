@echo off

call authenticationInfo.cmd
set patientID=3166

echo Getting document for %patientID%

:: Sets %mainFolder% variable
call globalVars.cmd

set patientDocsFolder=%mainFolder%\PatientDocs

cscript getDocuments.js %patientID% %patientDocsFolder% %username% %password%
