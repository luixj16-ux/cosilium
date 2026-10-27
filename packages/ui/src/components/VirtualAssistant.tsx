import React, { useState } from 'react';

export interface VirtualAssistantProps {
  greeting?: string;
}

interface Message {
  text: string;
  sender: 'assistant' | 'user';
}

const QUICK_ACTIONS = [
  { prompt: 'Buscar un expediente', label: 'Buscar expediente' },
  { prompt: 'No puedo iniciar sesión', label: 'Problemas de acceso' },
  { prompt: 'Necesito información sobre un trámite', label: 'Orientación de trámites' }
];

const DEFAULT_GREETING =
  'Hola. Soy tu asistente judicial. Puedo ayudarte a encontrar un expediente, ubicar un tribunal o resolver dudas de acceso.';

function respond(query: string): string {
  const lower = query.toLowerCase();
  if (/logue|login|sesion|sesión|acceso|contraseña|clave|entrar|iniciar/.test(lower)) {
    return 'Abrí el control de acceso. Puedes entrar como público para consultar expedientes o seleccionar el perfil administrativo autorizado.';
  }
  if (/tramite|requisito|solicitud|documento|orienta/.test(lower)) {
    return 'Para orientarte sobre un trámite, indícame si está relacionado con una causa civil, penal, laboral, protección LOPNNA o violencia contra una mujer.';
  }
  if (/ley|norma|codigo|constituc/.test(lower)) {
    return 'Puedes consultar la biblioteca jurídica desde "Leyes y normativa". Allí encontrarás las normas agrupadas por materia.';
  }
  if (/contacto|telefono|horario|sede|ayuda/.test(lower)) {
    return 'La información de atención está disponible en "Servicios al ciudadano", con canales de orientación y trámites digitales.';
  }
  return 'Puedo ayudarte a buscar expedientes o tribunales, resolver problemas de acceso y orientar sobre trámites. ¿Qué necesitas consultar?';
}

/**
 * VirtualAssistant — Dumb Component. Asistente judicial virtual con
 * respuestas orientativas precargadas (sin lógica de negocio).
 */
export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  greeting = DEFAULT_GREETING
}) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    const query = input.trim();
    if (!query) return;
    setMessages((prev) => [...prev, { text: query, sender: 'user' }]);
    setInput('');
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { text: respond(query), sender: 'assistant' }]);
    }, 180);
  };

  const openAssistant = () => {
    setOpen(true);
    if (messages.length === 0) setMessages([{ text: greeting, sender: 'assistant' }]);
  };

  const closeAssistant = () => setOpen(false);

  const quickAction = (prompt: string) => {
    openAssistant();
    setInput(prompt);
  };

  return (
    <>
      <button
        type="button"
        className="assistant-launcher"
        id="assistant-launcher"
        aria-label="Abrir asistente virtual"
        aria-controls="virtual-assistant"
        aria-expanded={open}
        onClick={openAssistant}
      >
        <i className="fa-solid fa-comments" />
        <span className="assistant-notification">1</span>
      </button>

      <aside
        className="virtual-assistant"
        id="virtual-assistant"
        role="dialog"
        aria-modal="false"
        aria-labelledby="assistant-title"
        hidden={!open}
      >
        <div className="assistant-header">
          <div className="assistant-identity">
            <span className="assistant-avatar">
              <i className="fa-solid fa-scale-balanced" />
            </span>
            <div>
              <h2 id="assistant-title">Asistente Judicial</h2>
              <span>
                <i className="fa-solid fa-circle" /> Disponible ahora
              </span>
            </div>
          </div>
          <button type="button" className="assistant-close" id="assistant-close" aria-label="Cerrar asistente" onClick={closeAssistant}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="assistant-messages" id="assistant-messages" aria-live="polite">
          {messages.map((message, index) => (
            <div key={`${message.sender}-${index}`} className={`assistant-message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="assistant-quick-actions" id="assistant-quick-actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.prompt}
              type="button"
              data-assistant-prompt={action.prompt}
              onClick={() => quickAction(action.prompt)}
            >
              {action.label}
            </button>
          ))}
        </div>
        <form className="assistant-composer" id="assistant-form" onSubmit={send}>
          <label className="sr-only" htmlFor="assistant-input">
            Escriba su consulta
          </label>
          <input
            id="assistant-input"
            type="text"
            placeholder="Escriba su consulta..."
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" aria-label="Enviar consulta">
            <i className="fa-solid fa-paper-plane" />
          </button>
        </form>
      </aside>
    </>
  );
};