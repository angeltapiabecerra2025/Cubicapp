$content = Get-Content index.html -Raw
$matches = [regex]::Matches($content, '<input[^>]*?>')
foreach ($m in $matches) {
    if (-not $m.Value.EndsWith("/>")) {
        Write-Output "Unclosed input: $($m.Value)"
    }
}
