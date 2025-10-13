import { useState } from 'react'
import axios from 'axios'
import { CheckCircle2, Upload } from 'lucide-react'

export function PharmacyOnboarding() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get('name'),
      licenseNumber: form.get('licenseNumber'),
      phone: form.get('phone'),
      address: form.get('address'),
    }
    // Placeholder: send to backend onboarding endpoint in future
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center grid gap-3">
        <CheckCircle2 className="mx-auto text-green-600" size={40} />
        <h2 className="text-xl font-semibold">Thanks for your interest!</h2>
        <p className="text-gray-600 dark:text-gray-400">Our team will reach out within 48 hours to verify your pharmacy.</p>
      </div>
    )
  }

  return (
    <form className="card p-6 grid gap-4" onSubmit={onSubmit}>
      <h1 className="text-2xl font-semibold">Pharmacy Onboarding</h1>
      <p className="text-gray-600 dark:text-gray-400">Provide basic details to begin the verification process.</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Pharmacy Name</label>
          <input className="input" name="name" required />
        </div>
        <div>
          <label className="text-sm">License Number</label>
          <input className="input" name="licenseNumber" required />
        </div>
        <div>
          <label className="text-sm">Phone</label>
          <input className="input" name="phone" required />
        </div>
        <div>
          <label className="text-sm">Address</label>
          <input className="input" name="address" required />
        </div>
      </div>
      <div>
        <label className="text-sm">Upload License (optional)</label>
        <div className="border rounded-md p-4 text-sm text-gray-500 flex items-center gap-2"><Upload size={16}/> Drag & drop or click to upload</div>
      </div>
      <div className="flex justify-end">
        <button className="btn" type="submit">Submit</button>
      </div>
    </form>
  )
}
