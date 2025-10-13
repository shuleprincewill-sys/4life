import { BarChart2, TrendingUp, Bell } from 'lucide-react'

export function AdminDashboard() {
  return (
    <div className="grid gap-6">
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Active Pharmacies</div>
          <div className="text-2xl font-semibold">12</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Drugs in Demand</div>
          <div className="text-2xl font-semibold">Artemisinin, Paracetamol</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Avg. Fulfillment Time</div>
          <div className="text-2xl font-semibold">8 mins</div>
        </div>
      </section>
      <section className="card p-6">
        <div className="flex items-center gap-2 mb-4"><BarChart2 /> <h2 className="font-semibold">Regional Trends</h2></div>
        <div className="h-48 bg-gradient-to-r from-brand/10 to-brand/30 rounded-md" />
      </section>
      <section className="card p-6">
        <div className="flex items-center gap-2 mb-4"><Bell /> <h2 className="font-semibold">Notifications</h2></div>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
          <li>Low stock alerts enabled for all verified pharmacies</li>
          <li>Weekly demand summary sent to Ministry of Health</li>
        </ul>
      </section>
    </div>
  )
}
