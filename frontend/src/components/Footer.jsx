import { Link } from 'react-router-dom'
import footerImage from '../assets/footer.png'
import hu from '../assets/hu.png'

function EsewaLogo() {
  return (
    <svg viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
      <rect width="90" height="28" rx="5" fill="#60BB46" />
      <text x="45" y="18" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">eSewa</text>
    </svg>
  )
}

function KhaltiLogo() {
  return (
    <svg viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
      <rect width="80" height="28" rx="5" fill="#6c3096" />
      <text x="40" y="18" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">Khalti</text>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 pb-8 text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${footerImage})` }}
      />
      <div className="absolute inset-0 z-10" style={{ background: 'rgba(163, 37, 37, 0.83)' }} />
      <div className="relative z-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <img src={hu} alt="logo" className="w-28 mb-3" />
            <p className="text-xs leading-relaxed text-gray-200 max-w-xs">
              Nepal's best AI-powered IELTS practice platform. Built for Nepali students.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <EsewaLogo />
              <KhaltiLogo />
            </div>
          </div>
          {[
            {
              title: 'Practice',
              links: [
                { label: 'Reading',    to: '/tests' },
                { label: 'Listening',  to: '/tests' },
                { label: 'Writing',    to: '/tests' },
                { label: 'Speaking',   to: '/tests' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About',   to: '/about' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'Blog',    to: '#' },
                { label: 'Contact', to: '/contact' },
              ],
            },
            {
              title: 'Support',
              links: [
                { label: 'Help Center', to: '/help' },
                { label: 'Privacy',     to: '/privacy' },
                { label: 'Terms',       to: '/terms' },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-bold mb-3 text-white">{title}</h4>
              {links.map(({ label, to }) => (
                <Link key={label} to={to} className="block text-xs mb-2 text-white hover:text-red-200 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/40 pt-5 flex justify-between flex-wrap gap-2">
          <p className="text-xs text-white">&copy; {new Date().getFullYear()} IELTSPrep</p>
          <p className="text-xs text-white">Made in Nepal 🇳🇵</p>
        </div>
      </div>
    </footer>
  )
}
