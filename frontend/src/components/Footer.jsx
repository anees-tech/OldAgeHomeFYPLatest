import { Link } from "react-router-dom"
import "../styles/footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3 className="footer-title">Golden Years Home</h3>
            <p className="footer-description">
              Providing compassionate care and a vibrant community for seniors to enjoy their golden years with dignity
              and joy.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="social-icon facebook"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="social-icon twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="social-icon instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-section links">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="footer-link">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/admission" className="footer-link">
                  Admission Process
                </Link>
              </li>
              <li>
                <Link to="/donation" className="footer-link">
                  Make a Donation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="contact-info">
              <li className="contact-item">
                <i className="contact-icon location"></i>
                <span>123 Care Lane, Serenity Hills, CA 90210</span>
              </li>
              <li className="contact-item">
                <i className="contact-icon phone"></i>
                <span>(555) 123-4567</span>
              </li>
              <li className="contact-item">
                <i className="contact-icon email"></i>
                <span>info@goldenyearshome.com</span>
              </li>
            </ul>
          </div>

          <div className="footer-section newsletter">
            <h3 className="footer-title">Newsletter</h3>
            <p className="footer-description">Subscribe to our newsletter for updates and news.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Golden Years Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

