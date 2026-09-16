import React, { useState, useMemo } from 'react';
import { buildPortalInMemoryDependencies } from '@consilium/core';
import type { User } from '@consilium/core';
import type { CourtDto, LegalCaseDto } from '@consilium/contracts';
import {
  AppHeader,
  CourtsGrid,
  CasesList,
  CaseDetailModal,
  AuthForm,
  NewCaseForm,
  AddActuationForm,
  LawsCatalog,
  NewsList,
  AdminUsersList,
  ToastStack,
  SearchBox,
  PublicNoticeBanner,
  Breadcrumb
} from '@consilium/ui';
import { createPortalUseCases } from './useCases';
import { toCourtDto, toCaseDto, toUserDto } from './mappers';

const DEPENDENCIES = buildPortalInMemoryDependencies();
const USE_CASES = createPortalUseCases(DEPENDENCIES);

type View = 'home' | 'court-cases' | 'new-case';
type AuthMode = 'login' | 'register';

interface Toast {
  id: string;
  message: string;
  kind: 'success' | 'error' | 'info';
}

/**
 * App (@consilium/web) — Composition Root.
 *
 * Instancia las dependencias en memoria, orquesta los casos de uso del
 * Core y alimenta los Dumb Components de @consilium/ui. No contiene
 * dominio ni lógica de negocio.
 */
