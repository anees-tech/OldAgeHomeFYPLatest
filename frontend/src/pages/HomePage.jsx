import { Link } from "react-router-dom"
import "../styles/home.css"

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              A Place to Call <span className="highlight">Home</span>
            </h1>
            <p className="hero-description">
              Providing compassionate care and a vibrant community for seniors to enjoy their golden years with dignity
              and joy.
            </p>
            <div className="hero-buttons">
              <Link to="/#" className="btn primary-btn">
                Learn About Admission <i className="arrow-icon"></i>
              </Link>
              <Link to="/#" className="btn secondary-btn">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-description">
              We provide a range of services designed to meet the unique needs of each resident, ensuring comfort, care,
              and community.
            </p>
          </div>

          <div className="services-grid">
            {[
              {
                icon: "home-icon",
                title: "Comfortable Accommodation",
                description: "Private and semi-private rooms designed for comfort and accessibility.",
              },
              {
                icon: "heart-icon",
                title: "Medical Care",
                description: "24/7 nursing care and regular health check-ups by qualified professionals.",
              },
              {
                icon: "users-icon",
                title: "Social Activities",
                description: "Regular social events, games, and outings to foster community and engagement.",
              },
              {
                icon: "calendar-icon",
                title: "Personalized Care Plans",
                description: "Individualized care plans tailored to each resident's unique needs and preferences.",
              },
              {
                icon: "shield-icon",
                title: "Safety & Security",
                description: "Secure environment with emergency response systems and 24/7 monitoring.",
              },
              {
                icon: "phone-icon",
                title: "Family Support",
                description: "Regular communication with families and support for visiting loved ones.",
              },
            ].map((service, index) => (
              <div key={index} className="service-card">
                <div className={`service-icon ${service.icon}`}></div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="services-link">
            <Link to="/#" className="view-all-link">
              View All Services <i className="arrow-icon"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Families Say</h2>
            <p className="section-description">
              Hear from the families of our residents about their experiences with Golden Years Home.
            </p>
          </div>

          <div className="testimonials-grid">
            {[
              {
                quote:
                  "The care and attention my mother receives at Golden Years is exceptional. The staff treats her like family.",
                author: "Sarah Johnson",
                relation: "Daughter of Resident",
              },
              {
                quote:
                  "Moving my father to Golden Years was the best decision we made. He's happier and more active than he's been in years.",
                author: "Michael Thompson",
                relation: "Son of Resident",
              },
              {
                quote:
                  "The staff's dedication to creating a warm, engaging community has made all the difference for my aunt.",
                author: "Emily Davis",
                relation: "Niece of Resident",
              },
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="quote-icon"></div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <p className="author-name">{testimonial.author}</p>
                  <p className="author-relation">{testimonial.relation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Learn More?</h2>
          <p className="cta-description">
            Schedule a tour, speak with our care team, or learn more about our admission process.
          </p>
          <div className="cta-buttons">
            <Link to="/#" className="btn secondary-btn">
              Contact Us
            </Link>
            <Link to="/#" className="btn primary-btn">
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

