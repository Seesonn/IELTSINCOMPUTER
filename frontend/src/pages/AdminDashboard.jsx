import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import api from '../utils/api'
import { subscriptionApi, adminPlansApi } from '../utils/api'
import { LoadingScreen } from '../components/ui'
import { Search, Users, Shield, CheckCircle, XCircle, Clock, ExternalLink, X, User, Edit, Trash2, RefreshCw, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = [
  { key: 'users',    label: 'Users',     icon: Users },
  { key: 'requests', label: 'Requests',  icon: Shield },
  { key: 'plans',    label: 'Plans',     icon: DollarSign },
]

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState('users')
  const [message, setMessage] = useState(null)

  // ── Users ──
  const [users, setUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [actioning, setActioning] = useState(null)

  // ── Requests ──
  const [requests, setRequests] = useState([])
  const [reqSearch, setReqSearch] = useState('')
  const [reqLoading, setReqLoading] = useState(false)
  const [processing, setProcessing] = useState(null)
  const [previewReq, setPreviewReq] = useState(null)
  const [editReq, setEditReq] = useState(null)
  const [editForm, setEditForm] = useState({ gateway: '', plan_type: '', status: '' })
  const [deleteReq, setDeleteReq] = useState(null)
  const [saving, setSaving] = useState(false)

  // ── Plans ──
  const [plans, setPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(false)
  const [editPlan, setEditPlan] = useState(null)
  const [editPlanForm, setEditPlanForm] = useState({ name: '', plan_type: '', price_npr: 0, duration_days: 30, features: '', is_active: true })
  const [planSaving, setPlanSaving] = useState(false)

  // ── Fetch helpers ──

  const fetchUsers = () => {
    setLoading(true)
    api.get('/admin/users')
      .then(r => setUsers(r.data))
      .catch(err => {
        const detail = err.response?.data?.detail || err.message
        setMessage(`Failed to load users: ${detail}`)
      })
      .finally(() => setLoading(false))
  }

  const fetchRequests = () => {
    setReqLoading(true)
    subscriptionApi.adminList()
      .then(r => setRequests(r.data))
      .catch(err => {
        const detail = err.response?.data?.detail || err.message
        setMessage(`Failed to load requests: ${detail}`)
      })
      .finally(() => setReqLoading(false))
  }

  const fetchPlans = () => {
    setPlansLoading(true)
    adminPlansApi.list()
      .then(r => setPlans(r.data))
      .catch(err => {
        const detail = err.response?.data?.detail || err.message
        setMessage(`Failed to load plans: ${detail}`)
      })
      .finally(() => setPlansLoading(false))
  }

  const fetchByTab = (t) => {
    if (t === 'users') fetchUsers()
    else if (t === 'requests') fetchRequests()
    else if (t === 'plans') fetchPlans()
  }

  useEffect(() => { fetchByTab(tab) }, [tab])

  // ── User actions ──

  const toggleActive = async (userId) => {
    setActioning(userId)
    try { await api.put(`/admin/users/${userId}/toggle-active`); fetchUsers() }
    catch { setMessage('Failed to toggle active') }
    finally { setActioning(null) }
  }

  const toggleVerify = async (userId) => {
    setActioning(userId)
    try { await api.put(`/admin/users/${userId}/toggle-verify`); fetchUsers() }
    catch { setMessage('Failed to toggle verify') }
    finally { setActioning(null) }
  }

  const updatePlan = async (userId, plan) => {
    setActioning(userId)
    try { await api.put(`/admin/users/${userId}/plan`, { plan }); fetchUsers() }
    catch (err) {
      const detail = err.response?.data?.detail || err.message
      setMessage(`Failed to update plan: ${detail}`)
      console.error('Update plan error:', err.response?.data)
    }
    finally { setActioning(null) }
  }

  const updateRole = async (userId, role) => {
    setActioning(userId)
    try { await api.put(`/admin/users/${userId}/role`, { role }); fetchUsers() }
    catch { setMessage('Failed to update role') }
    finally { setActioning(null) }
  }

  // ── Request actions ──

  const handleApprove = async (reqId) => {
    setProcessing(reqId)
    try { await subscriptionApi.approve(reqId); fetchRequests() }
    catch { setMessage('Failed to approve') }
    finally { setProcessing(null) }
  }

  const handleReject = async (reqId) => {
    setProcessing(reqId)
    try { await subscriptionApi.reject(reqId); fetchRequests() }
    catch { setMessage('Failed to reject') }
    finally { setProcessing(null) }
  }

  const openEdit = (req) => {
    setEditReq(req)
    setEditForm({ gateway: req.gateway || '', plan_type: req.plan_type || 'premium', status: req.status })
  }

  const handleEditSave = async () => {
    const reqId = editReq?.id
    if (!reqId) return
    setSaving(true)
    try {
      const payload = {}
      if (editForm.gateway) payload.gateway = editForm.gateway
      if (editForm.plan_type) payload.plan_type = editForm.plan_type
      if (editForm.status) payload.status = editForm.status
      await subscriptionApi.update(reqId, payload)
      fetchRequests(); setEditReq(null)
    } catch (err) {
      const d = err.response?.data?.detail
      const s = err.response?.status
      setMessage(s === 404 ? `Request #${editReq?.id} not found.` : typeof d === 'string' ? d : 'Failed to update')
    } finally { setSaving(false) }
  }

  const handleDelete = async (reqId) => {
    setProcessing(reqId)
    try { await subscriptionApi.delete(reqId); fetchRequests(); setDeleteReq(null) }
    catch { setMessage('Failed to delete') }
    finally { setProcessing(null) }
  }

  // ── Plan actions ──

  const openEditPlan = (plan) => {
    setEditPlan(plan)
    setEditPlanForm({
      name: plan.name || '',
      plan_type: plan.plan_type || 'free',
      price_npr: plan.price_npr || 0,
      duration_days: plan.duration_days || 30,
      features: Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || ''),
      is_active: plan.is_active ?? true,
    })
  }

  const handlePlanSave = async () => {
    if (!editPlan) return
    setPlanSaving(true)
    try {
      const payload = {
        name: editPlanForm.name,
        price_npr: parseInt(editPlanForm.price_npr) || 0,
        duration_days: parseInt(editPlanForm.duration_days) || 30,
        features: editPlanForm.features ? editPlanForm.features.split('\n').map(s => s.trim()).filter(Boolean) : [],
        plan_type: editPlanForm.plan_type,
        is_active: editPlanForm.is_active,
      }
      await adminPlansApi.update(editPlan.id, payload)
      toast.success('Plan updated')
      fetchPlans(); setEditPlan(null)
    } catch (err) {
      const d = err.response?.data?.detail
      toast.error(typeof d === 'string' ? d : 'Failed to update plan')
    } finally { setPlanSaving(false) }
  }

  // ── Shared ──

  const q = s => s?.toLowerCase() || ''
  const filteredUsers = users
    .filter(u => planFilter === 'all' || u.plan === planFilter)
    .filter(u => !userSearch || q(u.full_name).includes(q(userSearch)) || q(u.email).includes(q(userSearch)))
  const filteredRequests = requests
    .filter(r => !reqSearch || q(r.user_name).includes(q(reqSearch)) || q(r.email).includes(q(reqSearch)))

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage users and subscription requests
          </p>
        </div>
        <button
          onClick={() => fetchByTab(tab)}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* ── Message ── */}
      {message && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-none flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-none w-fit flex-wrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-sm font-semibold transition-colors ${
              tab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          USERS TAB
         ══════════════════════════════════════════════════ */}
      {tab === 'users' && (
        <>
          {loading ? (
            <LoadingScreen message="Loading users…" />
          ) : (
            <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
              <div className="relative border-b border-gray-100">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-red-50/30">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan:</span>
                {['all', 'free', 'premium', 'enterprise'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlanFilter(p)}
                    className={`text-xs font-semibold px-3 py-1 rounded-none border transition-colors ${
                      planFilter === p
                        ? p === 'all' ? 'bg-gray-800 text-white border-gray-800'
                          : p === 'free' ? 'bg-gray-100 text-gray-600 border-gray-300'
                          : p === 'enterprise' ? 'bg-green-50 text-green-700 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-white text-gray-400 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {p === 'all' ? 'All' : p === 'enterprise' ? 'Enterprise' : p.charAt(0).toUpperCase() + p.slice(1)}
                    <span className="ml-1 opacity-60">
                      ({p === 'all' ? users.length : users.filter(u => u.plan === p).length})
                    </span>
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3 font-semibold">ID</th>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Role</th>
                      <th className="px-4 py-3 font-semibold">Plan</th>
                      <th className="px-4 py-3 font-semibold">Joined</th>
                      <th className="px-4 py-3 font-semibold">Active</th>
                      <th className="px-4 py-3 font-semibold">Verified</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{u.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{u.full_name}</td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role}
                            onChange={e => updateRole(u.id, e.target.value)}
                            disabled={actioning === u.id}
                            className={`text-xs font-semibold  px-2 py-1 border ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            <option value="student">student</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={u.plan}
                            onChange={e => updatePlan(u.id, e.target.value)}
                            disabled={actioning === u.id}
                            className={`text-xs font-semibold  px-2 py-1 border ${
                              u.plan === 'premium' ? 'bg-red-50 text-red-700 border-red-200'
                              : u.plan === 'enterprise' ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}
                          >
                            <option value="free">free</option>
                            <option value="premium">premium</option>
                            <option value="enterprise">enterprise</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleActive(u.id)}
                            disabled={actioning === u.id}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-none border transition-colors ${
                              u.is_active
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            {u.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleVerify(u.id)}
                            disabled={actioning === u.id}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-none border transition-colors ${
                              u.is_verified
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                            }`}
                          >
                            {u.is_verified ? 'Verified' : 'Unverified'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          {actioning === u.id && (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-none animate-spin" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No users found.</div>
              )}
            </div>
          )}
          <p className="text-xs text-gray-400">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} {planFilter !== 'all' && <span className="text-gray-400">on <strong>{planFilter}</strong> plan</span>}
          </p>
        </>
      )}

      {/* ══════════════════════════════════════════════════
          REQUESTS TAB
         ══════════════════════════════════════════════════ */}
      {tab === 'requests' && (
        <>
          {reqLoading ? (
            <LoadingScreen message="Loading requests…" />
          ) : (
            <div className="space-y-6">
              {/* ── Summary cards ── */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total', count: requests.length, icon: Shield, cls: 'bg-white border-gray-200 text-gray-700' },
                  { label: 'Pending', count: requests.filter(r => r.status === 'pending').length, icon: Clock, cls: 'bg-amber-50 border-amber-200 text-amber-700' },
                  { label: 'Approved', count: requests.filter(r => r.status === 'approved').length, icon: CheckCircle, cls: 'bg-green-50 border-green-200 text-green-700' },
                  { label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length, icon: XCircle, cls: 'bg-red-50 border-red-200 text-red-700' },
                ].map(s => (
                  <div key={s.label} className={`flex items-center gap-3 px-4 py-3 rounded-none border ${s.cls}`}>
                    <s.icon size={18} />
                    <div>
                      <p className="text-xs font-semibold opacity-70">{s.label}</p>
                      <p className="text-lg font-bold">{s.count}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Search ── */}
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={reqSearch}
                  onChange={e => setReqSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-none focus:outline-none focus:border-red-300 transition-colors"
                />
              </div>

              {/* ── Grouped tables ── */}
              {[
                { key: 'pending', label: 'Pending', icon: Clock, headerCls: 'bg-amber-50 border-amber-200 text-amber-700', iconCls: 'text-amber-600' },
                { key: 'approved', label: 'Approved', icon: CheckCircle, headerCls: 'bg-green-50 border-green-200 text-green-700', iconCls: 'text-green-600' },
                { key: 'rejected', label: 'Rejected', icon: XCircle, headerCls: 'bg-red-50 border-red-200 text-red-700', iconCls: 'text-red-600' },
              ].map(group => {
                const items = filteredRequests.filter(r => r.status === group.key)
                if (items.length === 0) return null
                return (
                  <div key={group.key} className="bg-white border border-gray-200 rounded-none overflow-hidden shadow-sm">
                    <div className={`flex items-center gap-2 px-4 py-3 border-b ${group.headerCls}`}>
                      <group.icon size={15} className={group.iconCls} />
                      <span className="text-sm font-bold">{group.label}</span>
                      <span className="text-xs font-semibold opacity-60 ml-auto">{group.count} request{group.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                            <th className="px-4 py-3 font-semibold">ID</th>
                            <th className="px-4 py-3 font-semibold">User</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Current</th>
                            <th className="px-4 py-3 font-semibold">Gateway</th>
                            <th className="px-4 py-3 font-semibold">Req. Plan</th>
                            <th className="px-4 py-3 font-semibold">Screenshot</th>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {items.map(req => (
                            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-gray-400 font-mono text-xs">{req.id}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-none bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                    {req.user_name?.[0]?.toUpperCase() || '?'}
                                  </div>
                                  <span className="font-medium text-gray-900 text-sm">{req.user_name || '—'}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-xs">{req.email}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-none border ${
                                  req.user_current_plan === 'premium' ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : req.user_current_plan === 'enterprise' ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-gray-50 text-gray-500 border-gray-200'
                                }`}>
                                  {req.user_current_plan || '—'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {req.gateway ? (
                                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-none border ${
                                    req.gateway === 'esewa' ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-purple-50 text-purple-700 border-purple-200'
                                  }`}>
                                    {req.gateway}
                                  </span>
                                ) : <span className="text-xs text-gray-300">—</span>}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-none border bg-red-50 text-red-700 border-red-200">
                                  {req.plan_type}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <button onClick={() => setPreviewReq(req)} className="group block">
                                  <img
                                    src={req.screenshot_path}
                                    alt="Screenshot"
                                    className="w-14 h-10 object-cover  border border-gray-200 group-hover:border-red-400 group-hover:shadow-md transition-all"
                                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                                  />
                                  <div className="w-14 h-10  border border-gray-200 bg-gray-50 text-gray-300 text-[10px] items-center justify-center hidden">
                                    No image
                                  </div>
                                </button>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                                {new Date(req.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                {req.status === 'pending' ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleApprove(req.id)}
                                      disabled={!!processing}
                                      className="text-xs font-semibold px-2.5 py-1  bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50 transition-colors"
                                    >
                                      {processing === req.id ? '…' : 'Approve'}
                                    </button>
                                    <button
                                      onClick={() => handleReject(req.id)}
                                      disabled={!!processing}
                                      className="text-xs font-semibold px-2.5 py-1  bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
                                    >
                                      {processing === req.id ? '…' : 'Reject'}
                                    </button>
                                    <button
                                      onClick={() => openEdit(req)}
                                      className="p-1.5  text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Edit"
                                    >
                                      <Edit size={13} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => openEdit(req)}
                                      className="p-1.5  text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Edit"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      onClick={() => setDeleteReq(req)}
                                      className="p-1.5  text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}

              {filteredRequests.length === 0 && (
                <div className="text-center py-16 bg-white border border-gray-200 rounded-none">
                  <Shield size={32} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400 font-medium">No subscription requests found</p>
                  <p className="text-xs text-gray-300 mt-1">Requests will appear here once users submit them.</p>
                </div>
              )}
            </div>
          )}

          {/* Request modals (preview, edit, delete) */}
          {previewReq && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewReq(null)}>
              <button onClick={() => setPreviewReq(null)} className="absolute top-4 right-4 p-2 rounded-none bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors z-10"><X size={20} /></button>
              <img src={previewReq.screenshot_path} alt="Payment screenshot" className="max-w-full max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
            </div>
          )}

          {editReq && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditReq(null)}>
              <div className="relative w-full max-w-md bg-white rounded-none overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800">Edit Request #{editReq.id}</h3>
                  <button onClick={() => setEditReq(null)} className="p-1 rounded-none hover:bg-gray-100"><X size={16} className="text-gray-400" /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Gateway</label>
                    <select value={editForm.gateway} onChange={e => setEditForm(f => ({ ...f, gateway: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:border-red-700">
                      <option value="">None</option><option value="esewa">eSewa</option><option value="khalti">Khalti</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Plan Type</label>
                    <select value={editForm.plan_type} onChange={e => setEditForm(f => ({ ...f, plan_type: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:border-red-700">
                      <option value="free">Free</option><option value="premium">Premium</option><option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                    <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:border-red-700">
                      <option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <button onClick={() => setEditReq(null)} className="text-xs font-semibold px-4 py-2 rounded-none border border-gray-200 text-gray-600 hover:bg-gray-100">Cancel</button>
                  <button onClick={handleEditSave} disabled={saving} className="text-xs font-semibold px-4 py-2 rounded-none bg-red-700 text-white hover:bg-red-800 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
                </div>
              </div>
            </div>
          )}

          {deleteReq && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteReq(null)}>
              <div className="relative w-full max-w-sm bg-white rounded-none overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-none bg-red-50 flex items-center justify-center"><Trash2 size={20} className="text-red-500" /></div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">Delete Request</h3>
                  <p className="text-sm text-gray-500 mb-1">Are you sure you want to delete this request?</p>
                  <p className="text-xs text-gray-400">{deleteReq.user_name || deleteReq.email} · {deleteReq.plan_type} · {deleteReq.status}</p>
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-100 bg-gray-50">
                  <button onClick={() => setDeleteReq(null)} className="text-xs font-semibold px-4 py-2 rounded-none border border-gray-200 text-gray-600 hover:bg-gray-100">Cancel</button>
                  <button onClick={() => handleDelete(deleteReq.id)} disabled={!!processing} className="text-xs font-semibold px-4 py-2 rounded-none bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">{processing === deleteReq.id ? '…' : 'Delete'}</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════
          PLANS TAB
         ══════════════════════════════════════════════════ */}
      {tab === 'plans' && (
        <>
          {plansLoading ? (
            <LoadingScreen message="Loading plans…" />
          ) : (
            <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3 font-semibold">ID</th>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Price (NPR)</th>
                      <th className="px-4 py-3 font-semibold">Duration</th>
                      <th className="px-4 py-3 font-semibold">Active</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {plans.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex text-xs font-semibold px-2 py-0.5 border ${
                            p.plan_type === 'premium' ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : p.plan_type === 'enterprise' ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                          }`}>
                            {p.plan_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {p.price_npr === 0 ? 'Free' : `NPR ${(p.price_npr / 100).toLocaleString('en-NP')}`}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{p.duration_days}d</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {p.is_active ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openEditPlan(p)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Edit plan"
                          >
                            <Edit size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {plans.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No plans found.</div>
              )}
            </div>
          )}
          <p className="text-xs text-gray-400">{plans.length} plan{plans.length !== 1 ? 's' : ''}</p>
        </>
      )}

      {/* ── Edit Plan Modal ── */}
      {editPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditPlan(null)}>
          <div className="relative w-full max-w-md bg-white rounded-none overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">Edit Plan: {editPlan.name}</h3>
              <button onClick={() => setEditPlan(null)} className="p-1 rounded-none hover:bg-gray-100"><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                <input type="text" value={editPlanForm.name} onChange={e => setEditPlanForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:border-red-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price (NPR paisa, e.g. 99900 = NPR 999)</label>
                <input type="number" value={editPlanForm.price_npr} onChange={e => setEditPlanForm(f => ({ ...f, price_npr: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:border-red-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Duration (days)</label>
                <input type="number" value={editPlanForm.duration_days} onChange={e => setEditPlanForm(f => ({ ...f, duration_days: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:border-red-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Features (one per line)</label>
                <textarea value={editPlanForm.features} onChange={e => setEditPlanForm(f => ({ ...f, features: e.target.value }))} rows={4}
                  className="w-full text-sm border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:border-red-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Active</label>
                <select value={editPlanForm.is_active} onChange={e => setEditPlanForm(f => ({ ...f, is_active: e.target.value === 'true' }))}
                  className="w-full text-sm border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:border-red-700">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Plan Type</label>
                <select value={editPlanForm.plan_type} onChange={e => setEditPlanForm(f => ({ ...f, plan_type: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-none px-3 py-2 focus:outline-none focus:border-red-700">
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setEditPlan(null)} className="text-xs font-semibold px-4 py-2 rounded-none border border-gray-200 text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handlePlanSave} disabled={planSaving} className="text-xs font-semibold px-4 py-2 rounded-none bg-red-700 text-white hover:bg-red-800 disabled:opacity-50">{planSaving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
