import sys
import os

path = r'c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Define LoginPage Component (Safe Entities)
login_component = r"""
        const LoginPage = ({ onLogin }) => {
            const [email, setEmail] = React.useState('');
            const [password, setPassword] = React.useState('');
            const [error, setError] = React.useState(null);

            const handleSubmit = (e) => {
                e.preventDefault();
                const prefix = email.split('@')[0];
                if (email && password === prefix) {
                    onLogin({ email, name: prefix.toUpperCase() });
                } else {
                    setError('Credenciales incorrectas. Verifique correo y clave.');
                }
            };

            return (
                <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Inter']">
                    <div class="w-full max-w-lg bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 p-16 animate-in fade-in zoom-in duration-1000">
                        <div class="text-center mb-12">
                            <div class="w-24 h-24 bg-red-600 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-red-600/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                                <span class="text-white text-5xl font-black">E</span>
                            </div>
                            <h2 class="text-4xl font-black text-slate-900 tracking-tightest mb-4">EIMI-CUB</h2>
                            <p class="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mb-2">Plataforma de Control</p>
                            <div class="h-1 w-12 bg-red-600 mx-auto rounded-full"></div>
                        </div>

                        <form onSubmit={handleSubmit} class="space-y-10">
                            <div class="group">
                                <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Correo Corporativo</label>
                                <input 
                                    type="email" 
                                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-5 text-sm font-bold focus:border-red-600 focus:bg-white outline-none transition-all shadow-inner" 
                                    placeholder="usuario@ejemplo.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div class="group">
                                <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Clave de Acceso</label>
                                <input 
                                    type="password" 
                                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-5 text-sm font-bold focus:border-red-600 focus:bg-white outline-none transition-all shadow-inner" 
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p class="text-red-500 text-[11px] font-bold text-center">{error}</p>}

                            <button type="submit" class="w-full bg-slate-900 text-white rounded-[1.5rem] p-6 text-sm font-black shadow-xl hover:bg-red-600 hover:scale-[1.03] transition-all">
                                ACCEDER AL PANEL
                            </button>
                        </form>
                    </div>
                </div>
            );
        };
"""

# 2. Add Component before App definition
if "const LoginPage" not in content:
    content = content.replace("const App = () => {", login_component + "\n        const App = () => {")

# 3. Add Login Logic to App
login_logic = r"""
            const [isAuthenticated, setIsAuthenticated] = useLocalStorageState('app_auth', false);
            const [currentUser, setCurrentUser] = useLocalStorageState('app_current_user', null);

            if (!isAuthenticated) {
                return <LoginPage onLogin={(user) => { setIsAuthenticated(true); setCurrentUser(user); }} />;
            }
"""

if "const [isAuthenticated" not in content:
    content = content.replace("const App = () => {", "const App = () => {" + login_logic)

# 4. Save file
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: Login applied via Python script.")
