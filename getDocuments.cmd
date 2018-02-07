@echo off

call authenticationInfo.cmd
set patientID=3166

echo Getting document for %patientID%

set mainFolder=C:\Users\nrahn\Desktop\AllscriptsAutomater
set patientDocsFolder=%mainFolder%\PatientDocs

cscript getDocuments.js %patientID% %patientDocsFolder% %username% %password%
