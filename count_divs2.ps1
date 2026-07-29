$content = Get-Content index.html -Raw
$openRegex = [regex]::new('<div\b[^>]*>')
$closeRegex = [regex]::new('</div\s*>')

$opens = $openRegex.Matches($content)
$closes = $closeRegex.Matches($content)

Write-Output "Total Opens: $($opens.Count)"
Write-Output "Total Closes: $($closes.Count)"
