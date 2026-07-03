import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { paymentsApi } from '../utils/api'
import useAuthStore from '../store/authStore'
import { LoadingScreen } from '../components/ui'
import { CheckCircle, XCircle } from 'lucide-react'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const { refreshUser } = useAuthStore()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      const gateway = params.get('gateway')
      const paymentId = params.get('payment_id')

      try {
        if (gateway === 'esewa') {
          const data = params.get('data')
          if (!data || !paymentId) throw new Error('Missing eSewa params')
          await paymentsApi.verifyEsewa(paymentId, { data })
          setStatus('success')
          setMessage('eSewa payment verified!')
        } else if (gateway === 'khalti') {
          const pidx = params.get('pidx')
          const khaltiStatus = params.get('status')
          if (!pidx || !paymentId || khaltiStatus === 'Failed' || khaltiStatus === 'User canceled') {
            window.location.href = `/payment/failure`
            return
          }
          await paymentsApi.verifyKhalti(pidx, paymentId)
          setStatus('success')
          setMessage('Khalti payment verified!')
        } else {
          setStatus('failed')
          setMessage('Unknown payment gateway')
          return
        }
        await refreshUser()
        sessionStorage.removeItem('esewa_payment_id')
        sessionStorage.removeItem('khalti_payment_id')
      } catch (err) {
        setStatus('failed')
        setMessage(err.response?.data?.detail || err.message || 'Verification failed')
      }
    }
    verify()
  }, [])

  if (status === 'verifying') return <LoadingScreen message="Verifying your payment…" />

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 page-fade" style={{background:'#f9fafb'}}>
      <div className="bg-white border border-gray-200 p-10 max-w-md w-full text-center shadow-sm">
        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-black" />
            </div>
            <h2 className="text-lg font-bold text-black mb-1" style={{fontFamily:'Montserrat,sans-serif', letterSpacing:'0.05em'}}>
              Payment Successful!
            </h2>
            <p className="text-sm text-gray-600 mb-2">{message}</p>
            <p className="text-xs text-gray-400 mb-8">Your plan has been upgraded. Happy practicing!</p>
            <div className="flex gap-3">
              <Link to="/tests" className="flex-1 py-2.5 text-sm font-bold text-white text-center transition-colors" style={{background:'#e24f4f'}}>Start Practicing</Link>
              <Link to="/dashboard" className="flex-1 py-2.5 text-sm font-bold text-black text-center border border-black transition-colors hover:bg-gray-50">Dashboard</Link>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center mx-auto mb-5">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-black mb-1" style={{fontFamily:'Montserrat,sans-serif', letterSpacing:'0.05em'}}>
              Payment Failed
            </h2>
            <p className="text-sm text-gray-500 mb-8">{message}</p>
            <div className="flex gap-3">
              <Link to="/pricing" className="flex-1 py-2.5 text-sm font-bold text-white text-center transition-colors" style={{background:'#e24f4f'}}>Try Again</Link>
              <Link to="/dashboard" className="flex-1 py-2.5 text-sm font-bold text-black text-center border border-black transition-colors hover:bg-gray-50">Dashboard</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
