import React, { useState } from 'react';
import type { LoginInputDto, RegisterInputDto } from '@consilium/contracts';

export interface AuthFormProps {
  mode: 'login' | 'register';
  feedback: string | null;
  onClose: () => void;
  onLogin: (input: LoginInputDto) => void;
  onRegister: (input: RegisterInputDto) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

interface PasswordFieldProps {
  id: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * PasswordField — Dumb Component. Input de contraseña con toggle de visibilidad.
 */
const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  placeholder,
  autoComplete,
  value,
  onChange
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-input-wrapper">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        minLength={8}
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="password-toggle"
        tabIndex={-1}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        onClick={() => setVisible(!visible)}
      >
        <i className={visible ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
      </button>
    </div>
  );
};

/**
 * AuthForm — Dumb Component. Modal de acceso al portal (login / registro).
 * La lógica de validación de credenciales queda en el padre.
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  feedback,
  onClose,
  onLogin,
  onRegister,
  onSwitchMode
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [inpre, setInpre] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const intro =
    mode === 'register'
      ? 'Crea tu cuenta para acceder a búsquedas, normativa y detalles del portal.'
      : 'Inicia sesión para consultar expedientes, normativa y detalles procesales.';

  const submitLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    onLogin({ identifier, password });
  };

  const submitRegister = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 3) {
      setLocalError('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (!/^[a-z0-9._-]{4,40}$/.test(username)) {
      setLocalError('El usuario debe tener 4-40 caracteres (letras, números, puntos, guiones).');
      return;
    }
    if (!email.includes('@')) {
      setLocalError('Ingresa un correo electrónico válido.');
      return;
    }
    if (email !== emailConfirm) {
      setLocalError('Los correos electrónicos no coinciden.');
      return;
    }
    if (regPassword.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }
    setLocalError(null);
    onRegister({ username, fullName: name, email, password: regPassword, inpre: inpre || null });
  };

  return (
    <div
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      aria-label="Acceso al portal judicial"
      onClick={onClose}
    >
      <div className="modal-box" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-box-header">
          <h3>
            <i className="fa-solid fa-user-shield" style={{ color: 'var(--tsj-blue-primary)' }} />{' '}
            Acceso al portal judicial
          </h3>
          <button type="button" className="btn-circle" aria-label="Cerrar" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="modal-box-body">
          <div className="auth-switcher">
            <button
              type="button"
              className={`auth-switch ${mode === 'login' ? 'active' : ''}`}
              data-auth-mode="login"
              onClick={() => onSwitchMode('login')}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={`auth-switch ${mode === 'register' ? 'active' : ''}`}
              data-auth-mode="register"
              onClick={() => onSwitchMode('register')}
            >
              Crear cuenta
            </button>
          </div>
          <p className="auth-intro" id="auth-intro">
            {intro}
          </p>

          <form className="auth-form" id="login-form" hidden={mode !== 'login'} onSubmit={submitLogin}>
            <label htmlFor="login-identifier">Usuario o correo</label>
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-main btn-primary-clean">
              <i className="fa-solid fa-right-to-bracket" /> Entrar al portal
            </button>
          </form>

          <form
            className="auth-form"
            id="register-form"
            hidden={mode !== 'register'}
            onSubmit={submitRegister}
          >
            <div className="form-field">
              <label htmlFor="register-name">Nombre completo *</label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                required
                placeholder="Ej: María Pérez García"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="register-username">Usuario *</label>
              <input
                id="register-username"
                type="text"
                autoComplete="username"
                minLength={4}
                required
                placeholder="Ej: maria.perez"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="register-email">Correo electrónico *</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                placeholder="Ej: maria@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="register-email-confirm">Confirmar correo *</label>
              <input
                id="register-email-confirm"
                type="email"
                autoComplete="email"
                required
                placeholder="Repite tu correo electrónico"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="register-password">
                Contraseña * <small className="field-hint">(mínimo 8 caracteres)</small>
              </label>
              <PasswordField
                id="register-password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                value={regPassword}
                onChange={setRegPassword}
              />
            </div>
            <div className="form-field">
              <label htmlFor="register-password-confirm">Confirmar contraseña *</label>
              <PasswordField
                id="register-password-confirm"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                value={regPasswordConfirm}
                onChange={setRegPasswordConfirm}
              />
            </div>
            <div className="form-field">
              <label htmlFor="register-inpre">
                N° INPREABOGADO <small className="field-hint">(opcional)</small>
              </label>
              <input
                id="register-inpre"
                type="text"
                placeholder="Ej: 45.120"
                value={inpre}
                onChange={(e) => setInpre(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-main btn-primary-clean">
              <i className="fa-solid fa-user-plus" /> Registrarme
            </button>
          </form>

          <p className="auth-feedback" id="auth-feedback" role="alert">
            {localError ?? feedback}
          </p>
        </div>
        <div className="modal-box-footer">
          <small className="auth-privacy">
            <i className="fa-solid fa-shield-halved" /> Solo se registran los datos necesarios para
            tu cuenta y trazabilidad de consultas.
          </small>
        </div>
      </div>
    </div>
  );
};