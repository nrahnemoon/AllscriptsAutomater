@echo off

set patientCSV="C:\\Users\\nrahn\\Desktop\\PatientDocs\\patients.csv"
set fileName="C:\\Users\\nrahn\\Desktop\\PatientDocs\\3166\\10966501-CA.pdf"

cscript getPatients.js %patientCSV%

for /f "delims=" %%a  in ("%fileName%") do set "Extension=%%~xa"
for /f "delims=" %%a  in ("%fileName%") do set "ocrFilename=%%~dpNa.txt"

for /f "usebackq delims=" %%I in (`powershell "\"%Extension%\".toLower()"`) do set "Extension=%%~I"

set TRUE=
IF "%Extension%"==".pdf" set TRUE=1
IF "%Extension%"==".bin" set TRUE=1
IF "%Extension%"==".jpg" set TRUE=1
IF defined TRUE (
	echo "OCR'ing"
    ocr.cmd %fileName% %ocrFilename%
    cscript fuzzySearch.js %patientCSV% %ocrFilename%
) ELSE (
	echo "Not OCR'ing"
    cscript fuzzySearch.js %patientCSV% %fileName%
)
