// import { useState } from 'react'
// import { authApi, paymentsApi } from '../utils/api'
// import useAuthStore from '../store/authStore'
// import toast from 'react-hot-toast'
// import { useEffect } from 'react'
// import { User, Mail, Target, Calendar, CreditCard } from 'lucide-react'
// import { formatDate, formatNPR } from '../utils/helpers'
// import { BandBadge } from '../components/ui'
// import { Link } from 'react-router-dom'
// import { cn } from '../utils/helpers'

// const planStyle = {
//   free:    'bg-surface-100 text-surface-600',
//   basic:   'bg-blue-50 text-blue-700 border border-blue-200',
//   premium: 'bg-amber-50 text-amber-700 border border-amber-200',
// }

// export default function ProfilePage() {
//   const { user, refreshUser } = useAuthStore()
//   const [form, setForm] = useState({
//     full_name: user?.full_name || '',
//     target_band: user?.target_band?.toString() || '',
//   })
//   const [saving, setSaving] = useState(false)
//   const [payments, setPayments] = useState([])

//   useEffect(() => {
//     paymentsApi.history().then(r => setPayments(r.data)).catch(() => {})
//   }, [])

//   const save = async (e) => {
//     e.preventDefault()
//     setSaving(true)
//     try {
//       await authApi.updateMe({
//         full_name: form.full_name,
//         target_band: form.target_band ? parseFloat(form.target_band) : null,
//       })
//       await refreshUser()
//       toast.success('Profile updated!')
//     } catch {
//       toast.error('Failed to update profile')
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <div className="animate-fade-in space-y-6 max-w-2xl">
//       <div>
//         <h1 className="text-2xl font-bold font-display text-surface-900">Profile</h1>
//         <p className="text-surface-500 text-sm mt-1">Manage your account and subscription.</p>
//       </div>

//       {/* Avatar & plan */}
//       <div className="card p-6 flex items-center gap-5">
//         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
//           <span className="text-white text-2xl font-bold">{user?.full_name?.[0]?.toUpperCase()}</span>
//         </div>
//         <div>
//           <p className="font-bold text-surface-900 text-lg font-display">{user?.full_name}</p>
//           <p className="text-surface-500 text-sm">{user?.email}</p>
//           <div className="flex items-center gap-2 mt-2">
//             <span className={cn('badge text-xs', planStyle[user?.plan || 'free'])}>
//               {user?.plan === 'premium' && '⭐ '}{user?.plan?.toUpperCase()} PLAN
//             </span>
//             {user?.plan === 'free' && (
//               <Link to="/pricing" className="text-xs text-brand-600 hover:underline font-medium">Upgrade →</Link>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Edit form */}
//       <div className="card p-6">
//         <h2 className="font-bold font-display text-surface-900 mb-5 text-sm">Personal Information</h2>
//         <form onSubmit={save} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
//             <div className="relative">
//               <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
//               <input
//                 value={form.full_name}
//                 onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
//                 className="input pl-9" required
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
//             <div className="relative">
//               <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
//               <input value={user?.email} disabled className="input pl-9 opacity-60 cursor-not-allowed" />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-surface-700 mb-1.5">Target Band Score</label>
//             <div className="relative">
//               <Target size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
//               <select
//                 value={form.target_band}
//                 onChange={e => setForm(p => ({ ...p, target_band: e.target.value }))}
//                 className="input pl-9 appearance-none">
//                 <option value="">Not set</option>
//                 {[5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0].map(b => (
//                   <option key={b} value={b}>{b}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="flex items-center justify-between pt-2">
//             <p className="text-xs text-surface-400">Member since {formatDate(user?.created_at)}</p>
//             <button type="submit" disabled={saving} className="btn-primary">
//               {saving ? 'Saving…' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Payment history */}
//       {payments.length > 0 && (
//         <div className="card p-6">
//           <h2 className="font-bold font-display text-surface-900 mb-4 text-sm">Payment History</h2>
//           <div className="space-y-2">
//             {payments.map((p) => (
//               <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
//                 <div>
//                   <p className="text-sm font-medium text-surface-800 capitalize">
//                     {p.gateway} Payment
//                   </p>
//                   <p className="text-xs text-surface-400">{formatDate(p.created_at)}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-sm font-semibold">{formatNPR(p.amount_npr)}</span>
//                   <span className={cn('badge text-xs',
//                     p.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
//                     p.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
//                     'bg-red-50 text-red-600 border border-red-200'
//                   )}>
//                     {p.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

