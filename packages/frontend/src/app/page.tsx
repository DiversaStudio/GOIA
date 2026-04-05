import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <div className="text-5xl font-bold text-blue-600">GOIA</div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          AI Governance SaaS Platform
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 text-xl">
          Global AI Oversight Initiative - ensuring AI systems remain 
          compliant, fair, secure and accountable as regulation worldwide evolves.
        </p>
        <div className="space-x-4 pt-4">
          <Link 
            href="/dashboard" 
            className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-block"
          >
            Dashboard
          </Link>
          <Link 
            href="#features" 
            className="px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-100 inline-block"
          >
            Features
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Regulation & Compliance</h2>
            <p className="text-gray-500 text-sm">AI Systems Registry, Risk Classification, Compliance Templates</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Privacy & Data</h2>
            <p className="text-gray-500 text-sm">Data Flow Declaration, DPIA, Privacy Dashboard</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Bias & Fairness</h2>
            <p className="text-gray-500 text-sm">Fairness Assessment, Model Cards, Bias Alerts</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Observability</h2>
            <p className="text-gray-500 text-sm">Audit Logs, Evidence Vault, Health Summary</p>
          </div>
        </div>
      </div>
    </main>
  );
}
