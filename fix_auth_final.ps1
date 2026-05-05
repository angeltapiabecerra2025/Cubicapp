$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$content = [System.IO.File]::ReadAllText($path)

# 1. Fix App duplication and Auth state
$oldApp = "        const App = () => {`r`n            const [isAuthenticated, setIsAuthenticated] = React.useState(false);`r`n            const [currentUser, setCurrentUser] = React.useState(null);`r`n        const App = () => {"
$newApp = "        const App = () => {`r`n            const [isAuthenticated, setIsAuthenticated] = useState(false);`r`n            const [currentUser, setCurrentUser] = useState(null);"
if ($content.Contains($oldApp)) {
    $content = $content.Replace($oldApp, $newApp)
}

# 2. Add Login trigger to main return
$oldMainReturn = "            return (`r`n                <div class=""flex min-h-screen"">"
$newMainReturn = "            if (!isAuthenticated) {`r`n                return <LoginPage onLogin={(user) => { `r`n                    setIsAuthenticated(true); `r`n                    setCurrentUser(user); `r`n                }} />`r`n            }`r`n`r`n            return (`r`n                <div class=""flex min-h-screen"">"
if ($content.Contains($oldMainReturn)) {
    $content = $content.Replace($oldMainReturn, $newMainReturn)
}

# 3. Remove from getWeightValue
$badAuthInWeight = "                if (!isAuthenticated) {`r`n                return <LoginPage onLogin={(user) => { `r`n                    setIsAuthenticated(true); `r`n                    setCurrentUser(user); `r`n                }} />;`r`n            }"
if ($content.Contains($badAuthInWeight)) {
    $content = $content.Replace($badAuthInWeight, "")
}

[System.IO.File]::WriteAllText($path, $content)
Write-Output "Applied fixes successfully."