import { useState, useEffect, useCallback } from 'react'
import api, { authApi, paymentsApi, subscriptionApi, enterpriseApi } from '../utils/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { User, Mail, Target, Upload, CheckCircle, Clock, AlertTriangle, Smartphone, Laptop, Monitor, Globe, LogOut, ShieldAlert, History, Pencil } from 'lucide-react'
import { formatDate, formatNPR } from '../utils/helpers'

const planStyle = {
  free:       'bg-gray-100 text-gray-500',
  premium:    'bg-amber-50 text-amber-700 border border-amber-200',
  enterprise: 'bg-green-50 text-green-700 border border-green-200'}

const paymentStatusStyle = {
  completed: 'bg-green-50 text-green-700 border border-green-200',
  pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  failed:    'bg-red-50 text-red-700 border border-red-200'}

const GATEWAYS = {
  esewa:  { label: 'eSewa',  color: '#60a040', bg: '#f0fae8', border: '#c8e6b9' },
  khalti: { label: 'Khalti', color: '#6c3096', bg: '#f5edfc', border: '#d4bce8' },
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuthStore()
  const [form, setForm] = useState({
    full_name:   user?.full_name || '',
    target_band: user?.target_band?.toString() || ''})
  const [saving, setSaving] = useState(false)
  const [payments, setPayments] = useState([])
  const [sessions, setSessions] = useState([])
  const [loginHistory, setLoginHistory] = useState([])
  const [revokingId, setRevokingId] = useState(null)
  const [revokingAll, setRevokingAll] = useState(false)

  // upload state
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedGateway, setSelectedGateway] = useState(null)
  const [selectedPlanType, setSelectedPlanType] = useState(null)
  const [myRequest, setMyRequest] = useState(null)

  // enterprise team
  const [isEnterpriseOwner, setIsEnterpriseOwner] = useState(false)
  const [teamMembers, setTeamMembers] = useState([])
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [addingMember, setAddingMember] = useState(false)
  const [removingMemberId, setRemovingMemberId] = useState(null)

  const loadSessions = async () => {
    try {
      const r = await authApi.sessions.list()
      setSessions(r.data)
    } catch {}
  }

  const loadLoginHistory = async () => {
    try {
      const r = await authApi.sessions.history()
      setLoginHistory(r.data)
    } catch {}
  }

  const refreshAll = useCallback(() => {
    loadSessions()
    loadLoginHistory()
  }, [])

  const revokeSession = async (id) => {
    setRevokingId(id)
    try {
      await authApi.sessions.revoke(id)
      toast.success('Session revoked')
      refreshAll()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to revoke session')
    } finally {
      setRevokingId(null)
    }
  }

  const revokeOtherSessions = async () => {
    setRevokingAll(true)
    try {
      const promises = sessions
        .filter(s => !s.is_current)
        .map(s => authApi.sessions.revoke(s.id).catch(() => {}))
      await Promise.all(promises)
      toast.success('All other sessions revoked')
      refreshAll()
    } catch {
      toast.error('Failed to revoke some sessions')
    } finally {
      setRevokingAll(false)
    }
  }

  useEffect(() => {
    paymentsApi.history().then(r => setPayments(r.data)).catch(() => {})
    loadMyRequest()
    loadEnterpriseStatus()
    loadTeamMembers()
    refreshAll()

    const onFocus = () => refreshAll()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) refreshAll()
    })
    const interval = setInterval(refreshAll, 30000)

    return () => {
      window.removeEventListener('focus', onFocus)
      clearInterval(interval)
    }
  }, [refreshAll])

  const deviceIcon = (name) => {
    const lower = (name || '').toLowerCase()
    if (lower.includes('iphone') || lower.includes('android') || lower.includes('mobile')) return Smartphone
    if (lower.includes('mac') || lower.includes('ipad')) return Monitor
    if (lower.includes('windows') || lower.includes('pc')) return Laptop
    return Globe
  }

  const loadMyRequest = async () => {
    try {
      const r = await subscriptionApi.myRequests()
      if (r.data?.length) setMyRequest(r.data[0])
    } catch {}
  }

  const loadEnterpriseStatus = async () => {
    try {
      const r = await api.get('/enterprise/status')
      setIsEnterpriseOwner(r.data.is_owner)
    } catch {}
  }

  const loadTeamMembers = async () => {
    try {
      const r = await enterpriseApi.members.list()
      setTeamMembers(r.data)
    } catch {}
  }

  const addMember = async () => {
    const email = newMemberEmail.trim().toLowerCase()
    if (!email) return
    setAddingMember(true)
    try {
      await enterpriseApi.members.add({ member_email: email })
      toast.success('Team member added')
      setNewMemberEmail('')
      loadTeamMembers()
    } catch (err) {
      const d = err.response?.data?.detail
      toast.error(typeof d === 'string' ? d : 'Failed to add member')
    } finally {
      setAddingMember(false)
    }
  }

  const removeMember = async (id) => {
    setRemovingMemberId(id)
    try {
      await enterpriseApi.members.remove(id)
      toast.success('Team member removed')
      loadTeamMembers()
    } catch {
      toast.error('Failed to remove member')
    } finally {
      setRemovingMemberId(null)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await subscriptionApi.uploadScreenshot(file, selectedGateway, selectedPlanType)
      toast.success('Screenshot uploaded! Awaiting admin approval.')
      loadMyRequest()
    } catch (err) {
      const status = err.response?.status
      const detail = err.response?.data?.detail
      const msg = detail
        ? (typeof detail === 'string' ? detail : Array.isArray(detail) ? detail.map(d => d.msg || d.message).join('; ') : JSON.stringify(detail))
        : `Upload failed (${status || 'network error'})`
      toast.error(msg)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authApi.updateProfile({
        full_name:   form.full_name,
        target_band: form.target_band ? parseFloat(form.target_band) : null})
      await refreshUser()
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const renderUploadForm = () => {
    if (!selectedGateway || !selectedPlanType) {
      return (
        <div>
          <p className="text-xs text-gray-500 mb-3">Choose a plan and payment method to upgrade.</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={() => setSelectedPlanType('premium')}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                selectedPlanType === 'premium'
                  ? 'bg-red-700 text-white border-red-700'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
              }`}
            >
              Premium Plan — NPR 750/month
            </button>
            <button onClick={() => setSelectedPlanType('enterprise')}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                selectedPlanType === 'enterprise'
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
              }`}
            >
              Enterprise Plan — Contact for pricing
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(GATEWAYS).map(([key, gw]) => (
              <button key={key} onClick={() => setSelectedGateway(key)}
                disabled={!selectedPlanType}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border transition-colors ${
                  !selectedPlanType ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  selectedGateway === key
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
                style={selectedGateway === key ? { background: gw.color, borderColor: gw.color } : {}}
              >
                {gw.label}
              </button>
            ))}
          </div>
          {selectedGateway && selectedPlanType && (
            <p className="text-xs text-gray-400 mt-3">
              Pay via <strong>{GATEWAYS[selectedGateway].label}</strong> for <strong>{selectedPlanType === 'enterprise' ? 'Enterprise' : 'Premium'}</strong>, then upload the screenshot below.
            </p>
          )}
        </div>
      )
    }

    const gw = GATEWAYS[selectedGateway]

    return (
      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {selectedPlanType === 'enterprise' ? 'Enterprise' : 'Premium'}
          </span>
          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {gw.label}
          </span>
          <button onClick={() => { setSelectedGateway(null); setSelectedPlanType(null) }}
            className="text-xs text-red-700 underline ml-auto"
          >
            Change
          </button>
        </div>
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-5 text-center">
          <input type="file" accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleUpload} className="hidden" id="profile-screenshot-upload"
          />
          <label htmlFor="profile-screenshot-upload"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white cursor-pointer transition-all active:scale-95 ${
              uploading ? 'opacity-60 cursor-wait' : 'hover:opacity-90'
            }`}
            style={{ background: gw.color }}
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {uploading ? 'Uploading…' : 'Upload Payment Screenshot'}
          </label>
          <p className="text-xs text-gray-400 mt-2">
            Pay via {gw.label} first, then upload the confirmation screenshot here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="space-y-6 max-w-2xl page-fade"
      
    >
      {/* ── Page title ── */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-red-700 mb-1">Account</p>
        <h1
          className="text-2xl font-bold text-gray-900"
          
        >
          Profile
        </h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account and subscription.</p>
      </div>

      {/* ── Avatar & plan ── */}
      <div className="bg-white border border-gray-100 p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-lg bg-red-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl font-bold">
            {user?.full_name?.[0]?.toUpperCase()}
          </span>
        </div>
        <div>
          <p
            className="font-bold text-gray-900 text-base leading-tight"
            
          >
            {user?.full_name}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${planStyle[user?.plan || 'free']}`}
            >
              {(user?.plan === 'premium' || user?.plan === 'enterprise') ? '⭐ ' : ''}
              {user?.plan === 'enterprise' ? 'ENTERPRISE' : user?.plan?.toUpperCase() || 'FREE'} PLAN
            </span>
            {user?.plan === 'free' && (
              <span className="text-xs text-red-700 font-semibold">
                Free Plan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Upgrade / Subscription Request ── */}
      <div className="bg-white border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">
          {myRequest ? 'Subscription Request' : 'Upgrade Your Plan'}
        </h2>

        {myRequest?.status === 'pending' ? (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
            <Clock size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Pending Review</p>
              <p className="text-xs text-gray-500 mt-1">
                Your upgrade request is waiting for admin approval{myRequest.gateway ? ` (${myRequest.gateway})` : ''}.
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {myRequest.plan_type === 'enterprise' ? 'Enterprise' : 'Premium'} plan · Submitted {myRequest.created_at ? new Date(myRequest.created_at).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
        ) : user?.plan === 'free' ? (
          <div>
            {myRequest?.status === 'approved' && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                <CheckCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-blue-800">Previously Approved</p>
                  <p className="text-xs text-gray-500 mt-1">Your account was previously upgraded but has been reset. Submit a new request to upgrade again.</p>
                </div>
              </div>
            )}
            {myRequest?.status === 'rejected' && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
                <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">Rejected</p>
                  <p className="text-xs text-gray-500 mt-1">Your previous request was rejected. You can try again.</p>
                </div>
              </div>
            )}
            {renderUploadForm()}
          </div>
        ) : myRequest?.status === 'approved' ? (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-800">Approved ✓</p>
              <p className="text-xs text-gray-500 mt-1">Your account has been upgraded to {myRequest.plan_type === 'enterprise' ? 'Enterprise' : myRequest.plan_type}. Welcome!</p>
            </div>
          </div>
        ) : myRequest?.status === 'rejected' ? (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800">Rejected</p>
              <p className="text-xs text-gray-500 mt-1">Your previous request was rejected.</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400">You are on the <strong>{user?.plan}</strong> plan.</p>
        )}
      </div>

      {/* ── DEBUG ── */}
      <div className="bg-yellow-50 border border-yellow-300 p-3 rounded text-xs">
        plan=<strong>{user?.plan}</strong> | is_enterprise_owner=<strong>{String(user?.is_enterprise_owner)}</strong> | email=<strong>{user?.email}</strong> | teamMembers=<strong>{teamMembers.length}</strong>
      </div>

      {/* ── Enterprise member info (sub-accounts) ── */}
      {user?.plan === 'enterprise' && !isEnterpriseOwner && (
        <div className="bg-white border border-gray-100 p-6">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-800">Enterprise Access</p>
              <p className="text-xs text-gray-500 mt-1">
                You have access through an enterprise account. Only the enterprise account owner can manage team members.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Enterprise Team Members (owner only) ── */}
      {isEnterpriseOwner && (
        <div className="bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Team Members</h2>
            <span className="text-xs text-gray-400">{teamMembers.length} / 10</span>
          </div>

          {teamMembers.length > 0 && (
            <div className="flex flex-col mb-4">
              {teamMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                      <Mail size={13} className="text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{m.member_email}</span>
                  </div>
                  <button
                    onClick={() => removeMember(m.id)}
                    disabled={removingMemberId === m.id}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                  >
                    {removingMemberId === m.id ? '…' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {teamMembers.length < 10 && (
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={newMemberEmail}
                onChange={e => setNewMemberEmail(e.target.value)}
                placeholder="Enter Gmail address"
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-400 transition-colors"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMember())}
              />
              <button
                onClick={addMember}
                disabled={addingMember || !newMemberEmail.trim()}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-green-700 hover:bg-green-800 disabled:opacity-50 transition-colors"
              >
                {addingMember ? '…' : 'Add'}
              </button>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3">
            Add up to 10 Gmail accounts to share your Enterprise access. Members will automatically get Enterprise plan when they log in.
          </p>
        </div>
      )}

      {/* ── Personal Information (click to edit) ── */}
      <div className="bg-white border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-900">Personal Information</h2>
          {!editing && (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 transition-colors"
            >
              <Pencil size={13} />
              Edit
            </button>
          )}
        </div>

        {!editing ? (
          /* ── View mode ── */
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <User size={14} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{user?.full_name || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <Mail size={14} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-gray-700">{user?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target size={14} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Target Band Score</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.target_band ? `Band ${user.target_band}` : 'Not set'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 pt-3">Member since {formatDate(user?.created_at)}</p>
          </div>
        ) : (
          /* ── Edit mode ── */
          <form onSubmit={(e) => { e.preventDefault(); save(e); setEditing(false) }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input value={user?.email} disabled
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-100 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Band Score</label>
              <div className="relative">
                <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={form.target_band} onChange={e => setForm(p => ({ ...p, target_band: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-900 appearance-none focus:outline-none focus:border-red-400 transition-colors bg-white">
                  <option value="">Not set</option>
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => { setEditing(false); setForm({ full_name: user?.full_name || '', target_band: user?.target_band?.toString() || '' }) }}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 transition-colors">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Payment history ── */}
      {payments.length > 0 && (
        <div className="bg-white border border-gray-100 p-6">
          <h2
            className="text-sm font-bold text-gray-900 mb-4"
            
          >
            Payment History
          </h2>
          <div className="flex flex-col">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800 capitalize">
                    {p.gateway} Payment
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(p.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">
                    {formatNPR(p.amount_npr)}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      paymentStatusStyle[p.status] || paymentStatusStyle.failed
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Login History ── */}
      {loginHistory.length > 0 && (
        <div className="bg-white border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <History size={14} className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">Login History</h2>
            <span className="text-xs text-gray-400 ml-auto">Last 50 logins</span>
          </div>
          <div className="flex flex-col">
            {loginHistory.map((s) => {
              const Icon = deviceIcon(s.device_name)
              const isLoggedOut = !s.is_active && s.id !== sessions.find(act => act.id === s.id)?.id
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 truncate">
                        {s.device_name || 'Unknown Device'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {s.ip_address ? `${s.ip_address} · ` : ''}
                        {new Date(s.created_at).toLocaleString()}
                        {isLoggedOut && s.last_accessed_at && (
                          <> · logged out {new Date(s.last_accessed_at).toLocaleString()}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium flex-shrink-0 ${s.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                    {s.is_active ? 'Active' : 'Logged out'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}