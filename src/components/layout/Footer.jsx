import './Footer.css'

export default function Footer({ onResetDemo }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">
          Built for Mozilla Firefox Club VIT Vellore recruitment · Frontend subdomain
        </p>
        {onResetDemo && (
          <button
            type="button"
            className="footer__reset-btn"
            onClick={onResetDemo}
          >
            Reset demo data
          </button>
        )}
      </div>
    </footer>
  )
}
