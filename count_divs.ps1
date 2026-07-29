$content = Get-Content 'index.html' -Raw
$open = ([regex]::Matches($content, '<div\b')).Count
$close = ([regex]::Matches($content, '</div')).Count
Write-Output "index.html -> Open: $open, Close: $close"

$content2 = Get-Content 'vista_previa2.html' -Raw
$open2 = ([regex]::Matches($content2, '<div\b')).Count
$close2 = ([regex]::Matches($content2, '</div')).Count
Write-Output "vista_previa2.html -> Open: $open2, Close: $close2"
