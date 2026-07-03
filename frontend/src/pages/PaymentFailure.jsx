import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 page-fade" style={{background:'#f9fafb'}}>
      <div className="bg-white border border-gray-200 p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center mx-auto mb-5">
          <XCircle size={32} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-black mb-1" style={{fontFamily:'Montserrat,sans-serif', letterSpacing:'0.05em'}}>
          Payment Failed
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Your payment could not be processed. Please try again.
        </p>
        <div className="flex gap-3">
          <Link to="/pricing" className="flex-1 py-2.5 text-sm font-bold text-white text-center transition-colors" style={{background:'#e24f4f'}}>
            Try Again
          </Link>
          <Link to="/dashboard" className="flex-1 py-2.5 text-sm font-bold text-black text-center border border-black transition-colors hover:bg-gray-50">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}