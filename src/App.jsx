import { useEffect, useState } from 'react'
import { Building2, Users, FileText, Receipt, FileUp, Home } from 'lucide-react'

const Card = ({ title, icon: Icon, description, href }) => (
  <a href={href} className="group block rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 hover:bg-slate-800/70 transition-colors">
    <div className="flex items-center gap-4">
      <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/20 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="text-blue-200/80 text-sm">{description}</p>
      </div>
    </div>
  </a>
)

function App() {
  const [backend, setBackend] = useState('Checking...')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const ping = async () => {
      try {
        const res = await fetch(baseUrl)
        const data = await res.json()
        setBackend(`Connected: ${data.message}`)
      } catch (e) {
        setBackend('Backend not reachable')
      }
    }
    ping()
  }, [])

  const features = [
    { title: 'Tenants', icon: Users, description: 'Manage tenant records, leases, and rent', href: '#' },
    { title: 'Owners', icon: Users, description: 'Track property owners and contact details', href: '#' },
    { title: 'Properties', icon: Building2, description: 'List rentals and sales with key details', href: '#' },
    { title: 'Documents', icon: FileText, description: 'Store contracts, IDs, and more', href: '#' },
    { title: 'Expenses', icon: Receipt, description: 'Record property-related expenses', href: '#' },
    { title: 'Upload', icon: FileUp, description: 'Upload files and auto-extract info', href: '/upload' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.06),transparent_30%)]" />
      <header className="relative z-10 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold">Tenant</span>
          </div>
          <nav className="text-sm text-blue-200/80">
            <a href="/test" className="hover:text-white transition-colors">Status</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Manage tenants, owners, and properties</h1>
          <p className="text-blue-200/80 max-w-2xl mx-auto">All your records and documents in one workspace. Upload spreadsheets or PDFs and keep everything organized.</p>
          <p className="text-xs text-blue-300/70 mt-3">Backend: {backend}</p>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} {...f} />
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-white font-semibold mb-3">Quick upload</h2>
          <UploadWidget baseUrl={baseUrl} />
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6 py-4 text-blue-200/70 text-sm">
          Built for real estate teams. Upload, organize, and manage with ease.
        </div>
      </footer>
    </div>
  )
}

function UploadWidget({ baseUrl }) {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setMessage('')
    setPreview(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('title', file.name)
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      setMessage('Uploaded successfully')
      setPreview(data.preview)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-6 space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-200 hover:file:bg-blue-500/30"
      />
      <button disabled={!file || loading} className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-50">
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p className="text-blue-200/80 text-sm">{message}</p>}
      {preview && (
        <pre className="whitespace-pre-wrap text-xs text-blue-200/80 bg-slate-800/60 p-3 rounded-lg max-h-64 overflow-auto">{preview}</pre>
      )}
    </form>
  )
}

export default App
