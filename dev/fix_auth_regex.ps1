$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$content = [System.IO.File]::ReadAllText($path)

# Use Regex to handle varied line endings and potential spaces
# 1. Fix App duplication
$appPattern = '(?s)const App = \(\) => \{\s+const \[isAuthenticated, setIsAuthenticated\] = React\.useState\(false\);\s+const \[currentUser, setCurrentUser\] = React\.useState\(null\);\s+const App = \(\) => \{'
$appFixed = "        const App = () => {`r`n            const [isAuthenticated, setIsAuthenticated] = useState(false);`r`n            const [currentUser, setCurrentUser] = useState(null);"
$content = [regex]::Replace($content, $appPattern, $appFixed)

# 2. Add Login trigger to main return
$returnPattern = '(?s)return \(\s+<div class="flex min-h-screen">'
$returnFixed = "            if (!isAuthenticated) {`r`n                return <LoginPage onLogin={(user) => { `r`n                    setIsAuthenticated(true); `r`n                    setCurrentUser(user); `r`n                }} />;`r`n            }`r`n`r`n            return (`r`n                <div class=""flex min-h-screen"">"
$content = [regex]::Replace($content, $returnPattern, $returnFixed)

# 3. Remove from getWeightValue
$weightPattern = '(?s)if \(!isAuthenticated\) \{.*?setIsAuthenticated\(true\);.*?setCurrentUser\(user\);.*?\}\s+'
$content = [regex]::Replace($content, $weightPattern, "")

# 4. Final encoding fix for "Gestión"
$content = $content.Replace("GestiÃ³n", "Gestión")

[System.IO.File]::WriteAllText($path, $content)
Write-Output "Applied fixes with REGEX successfully."
