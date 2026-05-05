$path = "c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html"
$content = [System.IO.File]::ReadAllText($path)

$oldApp = "        const App = () => {"
$loginPage = @"

        const LoginPage = ({ onLogin }) => {
            const [email, setEmail] = React.useState('');
            const [password, setPassword] = React.useState('');
            const [error, setError] = React.useState('');

            const handleSubmit = (e) => {
                e.preventDefault();
                if (!email) {
                    setError('Por favor, ingrese su correo electrónico.');
                    return;
                }
                const expectedPassword = email.split('@')[0];
                if (password === expectedPassword) {
                    onLogin({ email });
                } else {
                    setError('Contraseña incorrecta. (Recuerde: es el prefijo de su correo)');
                }
            };

            return (
                <div class="min-h-screen bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
                    {/* Background Accents */}
                    <div class="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-red-600/5 rounded-full blur-[100px] animate-pulse"></div>
                    <div class="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-red-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
                    
                    <div class="w-full max-w-md bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white/40 p-12 relative z-10 animate-in fade-in zoom-in duration-1000 backdrop-blur-md">
                        <div class="text-center mb-14">
                            <div class="inline-block p-5 bg-white rounded-[2rem] shadow-2xl mb-10 transform hover:rotate-3 transition-transform duration-500 border border-slate-100">
                                <img src="./eimi_cub_logo.png" alt="EIMI-CUB" class="h-24 drop-shadow-xl select-none" />
                            </div>
                            <h2 class="text-4xl font-black text-slate-900 tracking-tightest mb-4">EIMI-CUB</h2>
                            <p class="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mb-2">Plataforma de Control</p>
                            <div class="h-1 w-12 bg-red-600 mx-auto rounded-full"></div>
                        </div>

                        <form onSubmit={handleSubmit} class="space-y-10">
                            <div class="group">
                                <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2 transition-colors group-focus-within:text-red-600">Correo Corporativo</label>
                                <div class="relative">
                                    <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-30 group-focus-within:opacity-100 transition-all group-focus-within:scale-110">📧</span>
                                    <input 
                                        type="email" 
                                        class="w-full bg-slate-50/50 border-2 border-slate-100 rounded-[1.5rem] p-5 pl-16 text-sm focus:ring-8 focus:ring-red-600/5 focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner" 
                                        placeholder="usuario@ejemplo.com"
                                        value={email}
                                        onChange={e => {setEmail(e.target.value)}}
                                        required
                                    />
                                </div>
                            </div>

                            <div class="group">
                                <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2 transition-colors group-focus-within:text-red-600">Clave de Acceso</label>
                                <div class="relative">
                                    <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-30 group-focus-within:opacity-100 transition-all group-focus-within:scale-110">🔑</span>
                                    <input 
                                        type="password" 
                                        class="w-full bg-slate-50/50 border-2 border-slate-100 rounded-[1.5rem] p-5 pl-16 text-sm focus:ring-8 focus:ring-red-600/5 focus:border-red-600 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => {setPassword(e.target.value)}}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div class="bg-red-50 border-2 border-red-100 text-red-600 text-[11px] font-black p-5 rounded-[1.5rem] animate-in shake duration-500 flex items-center gap-4">
                                    <span class="text-2xl">⚡</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div class="pt-6">
                                <button 
                                    type="submit" 
                                    class="w-full bg-slate-900 text-white rounded-[1.5rem] p-6 text-sm font-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:bg-red-600 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-4 group"
                                >
                                    ACCEDER AL PANEL
                                    <span class="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                </button>
                            </div>
                        </form>

                        <div class="mt-14 pt-10 border-t-2 border-slate-50 text-center relative">
                            <div class="absolute -top-[1.1rem] left-1/2 -translate-x-1/2 bg-white px-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">EIMI-CUB SOFTWARE</div>
                            <p class="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Gestión Profesional de Obras</p>
                        </div>
                    </div>
                </div>
            );
        };

        const App = () => {
            const [isAuthenticated, setIsAuthenticated] = React.useState(false);
            const [currentUser, setCurrentUser] = React.useState(null);
"@

# Note: Added React. prefix because Destructuring might not be available globally in some contexts or easier to match
# Actually, I'll use Destructuring as it's already there at top.
# Wait, the script has const { useState, useEffect } = React; so it's fine.

if ($content.Contains($oldApp)) {
    $content = $content.Replace($oldApp, $loginPage + "`n" + $oldApp)
} else {
    Write-Error "Could not find App start"
    exit 1
}

$oldReturn = "            return ("
$newReturn = @"
            if (!isAuthenticated) {
                return <LoginPage onLogin={(user) => { 
                    setIsAuthenticated(true); 
                    setCurrentUser(user); 
                }} />;
            }

            return (
"@

if ($content.Contains($oldReturn)) {
    # Replace only first occurrence by finding index
    $index = $content.IndexOf($oldReturn)
    # Ensure we replace the one inside App (roughly after where we injected new state)
    # The first one is in PartidasPage, we need the second one.
    # Looking for 'return (' after App definition
    $appIndex = $content.IndexOf("const App = () => {")
    $index = $content.IndexOf($oldReturn, $appIndex)
    
    $content = $content.Remove($index, $oldReturn.Length).Insert($index, $newReturn)
} else {
    Write-Error "Could not find return"
    exit 1
}

$oldSidebar = '                        <div class="p-6 border-t border-slate-100 mt-auto">'
$newSidebar = @"
                        <div class="p-6 border-t border-slate-100 mt-auto bg-slate-50/50">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 border-2 border-red-100 font-black text-xs shadow-sm shadow-red-500/10">
                                    {currentUser?.email?.substring(0, 2).toUpperCase()}
                                </div>
                                <div class="flex-1 overflow-hidden">
                                    <p class="text-xs font-black text-slate-800 truncate">{currentUser?.email?.split("@")[0]}</p>
                                    <p class="text-[9px] font-bold text-red-600/60 uppercase tracking-tighter truncate">{currentUser?.email}</p>
                                </div>
                            </div>
                            <div class="pt-3 border-t border-slate-200/60 flex justify-between items-center">
                                <button 
                                    class="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-700 transition-colors flex items-center gap-1 group"
                                    onClick={() => {
                                        askConfirm("Cerrar Sesión", "¿Estás seguro que deseas salir del sistema?", () => {
                                            setIsAuthenticated(false);
                                            setCurrentUser(null);
                                        });
                                    }}
                                >
                                    <span class="group-hover:-translate-x-0.5 transition-transform">←</span> Salir
                                </button>
                                <span class="text-[9px] font-black text-red-100 bg-red-500 px-1.5 py-0.5 rounded shadow-sm">v1.2 PRO</span>
                            </div>
"@

if ($content.Contains($oldSidebar)) {
     # Replacing the WHOLE block manually is hard, let's just replace the starting div and some following lines
     # Actually we can replace the user demo block specifically if we match it.
     $content = $content.Replace($oldSidebar, $newSidebar)
}

[System.IO.File]::WriteAllText($path, $content)
Write-Output "Success: Auth applied via PowerShell"
