import React, { useState, useMemo, useEffect } from 'react';
import { buildPortalInMemoryDependencies } from '@consilium/core';
import type { User } from '@consilium/core';
import type { CourtDto, LegalCaseDto } from '@consilium/contracts';
import {
  PortalHeader,
  type TabId,
  Breadcrumb,
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
  InstitutionPanel,
  ServicesPanel,
  AgendaPanel,
  VirtualAssistant
} from '@consilium/ui';
import { createPortalUseCases } from './useCases';
import { toCourtDto, toCaseDto, toUserDto } from './mappers';

const DEPENDENCIES = buildPortalInMemoryDependencies();
const USE_CASES = createPortalUseCases(DEPENDENCIES);

type View = 'home' | 'court-cases' | 'new-case';
type Theme = 'light' | 'dark';
type AuthMode = 'login' | 'register';

interface Toast {
  id: string;
  message: string;
  kind: 'success' | 'error' | 'info';
}

const GATED_TABS: TabId[] = ['courts-panel', 'laws-panel'];

/**
 * App (@consilium/web) — Composition Root.
 *
 * Instancia las dependencias en memoria, orquesta los casos de uso del
 * Core y alimenta los Dumb Components de @consilium/ui. No contiene
 * dominio ni lógica de negocio.
 */
