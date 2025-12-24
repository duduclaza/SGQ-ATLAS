import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/');
            } else {
                setError('Credenciais inválidas. Verifique seu email e senha.');
            }
        } catch (err) {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                {/* Animated gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white tracking-tight">
                                    SGQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">ATLAS</span>
                                </h1>
                                <p className="text-blue-300/70 text-sm font-medium tracking-wider uppercase mt-1">
                                    Quality Management System
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tagline */}
                    <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-6">
                        Excelência em Gestão<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
                            da Qualidade
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
                        Plataforma completa para controle de qualidade, conformidades,
                        auditorias e melhoria contínua na sua organização.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        {[
                            'Controle total de não conformidades',
                            'Gestão de auditorias internas',
                            'Análise NPS e satisfação do cliente',
                            'Dashboards e relatórios em tempo real'
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-3 text-slate-300">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <CheckCircle size={12} className="text-white" />
                                </div>
                                <span className="text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-8 left-16 xl:left-24 text-slate-500 text-sm">
                        © {new Date().getFullYear()} SGQ ATLAS • Todos os direitos reservados
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12 lg:px-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-10 text-center">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                SGQ <span className="text-blue-600">ATLAS</span>
                            </h1>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 lg:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                Bem-vindo de volta
                            </h2>
                            <p className="text-slate-500">
                                Faça login para acessar sua conta
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-red-600 text-xs font-bold">!</span>
                                </div>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email
                                </label>
                                <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <Mail size={18} className={`transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 
                                                   focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 
                                                   transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Senha
                                </label>
                                <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <Lock size={18} className={`transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full h-14 pl-12 pr-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 
                                                   focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 
                                                   transition-all duration-200"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                    Esqueci minha senha
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                                           text-white font-semibold rounded-xl transition-all duration-200 
                                           flex items-center justify-center gap-2 group
                                           shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Entrando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Entrar</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-sm text-slate-400">ou</span>
                            </div>
                        </div>

                        {/* Register Button */}
                        <button
                            type="button"
                            className="w-full h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 
                                       border-2 border-transparent hover:border-slate-300"
                        >
                            Criar nova conta
                        </button>
                    </div>

                    {/* Demo credentials - subtle */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-blue-700 text-sm font-medium mb-2 flex items-center gap-2">
                            <Shield size={14} />
                            Ambiente de demonstração
                        </p>
                        <div className="text-blue-600 text-sm font-mono space-y-1">
                            <p>Email: admin@sgqatlas.com</p>
                            <p>Senha: admin123</p>
                        </div>
                    </div>

                    {/* Mobile Footer */}
                    <p className="lg:hidden mt-8 text-center text-slate-400 text-sm">
                        © {new Date().getFullYear()} SGQ ATLAS
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
