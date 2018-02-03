@echo off

set username="jeff.paarsa"
set password="[INSERT PASSWORD HERE]"
set patientCSV="C:\\Users\\nrahn\\Desktop\\PatientDocs\\patients.csv"
set toProcessFolder=C:\Users\nrahn\Desktop\PatientDocs\toProcess\*.*

cscript getPatients.js %patientCSV%

echo.
echo Processing files in %toProcessFolder%
echo.

for %%f in (%toProcessFolder%) do (
	set fileName=%%~dpNxf
	echo Processing %fileName%

	set extension=%%~xf
	set ocrFilename=%%~dpNf.txt
	
	for /f "usebackq delims=" %%I in (`powershell "\"%extension%\".toLower()"`) do set "extension=%%~I"

	set TRUE=
	IF "%extension%"==".pdf" set TRUE=1
	IF "%extension%"==".bin" set TRUE=1
	IF "%extension%"==".jpg" set TRUE=1
	IF defined TRUE (
		echo "OCR'ing"
	    ocr.cmd %fileName% %ocrFilename%
	    cscript processFile.js %username% %password% %patientCSV% %ocrFilename%
	) ELSE (
		echo "Not OCR'ing"
	    cscript processFile.js %username% %password% %patientCSV% %fileName%
	)

)
