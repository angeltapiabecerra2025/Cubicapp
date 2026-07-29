$content = Get-Content 'index.html' -Raw
$start = $content.IndexOf('return (', $content.IndexOf('const key = `_`;'))
$end = $content.IndexOf('})()}', $start)
$block = $content.Substring($start, $end - $start)
$open = ([regex]::Matches($block, '<div\b')).Count
$close = ([regex]::Matches($block, '</div')).Count
Write-Output "Open: $open, Close: $close"
