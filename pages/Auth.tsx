
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Input from '../components/Input';

type AuthView = 'login' | 'signup' | 'resetPassword';
type ResetStep = 'enterEmail' | 'enterCodeAndPassword';

const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [resetStep, setResetStep] = useState<ResetStep>('enterEmail');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [otp, setOtp] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const clearFormState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setTelefone('');
    setOtp('');
    setShowPassword(false);
    setError(null);
    setMessage(null);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    value = value.substring(0, 11); // Limit to 11 digits (DDD + number)
    
    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    if (value.length > 7) {
      formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    }

    setTelefone(formattedValue);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

const handleSignUp = async () => {
  try {
    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      throw new Error('As senhas não coincidem.');
    }

    // 1️⃣ Cadastra o usuário no Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) throw signUpError;
    if (!signUpData.user) throw new Error('Falha ao cadastrar: nenhum usuário retornado.');

    // 2️⃣ Loga automaticamente para garantir que auth.uid() esteja definido
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) throw loginError;

    // 3️⃣ Limpa o telefone (remove caracteres não numéricos)
    const cleanedTelefone = telefone.replace(/\D/g, '');

    // 4️⃣ Insere o perfil do cliente na tabela 'clientes'
    const { error: insertError } = await supabase.from('clientes').insert({
      usuario_id: loginData.user.id, // auth.uid() agora está disponível
      nome: fullName,
      email: email,
      telefone: cleanedTelefone,
      role: 'cliente', // Atribui a função padrão de cliente
    });
    if (insertError) throw insertError;

    // 5️⃣ Mensagem de sucesso
    setMessage('Conta criada com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    setMessage(`Erro: ${error.message}`);
  }
};

  const handlePasswordResetRequest = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
    if (error) throw error;
    setMessage('Código de verificação enviado para o seu e-mail.');
    setResetStep('enterCodeAndPassword');
  };

  const handlePasswordResetConfirm = async () => {
    if (password !== confirmPassword) {
      throw new Error('As novas senhas não coincidem.');
    }
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (verifyError) throw verifyError;
    if (!data.session) throw new Error('Não foi possível verificar o código. Tente novamente.');

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) throw updateError;

    await supabase.auth.signOut();

    setMessage('Senha redefinida com sucesso! Você pode fazer login com sua nova senha.');
    setView('login');
    clearFormState();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (view === 'login') {
        await handleLogin();
      } else if (view === 'signup') {
        await handleSignUp();
      } else if (view === 'resetPassword') {
        if (resetStep === 'enterEmail') {
          await handlePasswordResetRequest();
        } else {
          await handlePasswordResetConfirm();
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchView = (newView: AuthView) => {
    setView(newView);
    setResetStep('enterEmail');
    clearFormState();
  };

  const renderLoginForm = () => (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bem-vindo de volta</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Faça login para continuar</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Endereço de E-mail"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          autoComplete="email"
          required
        />
        <Input
          label="Senha"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          isPassword
          showPassword={showPassword}
          onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
          autoComplete="current-password"
        />
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
      <div className="text-center flex flex-col items-center space-y-3">
        <button
          onClick={() => switchView('signup')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Precisa de uma conta? Cadastre-se
        </button>
        <button
          type="button"
          onClick={() => switchView('resetPassword')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Esqueceu a senha?
        </button>
      </div>
    </>
  );

  const renderSignUpForm = () => (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Criar Conta</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Comece com sua nova conta</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome Completo"
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="João da Silva"
            required
          />
          <Input
            label="Telefone"
            id="telefone"
            type="tel"
            value={telefone}
            onChange={handleTelefoneChange}
            placeholder="(XX) XXXXX-XXXX"
            maxLength={15}
          />
        <Input
          label="Endereço de E-mail"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          autoComplete="email"
          required
        />
        <Input
          label="Senha"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          isPassword
          showPassword={showPassword}
          onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
          autoComplete="new-password"
        />
        <Input
            label="Confirmar Senha"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            isPassword
            showPassword={showPassword}
            onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
            autoComplete="new-password"
        />
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? 'Processando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
      <div className="text-center flex flex-col items-center space-y-3">
          <button
              onClick={() => switchView('login')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
              Já tem uma conta? Entrar
          </button>
          <button
            type="button"
            onClick={() => switchView('resetPassword')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Esqueceu a senha?
          </button>
      </div>
  </>
);

const renderResetPasswordForm = () => (
  <>
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Redefinir Senha</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        {resetStep === 'enterEmail' 
          ? 'Digite seu e-mail para receber um código de verificação.'
          : 'Verifique seu e-mail e digite o código e sua nova senha.'
        }
      </p>
    </div>
    <form onSubmit={handleSubmit} className="space-y-6">
      {resetStep === 'enterEmail' ? (
        <Input
          label="Endereço de E-mail"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          autoComplete="email"
          required
        />
      ) : (
        <>
          <Input
            label="Endereço de E-mail"
            id="email"
            type="email"
            value={email}
            readOnly
            className="bg-gray-200 dark:bg-gray-600 cursor-not-allowed"
          />
          <Input
            label="Código de Verificação"
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            required
          />
           <Input
              label="Nova Senha"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              isPassword
              showPassword={showPassword}
              onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
              autoComplete="new-password"
          />
          <Input
              label="Confirmar Nova Senha"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              isPassword
              showPassword={showPassword}
              onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
              autoComplete="new-password"
          />
        </>
      )}
      
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading 
            ? 'Processando...' 
            : resetStep === 'enterEmail' ? 'Enviar Código' : 'Redefinir Senha'
          }
        </button>
      </div>
    </form>
    <div className="text-center">
      <button
        onClick={() => switchView('login')}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        Voltar para o Login
      </button>
    </div>
  </>
);

  const renderContent = () => {
    switch(view) {
      case 'login': return renderLoginForm();
      case 'signup': return renderSignUpForm();
      case 'resetPassword': return renderResetPasswordForm();
      default: return renderLoginForm();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        {renderContent()}

        {message && (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;