export const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [activeTab, setActiveTab] = useState<TabId | null>(null);
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem('tsj_theme_v3');
    return saved === 'dark' ? 'dark' : 'light';
  });
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
  const [refreshKey, setRefreshKey] = useState(0);

  const courts = useMemo(() => USE_CASES.listCourts.execute().map(toCourtDto), []);
  const selectedCourt: CourtDto | null =
    courts.find((c) => c.id === selectedCourtId) ?? null;
  const laws = useMemo(() => USE_CASES.listLaws.execute(), []);
  const news = useMemo(() => USE_CASES.listNews.execute(), []);

  const role: 'guest' | 'public' | 'admin' = currentUser
    ? currentUser.isAdmin
      ? 'admin'
      : 'public'
    : 'guest';

  const cases: LegalCaseDto[] = useMemo(() => {
    if (!selectedCourtId || !currentUser) return [];
    return USE_CASES.listCourtCases.execute({
      actor: currentUser,
      courtId: selectedCourtId,
      filterTerm: searchTerm || undefined
    }).map(toCaseDto);
  }, [selectedCourtId, currentUser, searchTerm, refreshKey]);

  const caseCounts: Record<string, number> = useMemo(() => {
    if (!currentUser) return {};
    const counts: Record<string, number> = {};
    for (const court of courts) {
      try {
        counts[court.id] =
          USE_CASES.listCourtCases.execute({ actor: currentUser, courtId: court.id }).length;
      } catch {
        counts[court.id] = 0;
      }
    }
    return counts;
  }, [currentUser, courts, refreshKey]);

  const adminUsers = useMemo(() => {
    if (!currentUser?.isAdmin) return [];
    return USE_CASES.listUsers.execute({ actor: currentUser }).map(toUserDto);
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const pushToast = (message: string, kind: Toast['kind'] = 'success'): void => {
    const id = String(Date.now()) + String(Math.random()).slice(2);
    setToasts((prev) => [...prev, { id, message, kind }].slice(-4));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const toggleTheme = (): void => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    window.localStorage.setItem('tsj_theme_v3', next);
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
    setSearchTerm('');
    pushToast('Sesión cerrada correctamente.', 'info');
  };

  const goHome = (): void => {
    setView('home');
    setSelectedCourtId(null);
    setSearchTerm('');
  };

  const handleTabSelect = (tab: TabId): void => {
    if (GATED_TABS.includes(tab) && !currentUser) {
      setShowAuthModal(true);
      pushToast('Regístrate o inicia sesión para consultar esta sección.', 'info');
      return;
    }
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const openCourt = (courtId: string): void => {
    if (!currentUser) {
      setShowAuthModal(true);
      pushToast('Regístrate o inicia sesión para consultar esta sección.', 'info');
      return;
    }
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
      setRefreshKey((k) => k + 1);
      pushToast('Expediente radicado correctamente.');
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'No se pudo radicar.', 'error');
    }
  };

  const handleAddActuation = (input: {
    activityType: string;
    summary: string;
    signedBy: string;
  }): void => {
    if (!currentUser || !selectedCase) return;
    try {
      const updated = USE_CASES.addActuation.execute({
        actor: currentUser,
        publicId: selectedCase.publicId,
        ...input
      });
      setShowAddActuation(false);
      setSelectedCase(toCaseDto(updated));
      setRefreshKey((k) => k + 1);
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
      setRefreshKey((k) => k + 1);
      pushToast('Expediente dado de baja del registro', 'info');
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

  return (
    <>
      <PortalHeader
        role={role}
        fullName={currentUser?.fullName ?? 'Regístrate para acceder'}
        theme={theme}
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
        onHomeClick={goHome}
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
        onToggleTheme={toggleTheme}
      />

      <Breadcrumb currentCourtName={selectedCourt?.name ?? null} onHomeClick={goHome} />

      <main className="app-content">
        {view === 'home' ? (
          <section id="view-courts" className="view-section active">
            <div className="tsj-hero-header">
              <div className="tsj-hero-content">
                <div className="tsj-badge-official">
                  <i className="fa-solid fa-certificate" /> Tribunal Supremo de Justicia •
                  Plataforma Digital
                </div>
                <h1>Portal Judicial de la República Bolivariana de Venezuela</h1>
                <p>
                  Consulte, descargue y tramite expedientes oficiales en todas las
                  circunscripciones judiciales y salas del Tribunal Supremo de Justicia.
                </p>
                <div className="service-signals" aria-label="Características del servicio">
                  <span>
                    <i className="fa-solid fa-magnifying-glass" /> Consulta por tribunal o
                    expediente
                  </span>
                  <span>
                    <i className="fa-solid fa-lock-open" /> Acceso público de solo lectura
                  </span>
                  <span>
                    <i className="fa-solid fa-headset" /> Orientación con asistente virtual
                  </span>
                </div>
              </div>
            </div>

            {activeTab === 'courts-panel' ? (
              <CourtsGrid
                courts={courts}
                selectedCourtId={selectedCourtId}
                caseCounts={caseCounts}
                active
                onSelectCourt={openCourt}
              />
            ) : null}

            {activeTab === 'laws-panel' ? (
              <LawsCatalog
                categories={laws}
                active
                onSelectLaw={(title) => pushToast(`Ley seleccionada: ${title}`, 'info')}
              />
            ) : null}

            {activeTab === 'institution-panel' ? <InstitutionPanel active /> : null}
            {activeTab === 'services-panel' ? <ServicesPanel active /> : null}
            {activeTab === 'agenda-panel' ? <AgendaPanel active /> : null}

            <NewsList news={news} />

            {currentUser?.isAdmin ? (
              <AdminUsersList
                users={adminUsers}
                currentUserId={currentUser.id}
                onPromote={handlePromote}
              />
            ) : null}
          </section>
        ) : null}

        {view === 'court-cases' && selectedCourt ? (
          <section id="view-court-cases" className="view-section active">
            <div className="tribunal-header-banner">
              <div>
                <span className="case-nue-tag" id="court-header-category">
                  {selectedCourt.category}
                </span>
                <h2
                  id="court-header-title"
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.45rem',
                    color: 'var(--tsj-blue-dark)',
                    marginTop: 4
                  }}
                >
                  {selectedCourt.name}
                </h2>
                <p
                  id="court-header-desc"
                  style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 2 }}
                >
                  {selectedCourt.description}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button type="button" className="btn-main btn-outline-clean" onClick={goHome}>
                  <i className="fa-solid fa-arrow-left" /> Volver a Tribunales
                </button>
                {currentUser?.isAdmin ? (
                  <button
                    type="button"
                    className="btn-main btn-primary-clean"
                    id="btn-admin-new-case"
                    onClick={() => setView('new-case')}
                  >
                    <i className="fa-solid fa-plus" /> Nueva Causa
                  </button>
                ) : null}
              </div>
            </div>

            {!currentUser?.isAdmin ? <PublicNoticeBanner /> : null}

            <SearchBox
              value={searchTerm}
              placeholder="Buscar en este tribunal por N° de expediente (NUE), carátula, parte procesal o cédula..."
              onSearch={(term) => {
                setSearchTerm(term);
                handleSaveSearch(term);
              }}
            />

            <CasesList
              legalCases={cases}
              courtName={selectedCourt.name}
              onOpenCase={openCase}
            />
          </section>
        ) : null}

        {view === 'new-case' && selectedCourt && currentUser?.isAdmin ? (
          <section id="view-new-case" className="view-section active">
            <div className="section-headline">
              <div>
                <h2>Radicación de Nueva Causa en el TSJ</h2>
                <p id="new-case-court-subtitle">{selectedCourt.name}</p>
              </div>
              <button
                type="button"
                className="btn-main btn-outline-clean"
                onClick={() => setView('court-cases')}
              >
                <i className="fa-solid fa-arrow-left" /> Volver al Listado
              </button>
            </div>
            <NewCaseForm
              court={selectedCourt}
              onSubmit={handleCreateCase}
              onCancel={() => setView('court-cases')}
            />
          </section>
        ) : null}
      </main>

      {showAuthModal ? (
        <AuthForm
          mode={authMode}
          feedback={authFeedback}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onSwitchMode={(mode) => {
            setAuthMode(mode);
            setAuthFeedback(null);
          }}
        />
      ) : null}

      {selectedCase && !showAddActuation ? (
        <CaseDetailModal
          legalCase={selectedCase}
          courtName={selectedCourt?.name}
          canEdit={currentUser?.isAdmin ?? false}
          onClose={() => setSelectedCase(null)}
          onDelete={handleDeleteCase}
          onAddActuation={() => setShowAddActuation(true)}
        />
      ) : null}

      {selectedCase && showAddActuation && currentUser?.isAdmin ? (
        <AddActuationForm
          publicId={selectedCase.publicId}
          onSave={handleAddActuation}
          onCancel={() => {
            setShowAddActuation(false);
            openCase(selectedCase.publicId);
          }}
        />
      ) : null}

      <ToastStack toasts={toasts} />

      <VirtualAssistant />
    </>
  );
};

export default App;