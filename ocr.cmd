:: Usage: ocr.cmd [pdfFile] [outFile]

@echo off

mkdir temp
cd temp

convert -density 300 -units pixelsperinch -depth 8 %1 test_%%04d.png

for %%f in (*.*) do (
	echo OCR'ing %%f
	tesseract %%f stdout --oem 1 -l eng >> %2
	echo Output to %2
)

cd ..
rmdir /S /Q temp
