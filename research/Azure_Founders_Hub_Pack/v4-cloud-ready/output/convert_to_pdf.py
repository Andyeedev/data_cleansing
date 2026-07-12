#!/usr/bin/env python3
"""Convert Word document to PDF using win32com with error handling."""

import os
import sys
import time

def convert_docx_to_pdf(docx_path, pdf_path):
    """Convert DOCX to PDF using Microsoft Word COM automation."""
    
    docx_path = os.path.abspath(docx_path)
    pdf_path = os.path.abspath(pdf_path)
    
    print(f'Input:  {docx_path}')
    print(f'Output: {pdf_path}')
    
    if not os.path.exists(docx_path):
        print(f'Error: DOCX file not found: {docx_path}')
        return False
    
    try:
        import win32com.client
        from pywintypes import com_error
        
        # Try to get existing Word instance or create new one
        try:
            word = win32com.client.GetActiveObject('Word.Application')
            print('Using existing Word instance')
        except:
            word = win32com.client.Dispatch('Word.Application')
            print('Created new Word instance')
        
        word.Visible = False
        
        # Open document
        doc = word.Documents.Open(docx_path)
        print('Document opened')
        
        # Save as PDF (wdFormatPDF = 17)
        doc.SaveAs(pdf_path, FileFormat=17)
        print('Saved as PDF')
        
        # Close document
        doc.Close(SaveChanges=False)
        
        # Check if PDF was created
        if os.path.exists(pdf_path):
            pdf_size = os.path.getsize(pdf_path)
            print(f'Success! PDF created: {pdf_size/1024:.0f} KB')
            return True
        else:
            print('PDF file not found after conversion')
            return False
            
    except com_error as e:
        print(f'COM Error: {e}')
        print('Trying alternative method...')
        return False
    except Exception as e:
        print(f'Error: {e}')
        return False
    finally:
        try:
            word.Quit()
        except:
            pass

if __name__ == '__main__':
    docx_file = r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\research\Azure_Founders_Hub_Pack\v4-cloud-ready\output\v2-business-word\FS_Migration_Validation_Engine_Founders_Hub_Master.docx'
    pdf_file = r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\research\Azure_Founders_Hub_Pack\v4-cloud-ready\output\v2-business-word\FS_Migration_Validation_Engine_Founders_Hub_Master.pdf'
    
    success = convert_docx_to_pdf(docx_file, pdf_file)
    sys.exit(0 if success else 1)
