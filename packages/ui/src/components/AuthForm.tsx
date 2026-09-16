import React, { useState } from 'react';
import type { LoginInputDto, RegisterInputDto } from '@consilium/contracts';

export interface AuthFormProps {
  mode: 'login' | 'register';
  feedback: string | null;
  onLogin: (input: LoginInputDto) => void;
  onRegister: (input: RegisterInputDto) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

/**
 * AuthForm — Dumb Component. Formulario de inicio de sesión / registro.
 * El estado del formulario es local; la lógica queda en el padre.
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  feedback,
  onLogin,
  onRegister,
  onSwitchMode
}) => {
  const [ident, setIdent] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [inpre, setInpre] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === 'login') {
      onLogin({ identifier: ident, password });
    } else {
      onRegister({ username, fullName, email, password, inpre: inpre || null });
    }
  };

  return (
    <form className="AuthForm" onSubmit={submit}>
      <div className="AuthForm-switch" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => onSwitchMode('login')}>
          Iniciar sesión
        </button>
        <button type="button" role="tab" aria-selected={mode === 'register'} onClick={() => onSwitchMode('register')}>
          Crear cuenta
        </button>
      </div>

      {mode === 'login' ? (
        <>
          <label htmlFor="auth-ident">Usuario o correo</label>
          <input id="auth-ident" value={ident} onChange={(e) => setIdent(e.target.value)} autoComplete="username" required />
          <label htmlFor="auth-password">Contraseña</label>
          <input id="auth-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </>
      ) : (
        <>
          <label htmlFor="auth-fullname">Nombre completo *</label>
          <input id="auth-fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" required />
          <label htmlFor="auth-username">Usuario *</label>
          <input id="auth-username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" minLength={4} required />
          <label htmlFor="auth-email">Correo electrónico *</label>
          <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <label htmlFor="auth-password2">Contraseña * <small>(mínimo 8 caracteres)</small></label>
          <input id="auth-password2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required />
          <label htmlFor="auth-inpre">N° INPREABOGADO (opcional)</label>
          <input id="auth-inpre" value={inpre} onChange={(e) => setInpre(e.target.value)} />
        </>
      )}

      <button type="submit" className="AuthForm-submit">
        {mode === 'login' ? 'Entrar al portal' : 'Registrarme'}
      </button>
      {feedback ? (
        <p className="AuthForm-feedback" role="alert">
          {feedback}
        </p>
      ) : null}
    </form>
  );
};