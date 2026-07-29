$content = Get-Content index.html -Raw
$components = $content -split 'const [A-Za-z0-9]+ = \('
$openRegex = [regex]::new('<div\b[^>]*>')
$closeRegex = [regex]::new('</div\s*>')

$i = 0
foreach ($comp in $components) {
    $opens = $openRegex.Matches($comp).Count
    $closes = $closeRegex.Matches($comp).Count
    if ($opens -ne $closes) {
        $preview = $comp.Substring(0, [math]::Min($comp.Length, 100))
        Write-Output "Component $i mismatch -> Open: $opens, Close: $closes. Preview: $preview"
    }
    $i++
}
