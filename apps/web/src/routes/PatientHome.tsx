import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { MapPin, Search, Loader2 } from 'lucide-react'

interface Drug { id: string; name: string; description?: string | null }
interface Pharmacy { id: string; name: string; latitude: number; longitude: number; address: string; }
interface InventoryResult { id: string; priceCfa: number; stock: number; distanceKm: number; pharmacy: Pharmacy; drug: Drug }

export function PatientHome() {
  const [query, setQuery] = useState('')
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [selectedDrugId, setSelectedDrugId] = useState<string | null>(null)
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null)
  const [results, setResults] = useState<InventoryResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) { setDrugs([]); return }
    const controller = new AbortController()
    const run = async () => {
      const r = await axios.get('/api/drugs/search', { params: { q: query }, signal: controller.signal })
      setDrugs(r.data.drugs)
    }
    run().catch(() => {})
    return () => controller.abort()
  }, [query])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    })
  }, [])

  const onFindNearby = async () => {
    if (!coords || !selectedDrugId) return
    setLoading(true)
    try {
      const r = await axios.get('/api/inventory/nearby', { params: { drugId: selectedDrugId, lat: coords.lat, lng: coords.lng, radiusKm: 25 } })
      setResults(r.data.results)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <section className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">Find your medicine</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Search by name and locate pharmacies near you with real-time stock and pricing.</p>
        <div className="grid md:grid-cols-[1fr,200px] gap-3">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input className="input pl-9" placeholder="e.g., Paracetamol" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            {drugs.length > 0 && (
              <div className="mt-2 border rounded-md max-h-48 overflow-auto divide-y">
                {drugs.map(d => (
                  <button key={d.id} className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedDrugId === d.id ? 'bg-gray-50 dark:bg-gray-800' : ''}`} onClick={() => setSelectedDrugId(d.id)}>
                    <div className="font-medium">{d.name}</div>
                    {d.description && <div className="text-xs text-gray-500">{d.description}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn" onClick={onFindNearby} disabled={!coords || !selectedDrugId || loading}>
            {loading ? <Loader2 className="animate-spin" size={16}/> : <MapPin size={16}/>} Find Nearby
          </button>
        </div>
      </section>
      {results.length > 0 && (
        <section className="grid gap-3">
          {results.map(r => (
            <div key={r.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{r.pharmacy.name}</div>
                <div className="text-sm text-gray-500">{r.pharmacy.address}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{r.distanceKm.toFixed(1)} km</div>
                <div className="text-lg font-semibold">{r.priceCfa.toLocaleString()} XAF</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
