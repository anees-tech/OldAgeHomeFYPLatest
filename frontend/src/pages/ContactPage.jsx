import { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    urgency: 'normal'
  });
  
  const [contactInfo, setContactInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contact/info');
      setContactInfo(response.data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '', email: '', phone: '', subject: '', message: '',
        preferredContact: 'email', urgency: 'normal'
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="contact-page">
        <div className="container">
          <div className="loading">Loading contact information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-description">
            We're here to help and answer any questions you may have. 
            Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-icon phone-icon"></div>
              <h3>Phone</h3>
              <p className="contact-detail">{contactInfo?.phone}</p>
              <p className="contact-detail emergency">Emergency: {contactInfo?.emergencyPhone}</p>
            </div>
            
            <div className="contact-info-card">
              <div className="contact-icon email-icon"></div>
              <h3>Email</h3>
              <p className="contact-detail">{contactInfo?.email}</p>
            </div>
            
            <div className="contact-info-card">
              <div className="contact-icon location-icon"></div>
              <h3>Address</h3>
              <p className="contact-detail">{contactInfo?.address}</p>
            </div>
            
            <div className="contact-info-card">
              <div className="contact-icon clock-icon"></div>
              <h3>Hours</h3>
              <div className="hours-info">
                <p>Mon-Fri: {contactInfo?.hours?.weekdays}</p>
                <p>Weekends: {contactInfo?.hours?.weekends}</p>
                <p>Holidays: {contactInfo?.hours?.holidays}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-container">
            <div className="form-header">
              <h2 className="form-title">Send us a Message</h2>
              <p className="form-description">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            {submitStatus === 'success' && (
              <div className="alert alert-success">
                <p>Thank you for your message! We will get back to you within 24 hours.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="alert alert-error">
                <p>There was an error sending your message. Please try again or call us directly.</p>
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="admission">Admission Information</option>
                    <option value="services">Services & Care</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="complaint">Complaint or Concern</option>
                    <option value="compliment">Compliment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Preferred Contact Method</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="preferredContact"
                        value="email"
                        checked={formData.preferredContact === 'email'}
                        onChange={handleInputChange}
                      />
                      <span>Email</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="preferredContact"
                        value="phone"
                        checked={formData.preferredContact === 'phone'}
                        onChange={handleInputChange}
                      />
                      <span>Phone</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Urgency Level</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="normal">Normal - Response within 24 hours</option>
                    <option value="high">High - Response within 4 hours</option>
                    <option value="urgent">Urgent - Immediate attention needed</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="6"
                  placeholder="Please provide details about your inquiry..."
                  required
                />
              </div>

              <div className="form-submit">
                <button 
                  type="submit" 
                  className="btn primary-btn full-width"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                <p className="form-note">
                  * Required fields. We typically respond within 24 hours during business days.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Visit Us</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-icon"></div>
              <p>Interactive map would be integrated here</p>
              <p className="map-address">{contactInfo?.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="emergency-section">
        <div className="container">
          <div className="emergency-info">
            <div className="emergency-icon"></div>
            <div className="emergency-content">
              <h3>Emergency Contact</h3>
              <p>For urgent matters or emergencies, please call:</p>
              <a href={`tel:${contactInfo?.emergencyPhone}`} className="emergency-phone">
                {contactInfo?.emergencyPhone}
              </a>
              <p className="emergency-note">Available 24/7 for current residents and families</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;