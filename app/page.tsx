'use client'
import { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  async function runSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    const params = new URLSearchParams(formData as any);
    const res = await fetch(`/api/search?${params.toString()}`);
    const json = await res.json();
    setResults(json.results);
    setLoading(false);
  }

  return (
    <main className="p-6 grid gap-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">OwnerIntel</h1>
      <form onSubmit={runSearch} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="grid gap-1">
          <span>County</span>
          <input name="county" className="border rounded p-2" placeholder="Onondaga, NY" />
        </label>
        <label className="grid gap-1">
          <span>Min Units</span>
          <input name="minUnits" type="number" className="border rounded p-2" defaultValue={5} />
        </label>
        <label className="grid gap-1">
          <span>Years Owned ≥</span>
          <input name="yearsOwned" type="number" className="border rounded p-2" defaultValue={10} />
        </label>
        <label className="grid gap-1">
          <span>No Refi in (yrs)</span>
          <input name="noRefiYears" type="number" className="border rounded p-2" defaultValue={10} />
        </label>
        <button className="col-span-2 md:col-span-4 bg-black text-white rounded p-2" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th>Property</th>
              <th>Owner</th>
              <th>Units</th>
              <th>Years Owned</th>
              <th>Years Since Refi</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{r.situsAddress}, {r.city}</td>
                <td>{r.ownerName}</td>
                <td>{r.units ?? '—'}</td>
                <td>{r.yearsOwned ?? '—'}</td>
                <td>{r.yearsSinceMortgage ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action="/api/export" method="POST">
        <button className="border rounded p-2">Export CSV</button>
      </form>
    </main>
  )
}
