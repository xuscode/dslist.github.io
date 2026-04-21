import pdfplumber
import os

pdf_dir = r'c:\Temp\WEB_TEST\data\CATIA_ROLES'

for filename in os.listdir(pdf_dir):
    if filename.endswith('.pdf'):
        filepath = os.path.join(pdf_dir, filename)
        with pdfplumber.open(filepath) as pdf:
            total_pages = len(pdf.pages)
            total_text = 0
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    total_text += len(text)
            print(f"{filename}: {total_pages}页, {total_text}字符")
