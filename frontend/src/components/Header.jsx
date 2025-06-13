"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/header.css"

function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const goToAdmin = () => {
    navigate("/admin")
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-primary">Golden Years</span>
            <span className="logo-secondary">Home</span>
          </Link>

          <nav className="desktop-nav">
            <ul className="nav-list">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="nav-link"> {/* Changed from # to /services */}
                  Services
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="nav-link"> {/* Changed from # to /gallery */}
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/admission" className="nav-link"> {/* Changed from # to /admission */}
                  Admission
                </Link>
              </li>
              <li>
                <Link to="/donation" className="nav-link"> {/* Changed from # to /donation */}
                  Donation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="nav-link"> {/* Changed from # to /contact */}
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="auth-buttons">
            {user ? (
              <>
                <span className="user-name">Hello, {user.firstName}</span>
                {user.isAdmin && (
                  <button onClick={goToAdmin} className="admin-btn">
                    Admin Dashboard
                  </button>
                )}
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-btn">
                  Log In
                </Link>
                <Link to="/register" className="register-btn">
                  Register
                </Link>
              </>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-nav">
            <nav>
              <ul className="mobile-nav-list">
                <li>
                  <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="mobile-nav-link" onClick={toggleMenu}> {/* Changed from # to /services */}
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="mobile-nav-link" onClick={toggleMenu}> {/* Changed from # to /gallery */}
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/admission" className="mobile-nav-link" onClick={toggleMenu}> {/* Changed from # to /admission */}
                    Admission
                  </Link>
                </li>
                <li>
                  <Link to="/donation" className="mobile-nav-link" onClick={toggleMenu}> {/* Changed from # to /donation */}
                    Donation
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="mobile-nav-link" onClick={toggleMenu}> {/* Changed from # to /contact */}
                    Contact
                  </Link>
                </li>

                <li className="mobile-auth">
                  {user ? (
                    <>
                      <span className="mobile-user-name">Hello, {user.firstName}</span>
                      {user.isAdmin && (
                        <button onClick={goToAdmin} className="mobile-admin-btn">
                          Admin Dashboard
                        </button>
                      )}
                      <button onClick={handleLogout} className="mobile-logout-btn">
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="mobile-login-btn" onClick={toggleMenu}>
                        Log In
                      </Link>
                      <Link to="/register" className="mobile-register-btn" onClick={toggleMenu}>
                        Register
                      </Link>
                    </>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
