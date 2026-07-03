import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Background decorative circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-[0.04]"
             style={{ background: '#CC0000' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.04]"
             style={{ background: '#002147' }} />
      </div>

      <div className="relative max-w-lg w-full text-center">
        {/* Large 404 */}
        <div className="mb-2 select-none">
          <span className="text-[140px] sm:text-[180px] font-black leading-none tracking-tight"
                style={{ color: '#CC0000' }}>
            4
          </span>
          <span className="text-[140px] sm:text-[180px] font-black leading-none tracking-tight"
                style={{ color: '#002147' }}>
            0
          </span>
          <span className="text-[140px] sm:text-[180px] font-black leading-none tracking-tight"
                style={{ color: '#CC0000' }}>
            4
          </span>
        </div>

        {/* Decorative line */}
        <div className="w-16 h-1 mx-auto mb-6 rounded-full"
             style={{ background: 'linear-gradient(90deg, #CC0000, #002147)' }} />

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-md shadow-red-900/20 transition-all hover:brightness-110 active:scale-[0.97]"
            style={{ background: '#CC0000' }}
          >
            <Home size={15} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.97]"
            style={{ color: '#002147', border: '1.5px solid #002147' }}
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
        </div>

        {/* Help text */}
        <p className="mt-10 text-xs text-gray-300 flex items-center justify-center gap-1.5">
          <Search size={11} />
          Try checking the URL or use the navigation menu
        </p>
      </div>
    </div>
  )
}
