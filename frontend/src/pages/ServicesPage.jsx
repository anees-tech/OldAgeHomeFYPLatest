import React from 'react';
import '../styles/services.css';

function ServicesPage() {
  const services = [
    {
      icon: "home-icon",
      title: "Comfortable Accommodation",
      description: "Private and semi-private rooms designed for comfort and accessibility with modern amenities.",
      features: ["Private bathrooms", "Climate control", "Emergency call systems", "Wheelchair accessibility"]
    },
    {
      icon: "heart-icon",
      title: "Medical Care",
      description: "Comprehensive healthcare services with qualified medical professionals available 24/7.",
      features: ["24/7 nursing care", "Regular health check-ups", "Medication management", "Emergency medical response"]
    },
    {
      icon: "users-icon",
      title: "Social Activities",
      description: "Engaging social programs designed to foster community connections and mental well-being.",
      features: ["Group activities", "Entertainment programs", "Educational workshops", "Community outings"]
    },
    {
      icon: "utensils-icon",
      title: "Nutritious Meals",
      description: "Delicious, nutritionally balanced meals prepared by professional chefs.",
      features: ["Three meals daily", "Special dietary accommodations", "Fresh ingredients", "Dining room service"]
    },
    {
      icon: "activity-icon",
      title: "Physical Therapy",
      description: "Professional rehabilitation and physical therapy services to maintain mobility and strength.",
      features: ["Individual therapy plans", "Group exercise classes", "Mobility assistance", "Strength training"]
    },
    {
      icon: "book-icon",
      title: "Educational Programs",
      description: "Lifelong learning opportunities including classes, lectures, and skill development.",
      features: ["Computer classes", "Art workshops", "Reading clubs", "Guest lectures"]
    }
  ];

  return (
    <div className="services-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Our Services</h1>
          <p className="page-description">
            We provide comprehensive care and services designed to meet the unique needs of each resident, 
            ensuring comfort, dignity, and quality of life in their golden years.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="services-content">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-detail-card">
                <div className="service-header">
                  <div className={`service-icon ${service.icon}`}></div>
                  <h3 className="service-title">{service.title}</h3>
                </div>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="service-feature">
                      <i className="check-icon"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Learn More?</h2>
            <p className="cta-description">
              Contact us today to schedule a tour and see how our services can benefit your loved one.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn primary-btn">Contact Us</a>
              <a href="/admission" className="btn secondary-btn">Learn About Admission</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;