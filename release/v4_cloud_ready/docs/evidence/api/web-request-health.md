 Invoke-WebRequest http://localhost:8000/health                                                    
                                                                                                                                                                                                                           
Security Warning: Script Execution Risk                                                                                                                                                                                    
Invoke-WebRequest parses the content of the web page. Script code in the web page might be run when the page is parsed.                                                                                                    
      RECOMMENDED ACTION:
      Use the -UseBasicParsing switch to avoid script code execution.

      Do you want to continue?
    
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"): y


StatusCode        : 200
StatusDescription : OK
Content           : {"status":"healthy","version":"1.9"}
RawContent        : HTTP/1.1 200 OK
                    Content-Length: 36
                    Content-Type: application/json
                    Date: Wed, 17 Jun 2026 22:33:40 GMT
                    Server: uvicorn
                    
                    {"status":"healthy","version":"1.9"}
Forms             : {}
Headers           : {[Content-Length, 36], [Content-Type, application/json], [Date, Wed, 17 Jun 2026 22:33:40 GMT], [Server, uvicorn]}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 36
