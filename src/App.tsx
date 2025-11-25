import { useEffect, useMemo, useState } from 'react'
import CanvasEditor from './CanvasEditor'
import { dashboardClient } from './api/dashboard'
import type { DashboardSlide, DashboardTemplate, DashboardUser, ShortcutId } from './api/dashboard'

type ViewState = 'dashboard' | 'editor'

type ToastState = {
  tone: 'success' | 'error'
  message: string
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'slides', label: 'Slides' },
  { id: 'templates', label: 'Templates' },
  { id: 'assets', label: 'Assets' },
]

const shortcutCards: {
  id: ShortcutId
  title: string
  description: string
  accent: string
  icon: string
}[] = [
  {
    id: 'new-slide',
    title: 'New Slide',
    description: 'Blank 16:9 canvas',
    accent: '#a855f7',
    icon: '+',
  },
  {
    id: 'ai-slide',
    title: 'AI Slide',
    description: 'Let AI draft a slide',
    accent: '#0ea5e9',
    icon: '🤖',
  },
  {
    id: 'template-browser',
    title: 'Templates',
    description: 'Browse curated sets',
    accent: '#f97316',
    icon: '📚',
  },
]

const formatRelativeTime = (value: string) => {
  const date = new Date(value)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const App = () => {
  const [view, setView] = useState<ViewState>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [toast, setToast] = useState<ToastState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusHealthy, setStatusHealthy] = useState<boolean>(true)
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [recentSlides, setRecentSlides] = useState<DashboardSlide[]>([])
  const [templates, setTemplates] = useState<DashboardTemplate[]>([])
  const [shortcutLoading, setShortcutLoading] = useState<ShortcutId | null>(null)

  const showToast = (message: string, tone: ToastState['tone'] = 'error') => {
    setToast({ message, tone })
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3600)
    return () => clearTimeout(timer)
  }, [toast])

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)
    const [statusResult, userResult, slidesResult, templatesResult] = await Promise.allSettled([
      dashboardClient.status(),
      dashboardClient.me(),
      dashboardClient.recentSlides(6),
      dashboardClient.templates(6),
    ])

    if (statusResult.status === 'fulfilled') {
      setStatusHealthy(statusResult.value.ok)
    } else {
      setStatusHealthy(false)
      setError(statusResult.reason?.message ?? 'Unable to reach status API')
    }

    if (userResult.status === 'fulfilled') {
      setUser(userResult.value)
    } else {
      const statusCode = (userResult.reason as Error & { status?: number })?.status
      if (statusCode === 401) {
        setUser(null)
      } else {
        setError(userResult.reason?.message ?? 'Unable to load user')
      }
    }

    if (slidesResult.status === 'fulfilled') {
      setRecentSlides(slidesResult.value)
    } else {
      setError(slidesResult.reason?.message ?? 'Unable to load recent slides')
    }

    if (templatesResult.status === 'fulfilled') {
      setTemplates(templatesResult.value)
    } else {
      setError(templatesResult.reason?.message ?? 'Unable to load templates')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadDashboard().catch(() => {
      setError('Failed to load dashboard')
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error])

  const handleShortcut = async (shortcut: ShortcutId) => {
    setShortcutLoading(shortcut)
    try {
      await dashboardClient.launchShortcut(shortcut)
      if (shortcut === 'new-slide') {
        setView('editor')
      } else if (shortcut === 'ai-slide') {
        showToast('AI slide assistant is coming soon.', 'success')
        setView('editor')
      } else if (shortcut === 'template-browser') {
        document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (launchError) {
      const message =
        (launchError as Error)?.message ?? 'Unable to start shortcut. Please try again.'
      showToast(message, 'error')
    } finally {
      setShortcutLoading(null)
    }
  }

  const handleOpenSlide = (slideId: string) => {
    showToast(`Opening slide ${slideId}`, 'success')
    setView('editor')
  }

  const handleTemplatePick = (templateId: string) => {
    showToast(`Template ${templateId} ready in editor`, 'success')
    setView('editor')
  }

  const isDesktop = useMemo(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  }, [])

  if (view === 'editor') {
    return (
      <div className="editor-fullscreen">
        <button className="back-chip" onClick={() => setView('dashboard')}>
          ← Back to dashboard
        </button>
        <CanvasEditor />
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'is-collapsed' : ''}`}>
        <div className="sidebar-top">
          <button className="logo-chip" onClick={() => setView('dashboard')}>
            SS
          </button>
          {isDesktop && (
            <button
              className="collapse-toggle"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          )}
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeNav === item.id ? 'is-active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">•</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          {user?.isLoggedIn ? (
            <button className="user-chip" onClick={() => showToast('Opening account', 'success')}>
              <img src={user.avatarUrl} alt={user.name} />
              {!sidebarCollapsed && (
                <div>
                  <strong>{user.name}</strong>
                  <span>Account</span>
                </div>
              )}
            </button>
          ) : (
            <button className="primary block" onClick={() => showToast('Sign in flow coming soon')}>
              Sign in
            </button>
          )}
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="muted">Overview</p>
            <h1>Slide dashboard</h1>
          </div>
          <div className="header-actions">
            <span className={`status-pill ${statusHealthy ? 'is-up' : 'is-down'}`}>
              {statusHealthy ? 'API healthy' : 'API down'}
            </span>
            <button className="ghost" onClick={loadDashboard} disabled={loading}>
              Refresh
            </button>
            <button className="primary" onClick={() => setView('editor')}>
              Open editor
            </button>
          </div>
        </header>

        <section className="shortcut-grid">
          {shortcutCards.map((card) => (
            <button
              key={card.id}
              className="shortcut-card"
              style={{ borderColor: card.accent }}
              onClick={() => handleShortcut(card.id)}
              disabled={shortcutLoading === card.id}
            >
              <span className="shortcut-icon" style={{ background: card.accent }}>
                {shortcutLoading === card.id ? '···' : card.icon}
              </span>
              <div>
                <strong>{card.title}</strong>
                <p>{card.description}</p>
              </div>
            </button>
          ))}
        </section>

        <section className="panel-card">
          <div className="panel-card-header">
            <div>
              <h2>Recent slides</h2>
              <p className="muted small">Quick access to your latest edits.</p>
            </div>
            <button className="ghost" onClick={() => handleShortcut('new-slide')}>
              New slide
            </button>
          </div>
          <div className="recent-grid">
            {loading &&
              Array.from({ length: 6 }).map((_, index) => <div key={index} className="thumb-skeleton" />)}
            {!loading && recentSlides.length === 0 && (
              <div className="empty-state">
                <p>No slides yet. Create your first one!</p>
              </div>
            )}
            {!loading &&
              recentSlides.map((slide) => (
                <button key={slide.id} className="recent-card" onClick={() => handleOpenSlide(slide.id)}>
                  <div className="recent-thumb">
                    <img src={slide.thumbnailUrl} alt={slide.title} />
                  </div>
                  <div className="recent-meta">
                    <strong>{slide.title}</strong>
                    <span className="muted small">{formatRelativeTime(slide.updatedAt)}</span>
                  </div>
                </button>
              ))}
          </div>
        </section>

        <section id="templates-section" className="panel-card">
          <div className="panel-card-header">
            <div>
              <h2>Templates</h2>
              <p className="muted small">Jump-start with ready-made layouts.</p>
            </div>
            <button className="ghost" onClick={() => handleShortcut('template-browser')}>
              View all
            </button>
          </div>
          <div className="template-row">
            {loading &&
              Array.from({ length: 6 }).map((_, index) => <div key={index} className="thumb-skeleton" />)}
            {!loading &&
              templates.map((template) => (
                <button
                  key={template.id}
                  className="template-card"
                  onClick={() => handleTemplatePick(template.id)}
                >
                  <div className="template-thumb">
                    <img src={template.thumbnailUrl} alt={template.title} loading="lazy" />
                  </div>
                  <div className="template-meta">
                    <strong>{template.title}</strong>
                    <span>{template.category}</span>
                  </div>
                </button>
              ))}
          </div>
        </section>
      </main>

      {toast && (
        <div className={`toast ${toast.tone === 'error' ? 'is-error' : 'is-success'}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default App
