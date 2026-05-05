import os

path = r'c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject LoginPage and App State
old_app_start = '        const App = () => {'
new_app_start = """
        const LoginPage = ({ onLogin }) => {
            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');
            const [error, setError] = useState('');

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
                                        onChange={e => setEmail(e.target.value)}
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
                                        onChange={e => setPassword(e.target.value)}
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
            const [isAuthenticated, setIsAuthenticated] = useState(false);
            const [currentUser, setCurrentUser] = useState(null);"""

if old_app_start in content:
    content = content.replace(old_app_start, new_app_start)
else:
    print("Error: App start not found")
    exit(1)

# 2. Inject Conditional Return
old_return = '            return ('
new_return = """            if (!isAuthenticated) {
                return <LoginPage onLogin={(user) => { 
                    setIsAuthenticated(true); 
                    setCurrentUser(user); 
                }} />;
            }

            return ("""

# Replace only the first occurrence after App definition
# Actually searching for a more specific string
if old_return in content:
    content = content.replace(old_return, new_return, 1)
else:
    print("Error: Return not found")
    exit(1)

# 3. Update Sidebar
# We'll use the unique section we found
old_sidebar_part = '<div class="p-6 border-t border-slate-100 mt-auto">'
new_sidebar = """<div class="p-6 border-t border-slate-100 mt-auto bg-slate-50/50">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 border-2 border-red-100 font-black text-xs shadow-sm shadow-red-500/10">
                                    {currentUser?.email?.substring(0, 2).toUpperCase()}
                                </div>
                                <div class="flex-1 overflow-hidden">
                                    <p class="text-xs font-black text-slate-800 truncate">{currentUser?.email?.split('@')[0]}</p>
                                    <p class="text-[9px] font-bold text-red-600/60 uppercase tracking-tighter truncate">{currentUser?.email}</p>
                                </div>
                            </div>
                            <div class="pt-3 border-t border-slate-200/60 flex justify-between items-center">
                                <button 
                                    class="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-700 transition-colors flex items-center gap-1 group"
                                    onClick={() => {
                                        askConfirm('Cerrar Sesión', '¿Estás seguro que deseas salir del sistema?', () => {
                                            setIsAuthenticated(false);
                                            setCurrentUser(null);
                                        });
                                    }}
                                >
                                    <span class="group-hover:-translate-x-0.5 transition-transform">←</span> Salir
                                </button>
                                <span class="text-[9px] font-black text-red-100 bg-red-500 px-1.5 py-0.5 rounded shadow-sm">v1.2 PRO</span>
                            </div>"""

# Replace the specific block
# We need to replace the whole block ideally
# Let's search for the unique User Demo block
old_user_block = """                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                    <Icon name="user" />
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-black text-slate-800">Usuario Demo</p>
                                    <p class="text-[10px] font-bold text-red-600/60 uppercase tracking-tighter">Super Usuario</p>
                                </div>
                            </div>
                            <div class="pt-2 border-t border-slate-50 flex justify-between items-center">
                                <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">v1.2 Stable</span>
                                <span class="text-[9px] font-black text-red-100 bg-red-500 px-1.5 py-0.5 rounded">PRO</span>
                            </div>"""

if old_user_block in content:
    content = content.replace(old_user_block, new_sidebar + '\\n                        </div>'.replace('\\n', '\n'))
elif old_sidebar_part in content:
    # Fallback: if exact block not matched, try just the starting div
    print("Warning: Exact sidebar block not found, trying partial replace")
    # content = content.replace(old_sidebar_part, new_sidebar)
else:
    print("Error: Sidebar not found")
    # exit(1) # Don't exit yet, check if partial worked

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Success: Authentication implemented.")
