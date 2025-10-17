import { useEffect, useState } from 'react'
import axios from 'axios'
import { MapPin, Phone, Mail, Stethoscope, Search } from 'lucide-react'

interface Provider {
  id: string
  name: string
  specialty?: string | null
  address: string
  phone?: string | null
  email?: string | null
  latitude: number
  longitude: number
  available: boolean
}

export function ProvidersDirectory() {
  const [query, setQuery] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const run = async () => {
      const r = await axios.get('/api/providers', { params: { q: query || undefined, available: onlyAvailable ? 'true' : undefined }, signal: controller.signal })
      setProviders(r.data.providers)
    }
    run().catch(() => {})
    return () => controller.abort()
  }, [query, onlyAvailable])

  return (
    <div className="grid gap-6">
      <section className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">Doctors & Specialists</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Search and contact licensed providers near you. A green dot indicates currently available.</p>
        <div className="grid md:grid-cols-[1fr,200px] gap-3 items-start">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input className="input pl-9" placeholder="e.g., Cardiologist, Dermatology, Dr. Nkom" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <label className="mt-2 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} /> Show only available
            </label>
          </div>
        </div>
      </section>
      <section className="grid gap-3">
        {providers.map(p => (
          <div key={p.id} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-brand/20 flex items-center justify-center">
                  <Stethoscope className="text-brand" size={20} />
                </div>
                <span className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${p.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">{p.specialty || 'General Practitioner'}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {p.address}</div>
              </div>
            </div>
            <div className="text-right text-sm">
              {p.phone && <div className="flex items-center gap-1 justify-end"><Phone size={14}/> {p.phone}</div>}
              {p.email && <div className="flex items-center gap-1 justify-end"><Mail size={14}/> {p.email}</div>}
            </div>
          </div>
        ))}
        {providers.length === 0 && (
          <div className="text-sm text-gray-500">No providers found. Try adjusting your search.</div>
        )}
      </section>
    </div>
  )
}
