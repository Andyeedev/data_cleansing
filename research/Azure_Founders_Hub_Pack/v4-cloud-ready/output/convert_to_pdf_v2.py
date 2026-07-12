#!/usr/bin/env python3
"""Convert Word document to PDF - Fresh instance approach."""

import os
import sys
import time
import subprocess

def convert_docx_to_pdf(docx_path, pdf_path):
    """Convert DOCX to PDF using Microsoft Word."""
    
    docx_path = os.path.abspath(docx_path)
    pdf_path = os.path.abspath(pdf_path)
    
    print(f'Input:  {docx_path}')
    print(f'Output: {pdf_path}')
    
    if not os.path.exists(docx_path):
        print(f'Error: DOCX file not found')
        return False
    
    # Kill any existing Word processes
    subprocess.run(['taskkill', '/f', '/im', 'WINWORD.EXE'], 
                   capture_output=True)
    time.sleep(2)
    
    try:
        import win32com.client
        
        # Create fresh Word instance
        word = win32com.client.Dispatch('Word.Application')
        word.Visible = False
        word.DisplayAlerts = False  # suppress alerts
        
        print('Word instance created')
        
        # Open document
        doc = word.Documents.Open(docx_path, ReadOnly=True)
        print('Document opened')
        
        # Small delay
        time.sleep(1)
        
        # Save as PDF (wdFormatPDF = 17)
        doc.SaveAs2(pdf_path, FileFormat=17)
        print('Saved as PDF')
        
        # Close document
        doc.Close(SaveChanges=False)
        
        # Quit Word
        word.Quit()
        
        # Check if PDF was created
        time.sleep(1)
        if os.path.exists(pdf_path):
            pdf_size = os.path.getsize(pdf_path)
            print(f'Success! PDF created: {pdf_size/1024:.0f} KB')
            return True
        else:
            print('PDF file not found after conversion')
            return False
            
    except Exception as e:
        print(f'Error: {e}')
        try:
            word.Quit()
        except:
            pass
        return False

if __name__ == '__main__':
    docx_file = r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\research\Azure_Founders_Hub_Pack\v4-cloud-ready\output\v2-business-word\FS_Migration_Validation_Engine_Founders_Hub_Master.docx'
    pdf_file = r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\research\Azure_Founders_Hub_Pack\v4-cloud-ready\output\v2-business-word\FS_Migration_Validation_Engine_Founders_Hub_Master.pdf'
    
    success = convert_docx_to_pdf(docx_file, pdf_file)
    sys.exit(0 if success else 1)