export const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState<LegalCaseDto | null>(null);
  const [showAddActuation, setShowAddActuation] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const courts = useMemo(() => USE_CASES.listCourts.execute().map(toCourtDto), []);
  const selectedCourt: CourtDto | null =
    courts.find((c) => c.id === selectedCourtId) ?? null;
  const laws = useMemo(() => USE_CASES.listLaws.execute(), []);
  const news = useMemo(() => USE_CASES.listNews.execute(), []);

  const cases: LegalCaseDto[] = useMemo(() => {
    if (!selectedCourtId || !currentUser) return [];
    return USE_CASES.listCourtCases.execute({
      actor: currentUser,
      courtId: selectedCourtId,
      filterTerm: searchTerm || undefined
    }).map(toCaseDto);
  }, [selectedCourtId, currentUser, searchTerm]);

  const pushToast = (message: string, kind: Toast['kind'] = 'success'): void => {
    const id = String(Date.now());
    setToasts((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const authenticate = (user: User, sessionToken: string): void => {
    setCurrentUser(user);
    setToken(sessionToken);
    setShowAuthModal(false);
    setAuthFeedback(null);
    pushToast(`Bienvenido, ${user.username.value}.`);
  };

  const handleLogin = (input: { identifier: string; password: string }): void => {
    try {
      const { user, token: newToken } = USE_CASES.login.execute(input);
      authenticate(user, newToken);
    } catch (error) {
      setAuthFeedback(error instanceof Error ? error.message : 'Credenciales inválidas.');
    }
  };

  const handleRegister = (input: {
    username: string;
    fullName: string;
    email: string;
    password: string;
    inpre?: string | null;
  }): void => {
    try {
      const { user, token: newToken } = USE_CASES.register.execute(input);
      authenticate(user, newToken);
    } catch (error) {
      setAuthFeedback(error instanceof Error ? error.message : 'No se pudo registrar.');
    }
  };

  const handleLogout = (): void => {
    if (token) USE_CASES.logout.execute({ token });
    setCurrentUser(null);
    setToken(null);
    setView('home');
    setSelectedCourtId(null);
    pushToast('Sesión cerrada.', 'info');
  };

  const openCourt = (courtId: string): void => {
    setSelectedCourtId(courtId);
    setSearchTerm('');
    setView('court-cases');
  };

  const openCase = (publicId: string): void => {
    if (!currentUser) return;
    const legalCase = USE_CASES.getCaseDetail.execute({ actor: currentUser, publicId });
    setSelectedCase(toCaseDto(legalCase));
  };

  const handleCreateCase = (input: {
    courtId: string;
    title: string;
    subject: string;
    plaintiff: string;
    defendant: string;
    attorney?: string | null;
    amount?: number;
  }): void => {
    if (!currentUser) return;
    try {
      USE_CASES.createCase.execute({ actor: currentUser, ...input });
      setView('court-cases');
      pushToast('Expediente radicado correctamente.');
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'No se pudo radicar.', 'error');
    }
  };

  const handleAddActuation = (input: {
    publicId: string;
    activityType: string;
    summary: string;
    signedBy: string;
  }): void => {
    if (!currentUser) return;
    try {
      const updated = USE_CASES.addActuation.execute({ actor: currentUser, ...input });
      setShowAddActuation(false);
      setSelectedCase(toCaseDto(updated));
      pushToast('Actuación incorporada.');
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'No se pudo guardar.', 'error');
    }
  };

  const handleDeleteCase = (publicId: string): void => {
    if (!currentUser) return;
    try {
      USE_CASES.deleteCase.execute({ actor: currentUser, publicId });
      setSelectedCase(null);
      setShowAddActuation(false);
      pushToast('Expediente dado de baja.', 'info');
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'No se pudo eliminar.', 'error');
    }
  };

  const handleSaveSearch = (term: string): void => {
    if (!currentUser || !selectedCourtId) return;
    USE_CASES.saveSearch.execute({
      actor: currentUser,
      query: term,
      courtId: selectedCourtId,
      resultCount: cases.length
    });
  };

  const handlePromote = (userId: number): void => {
    if (!currentUser) return;
    try {
      USE_CASES.promote.execute({ actor: currentUser, userId });
      pushToast('Usuario promovido a admin.');
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'No se pudo promover.', 'error');
    }
  };

  const adminUsers = useMemo(() => {
    if (!currentUser?.isAdmin) return [];
    return USE_CASES.listUsers.execute({ actor: currentUser }).map(toUserDto);
  }, [currentUser]);

  return (
    <div className="App">
      <AppHeader
        isAuthenticated={currentUser !== null}
        role={currentUser?.isAdmin ? 'admin' : 'public'}
        fullName={currentUser?.fullName ?? 'Consulta General'}
        onHomeClick={() => {
          setView('home');
          setSelectedCourtId(null);
        }}
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
      />

      <Breadcrumb
        currentCourtName={selectedCourt?.name ?? null}
        isAdmin={currentUser?.isAdmin ?? false}
        onHomeClick={() => {
          setView('home');
          setSelectedCourtId(null);
        }}
      />

      <main className="App-content">
        {view === 'home' && !currentUser ? (
          <>
            <section className="App-hero">
              <h1>Portal Judicial de la República Bolivariana de Venezuela</h1>
              <p>Consulte expedientes oficiales en todas las jurisdicciones del TSJ.</p>
            </section>
            <section className="App-section">
              <CourtsGrid courts={courts} onSelectCourt={openCourt} />
            </section>
            <section className="App-section">
              <NewsList news={news} />
            </section>
          </>
        ) : null}

        {view === 'home' && currentUser ? (
          <>
            <section className="App-hero">
              <h1>Panel del Portal Judicial</h1>
              <p>Seleccione un tribunal para consultar expedientes.</p>
            </section>
            <section className="App-section">
              <CourtsGrid courts={courts} onSelectCourt={openCourt} />
            </section>
            {currentUser.isAdmin ? (
              <section className="App-section">
                <AdminUsersList users={adminUsers} currentUserId={currentUser.id} onPromote={handlePromote} />
              </section>
            ) : null}
            <section className="App-section">
              <h2>Leyes y normativa venezolana</h2>
              <LawsCatalog categories={laws} />
            </section>
            <section className="App-section">
              <NewsList news={news} />
            </section>
          </>
        ) : null}

        {view === 'court-cases' && selectedCourt ? (
          <section className="App-section App-section-cases">
            <h2>{selectedCourt.name}</h2>
            <PublicNoticeBanner courtName={selectedCourt.name} />
            <div className="App-cases-toolbar">
              <SearchBox
                value={searchTerm}
                onSearch={(term) => {
                  setSearchTerm(term);
                  handleSaveSearch(term);
                }}
                placeholder="Buscar N° de expediente, carátula o parte…"
              />
              {currentUser?.isAdmin ? (
                <button type="button" className="App-btn-primary" onClick={() => setView('new-case')}>
                  Nueva Causa
                </button>
              ) : null}
            </div>
            <CasesList legalCases={cases} onOpenCase={openCase} />
          </section>
        ) : null}

        {view === 'new-case' && selectedCourt && currentUser ? (
          <section className="App-section">
            <NewCaseForm
              court={selectedCourt}
              onSubmit={handleCreateCase}
              onCancel={() => setView('court-cases')}
            />
          </section>
        ) : null}
      </main>

      {showAuthModal ? (
        <div className="ModalOverlay" role="dialog" aria-modal="true">
          <div className="App-auth-modal">
            <button
              type="button"
              className="App-auth-close"
              aria-label="Cerrar"
              onClick={() => setShowAuthModal(false)}
            >
              ×
            </button>
            <AuthForm
              mode={authMode}
              feedback={authFeedback}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onSwitchMode={setAuthMode}
            />
          </div>
        </div>
      ) : null}

      {selectedCase && !showAddActuation ? (
        <CaseDetailModal
          legalCase={selectedCase}
          canEdit={currentUser?.isAdmin ?? false}
          onClose={() => setSelectedCase(null)}
          onDelete={handleDeleteCase}
          onAddActuation={() => setShowAddActuation(true)}
        />
      ) : null}

      {selectedCase && showAddActuation && currentUser ? (
        <AddActuationForm
          onSave={handleAddActuation}
          onCancel={() => {
            setShowAddActuation(false);
            openCase(selectedCase.publicId);
          }}
        />
      ) : null}

      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
};

export default App;