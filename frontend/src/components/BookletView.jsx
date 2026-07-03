import { useState, useRef } from 'react'
import { Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import logo from '../assets/hu.png'

export default function BookletView({ page, setPage, children, downloadFilename = 'ielts-guide.pdf', title = 'IELTS Study Guide' }) {
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef(null)

  const downloadPDF = async () => {
    setDownloading(true)
    setProgress(0)
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pw = pdf.internal.pageSize.getWidth()
      const ph = pdf.internal.pageSize.getHeight()

      // --- Draw header on first page ---
      const stripH = 4
      let contentTop = 8

      try {
        const img = new Image()
        img.src = logo
        await Promise.race([
          new Promise((res, rej) => { img.onload = res; img.onerror = rej }),
          new Promise((_, rej) => setTimeout(() => rej('timeout'), 3000))
        ])

        pdf.setFillColor(185, 28, 28)
        pdf.rect(0, 0, pw, stripH, 'F')

        const logoW = Math.min(16, pw * 0.15)
        const logoH = (img.naturalHeight / img.naturalWidth) * logoW
        pdf.addImage(img, 'PNG', 12, stripH + 4, logoW, logoH)

        const titleX = 12 + logoW + 6
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(16)
        pdf.setTextColor(185, 28, 28)
        pdf.text(title, titleX, stripH + 11)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.setTextColor(107, 114, 128)
        pdf.text('Comprehensive preparation guide with expert strategies & tips', titleX, stripH + 18)

        const lineY = Math.max(stripH + logoH + 10, stripH + 22)
        pdf.setDrawColor(220, 38, 38)
        pdf.setLineWidth(0.5)
        pdf.line(18, lineY, pw - 18, lineY)

        contentTop = lineY + 4
      } catch (e) {}

      const pages = [1, 2, 3, 4]
      for (let i = 0; i < pages.length; i++) {
        setProgress(Math.round(((i + 1) / pages.length) * 100))
        const p = pages[i]
        const el = containerRef.current?.querySelector(`[data-page="${p}"]`)
        if (!el) continue
        el.style.display = 'block'
        await new Promise(r => setTimeout(r, 150))
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, allowTaint: false, logging: false })
        if (i < pages.length - 1) el.style.display = ''
        const data = canvas.toDataURL('image/png')
        if (p > 1) pdf.addPage()
        const top = p === 1 ? contentTop : 8
        const availH = ph - top - 6
        const imgH = (canvas.height / canvas.width) * pw
        if (imgH <= availH) {
          pdf.addImage(data, 'PNG', 0, top, pw, imgH)
        } else {
          const ratio = pw / canvas.width
          let remaining = canvas.height
          let srcY = 0
          while (remaining > 0) {
            const h = Math.min(availH / ratio, remaining)
            const pc = document.createElement('canvas')
            pc.width = canvas.width
            pc.height = h
            pc.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, h, 0, 0, canvas.width, h)
            pdf.addImage(pc.toDataURL('image/png'), 'PNG', 0, top, pw, availH)
            if (h < remaining) pdf.addPage()
            srcY += h
            remaining -= h
          }
        }
      }
      setProgress(100)
      await new Promise(r => setTimeout(r, 200))
      pdf.save(downloadFilename)
    } catch (e) {
      console.error('PDF error:', e)
    }
    setDownloading(false)
    setProgress(0)
  }

  return (
    <div className="flex flex-col items-center gap-5" ref={containerRef}>
      {downloading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl p-6 w-72 text-center">
            <p className="text-sm font-bold text-gray-800 mb-3">Generating PDF...</p>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">{progress}%</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 self-start items-center">
        {[1, 2, 3, 4].map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={`px-4 py-1.5 text-xs font-sans border border-gray-600 rounded-sm cursor-pointer ${
              page === p ? 'bg-red-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}>
            Page {p}
          </button>
        ))}
        <button onClick={downloadPDF} disabled={downloading}
          className="ml-3 px-3 py-1.5 text-xs font-sans border border-red-500 text-red-600 rounded-sm hover:bg-red-50 cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
          <Download size={12} />
          {downloading ? 'Downloading...' : 'Download All Pages'}
        </button>
      </div>

      <div className="w-full flex flex-col items-center gap-5">
        {children}
      </div>
    </div>
  )
}
