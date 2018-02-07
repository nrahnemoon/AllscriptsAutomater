Installation

1. Download and install tesseract (OCR) from https://github.com/UB-Mannheim/tesseract/wiki
2. Add tessearct to environment variables path
	2a. From the Windows search, search for "environment variables"
	2b. Click "edit the system environment variables"
	2c. At the bottom of the dialog click "Environment Variables..."
	2d. On the bottom half, there's the System variables", click the line "Path" and click "Edit..." (make sure it's the top Edit... button not the bottom one)
	2e. On the new dialog, click "New"
	2f. Add the path to the tesseract.exe directory; i.e., "C:\Program Files (x86)\Tesseract-OCR"
	2e. Click "OK", Click "OK", Click "OK"
3. Download and install imagemagick from https://www.imagemagick.org/script/download.php#windows
	3a. Make sure "Add to system path" is checked during install
	3b. Make sure "Install legacy utilities" is checked during installation
4. Download and install ghostscript from https://www.ghostscript.com/download/gsdnld.html (it's the Ghostscript AGPL License for x64)


To Run:

1. Make sure the patients.csv file is not open.  If it is, the program won't be able to read it.

