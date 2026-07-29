$content = Get-Content index.html -Raw
# Find all tags like <div ...> or </div>
# Excluding self-closing tags like <input ... />
$matches = [regex]::Matches($content, '<\/?([a-zA-Z0-9]+)[^>]*>')
$stack = @()

foreach ($m in $matches) {
    $tag = $m.Value
    if ($tag -match '/>$') {
        continue # self closing
    }
    
    $tagNameMatch = [regex]::Match($tag, '<\/?([a-zA-Z0-9]+)')
    $tagName = $tagNameMatch.Groups[1].Value.ToLower()
    
    # Ignore tags that don't need closing in standard HTML (but JSX requires closing them! Wait, JSX requires all tags to be closed)
    # Actually if it's <br> in JSX it must be <br />
    
    if ($tag -match '^</') {
        if ($stack.Count -gt 0 -and $stack[-1].Name -eq $tagName) {
            $stack = $stack[0..($stack.Count-2)]
        } else {
            # mismatch
            $last = if ($stack.Count -gt 0) { $stack[-1].Name } else { "EMPTY" }
            Write-Output "Mismatch! Trying to close </$tagName> but top of stack is $last"
        }
    } else {
        $stack += @{ Name = $tagName; Full = $tag }
    }
}

Write-Output "Remaining in stack: $($stack.Count)"
if ($stack.Count -lt 20) {
    $stack | ForEach-Object { Write-Output $_.Name }
}
