$ie = New-Object -ComObject InternetExplorer.Application
$ie.Visible = $false
$ie.Navigate("file:///c:/Users/atapiab/Desktop/APP%20CUBICACIONES/CUBICAPP/index.html")

while ($ie.Busy -or $ie.ReadyState -ne 4) {
    Start-Sleep -Milliseconds 100
}

# In Internet Explorer, we can get the document
$doc = $ie.Document
Write-Output $doc.body.outerHTML
$ie.Quit()
