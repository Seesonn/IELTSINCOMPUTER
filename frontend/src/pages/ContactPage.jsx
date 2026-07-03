import { useState } from 'react'
import Navbar from "../pages/NavBar"
import Footer from "../components/Footer"
import { Mail, MapPin, Phone, Send, MessageSquare, AlertTriangle, ImageUp, X, CheckCircle, ChevronDown, Loader } from "lucide-react"
import { contactApi } from '../utils/api'

const contactInfo = [
  { icon: Mail,   label: "Email",   value: "support@ieltsincomputer.com",   href: "mailto:support@ieltsincomputer.com" },
  { icon: Phone,  label: "Phone",   value: "+977-980-1234567",        href: "tel:+9779801234567" },
  { icon: MapPin, label: "Address", value: "Itahari, Sunsari, Nepal", href: null },
]

const inputClass = "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none transition-all duration-200 bg-white placeholder:text-gray-300 focus:border-[#CC0000] focus:ring-[3px] focus:ring-red-50 focus:shadow-[0_0_0_3px_rgba(204,0,0,0.06)]"

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'query', message: '' })
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setFilePreview(reader.result)
      reader.readAsDataURL(f)
    } else {
      setFilePreview(null)
    }
  }

  const removeFile = () => {
    setFile(null)
    setFilePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await contactApi.submit(form.name, form.email, form.subject, form.message, file)
      setSent(true)
    } catch {
      alert('Failed to send message. Please try again later.')
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setSent(false)
    setForm({ name: '', email: '', subject: 'query', message: '' })
    removeFile()
  }

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Quicksand', serif !important; }
        .font-sans  { font-family: 'Quicksand', sans-serif !important; }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .anim-fade-up   { animation: fadeUp 0.6s ease both; }
        .anim-fade-in   { animation: fadeIn 0.5s ease both; }
        .anim-scale-in  { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .anim-slide-down { animation: slideDown 0.3s ease both; }
        .anim-pulse-dot  { animation: pulse-dot 2s ease infinite; }
        .anim-ping-dot   { animation: ping-dot 1.5s ease infinite; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes ping-dot {
          0% { transform: scale(1); opacity: 0.5; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }

        .bg-pattern {
          background-image: radial-gradient(rgba(204,0,0,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-50/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-red-50/40 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 sm:pt-28 pb-10 sm:pb-14">
          <div className="max-w-2xl anim-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[3px] rounded-full bg-[#CC0000]" />
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#CC0000]">Get in Touch</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
              We'd love to<br />hear from you
            </h1>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-lg">
              Have a question, spotted a bug, or just want to say hello? Drop us a message and we'll get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* ── FORM + INFO ── */}
      <section className="relative max-w-6xl mx-auto px-6 pb-28 sm:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

          {/* ── LEFT: Contact Info ── */}
          <div className="lg:col-span-2 space-y-6 anim-fade-up delay-1">
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100
                    hover:border-red-100 hover:shadow-[0_4px_20px_rgba(204,0,0,0.06)] transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100
                    flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Icon size={18} className="text-icon" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-gray-400 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href}
                        className="text-sm font-semibold text-gray-900 no-underline hover:text-[#CC0000] transition-colors duration-200">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="p-5 rounded-xl bg-gradient-to-br from-red-50 to-orange-50/60 border border-red-100/70">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-white/80 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={16} className="text-icon" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Reporting an issue?</p>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                      Please include the test ID, question number, and what you expected to see. Screenshots help us fix things faster!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response time badge */}
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="relative w-2.5 h-2.5">
                <div className="absolute inset-0 rounded-full bg-green-400 anim-pulse-dot" />
                <div className="absolute inset-0 rounded-full bg-green-400 anim-ping-dot" />
              </div>
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Typically responds within 24h</span>
                {' '}— Mon–Sat, 9am–6pm
              </p>
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="lg:col-span-3 anim-fade-up delay-2">
            {sent ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] anim-scale-in">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100
                  flex items-center justify-center mx-auto mb-5 anim-scale-in">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <h2 className="font-serif text-2xl font-black text-gray-900 mb-2">Message sent!</h2>
                <p className="text-gray-400 leading-relaxed mb-3 max-w-sm mx-auto">
                  Thanks for reaching out. Our team usually responds within 24 hours.
                </p>
                <p className="text-xs text-gray-300 mb-7">We'll reply to <span className="font-semibold text-gray-500">{form.email}</span></p>
                <button
                  onClick={resetForm}
                  className="text-sm font-bold text-[#CC0000] bg-transparent border-2 border-[#CC0000]/20 px-7 py-3 rounded-xl
                    hover:bg-red-50 hover:border-[#CC0000]/40 transition-all duration-200 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}
                className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-shadow duration-300">
                {/* Form header */}
                <div className="flex items-center gap-3 pb-5 mb-6 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100 flex items-center justify-center">
                    <MessageSquare size={16} className="text-icon" />
                  </div>
                  <h2 className="font-serif text-lg font-black text-gray-900">Send us a message</h2>
                </div>

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Full Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Email Address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                      className={inputClass} />
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Subject</label>
                  <div className="relative">
                    <select name="subject" value={form.subject} onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10`}>
                      <option value="query">General Query</option>
                      <option value="report">Report a Problem / Bug</option>
                      <option value="content">Incorrect Content</option>
                      <option value="suggestion">Suggestion / Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="Describe your issue or query in detail..."
                    className={`${inputClass} resize-y min-h-[110px]`} />
                </div>

                {/* Screenshot — only for report, content, other */}
                {['report', 'content', 'other'].includes(form.subject) && (
                  <div className="mb-6 anim-slide-down">
                    <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Screenshot (optional)</label>
                    {!file ? (
                      <label className="group flex items-center gap-3.5 px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl
                        cursor-pointer hover:border-[#CC0000] hover:bg-red-50/30 transition-all duration-200">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center
                          group-hover:bg-white group-hover:border-red-100 transition-all duration-200">
                          <ImageUp size={18} className="text-gray-400 group-hover:text-[#CC0000] transition-colors duration-200" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                            Attach a screenshot
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">PNG, JPG or WEBP — max 5MB</p>
                        </div>
                        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3.5 px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/80 anim-scale-in">
                        {filePreview ? (
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                            <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                            <ImageUp size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={removeFile}
                          className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center
                            hover:bg-red-50 hover:border-red-200 transition-all duration-200 cursor-pointer shrink-0">
                          <X size={13} className="text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={sending}
                  className={`group relative w-full text-sm font-bold text-white px-6 py-3.5 rounded-xl cursor-pointer border-none overflow-hidden
                    bg-[#CC0000] hover:bg-[#b80000] active:bg-[#a30000] transition-all duration-200
                    shadow-[0_4px_16px_rgba(204,0,0,0.25)] hover:shadow-[0_6px_24px_rgba(204,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 ${sending ? 'opacity-60 cursor-wait' : ''}`}>
                  <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="relative flex items-center justify-center gap-2.5">
                    {sending ? (
                      <><Loader size={15} className="animate-spin" /> Sending…</>
                    ) : (
                      <>Send Message <Send size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      <Footer />

    </div>
  )
}
