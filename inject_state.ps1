$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$lines = [System.IO.File]::ReadAllLines($path)
$newContent = New-Object System.Collections.Generic.List[string]

foreach($line in $lines) {
    $newContent.Add($line)
    if ($line -match "^\s+const App = \(\) => \{$") {
        # Check if already added to avoid duplicates if re-run
        # (Though we just did a git checkout, so it's clean)
        $newContent.Add("            const [isAuthenticated, setIsAuthenticated] = React.useState(false);")
        $newContent.Add("            const [currentUser, setCurrentUser] = React.useState(null);")
    }
}

[System.IO.File]::WriteAllLines($path, $newContent)
Write-Output "Injected state successfully."
