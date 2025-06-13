import React, { useState } from 'react';
import axios from 'axios';
import '../styles/admission.css';

function AdmissionPage() {
  const [formData, setFormData] = useState({
    // Applicant Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    
    // Contact Information
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Medical Information
    primaryPhysician: '',
    medicalConditions: '',
    medications: '',
    mobilityLevel: '',
    
    // Care Requirements
    careLevel: '',
    specialNeeds: '',
    
    // Additional Information
    preferredRoom: '',
    moveInDate: '',
    additionalComments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

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
      const response = await axios.post('http://localhost:5000/api/admissions/apply', formData);
      setSubmitStatus('success');
      // Reset form
      setFormData({
        firstName: '', lastName: '', dateOfBirth: '', gender: '', maritalStatus: '',
        phone: '', email: '', address: '', city: '', state: '', zipCode: '',
        emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
        primaryPhysician: '', medicalConditions: '', medications: '', mobilityLevel: '',
        careLevel: '', specialNeeds: '', preferredRoom: '', moveInDate: '', additionalComments: ''
      });
    } catch (error) {
      console.error('Error submitting admission application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const admissionSteps = [
    {
      step: 1,
      title: "Initial Inquiry",
      description: "Contact us to discuss your needs and schedule a tour of our facilities."
    },
    {
      step: 2,
      title: "Assessment",
      description: "Complete a comprehensive assessment to determine the appropriate level of care."
    },
    {
      step: 3,
      title: "Application",
      description: "Submit your completed application along with required documentation."
    },
    {
      step: 4,
      title: "Review Process",
      description: "Our team reviews your application and medical information."
    },
    {
      step: 5,
      title: "Move-In Coordination",
      description: "Once approved, we'll help coordinate your move-in process."
    }
  ];

  return (
    <div className="admission-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Admission Process</h1>
          <p className="page-description">
            Begin your journey with us by learning about our admission process and submitting an application.
          </p>
        </div>
      </div>

      {/* Admission Steps */}
      <section className="admission-steps">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How to Apply</h2>
            <p className="section-description">
              Our admission process is designed to ensure we can provide the best possible care for each resident.
            </p>
          </div>
          
          <div className="steps-grid">
            {admissionSteps.map((item, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="application-form-section">
        <div className="container">
          <div className="form-header">
            <h2 className="form-title">Application Form</h2>
            <p className="form-description">
              Please fill out this form to begin the admission process. All information will be kept confidential.
            </p>
          </div>

          {submitStatus === 'success' && (
            <div className="alert alert-success">
              <p>Thank you! Your application has been submitted successfully. We will contact you within 2-3 business days.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="alert alert-error">
              <p>There was an error submitting your application. Please try again or contact us directly.</p>
            </div>
          )}

          <form className="admission-form" onSubmit={handleSubmit}>
            {/* Applicant Information */}
            <div className="form-section">
              <h3 className="section-title">Applicant Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3 className="section-title">Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Current Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="form-section">
              <h3 className="section-title">Emergency Contact</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Contact Name *</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Relationship *</label>
                  <select
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="form-section">
              <h3 className="section-title">Medical Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Primary Physician</label>
                  <input
                    type="text"
                    name="primaryPhysician"
                    value={formData.primaryPhysician}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Medical Conditions</label>
                  <textarea
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Please list any medical conditions or diagnoses"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Current Medications</label>
                  <textarea
                    name="medications"
                    value={formData.medications}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Please list all current medications and dosages"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobility Level *</label>
                  <select
                    name="mobilityLevel"
                    value={formData.mobilityLevel}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Mobility Level</option>
                    <option value="independent">Independent</option>
                    <option value="assistive-device">Uses Assistive Device</option>
                    <option value="wheelchair">Wheelchair</option>
                    <option value="bedridden">Bedridden</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Care Requirements */}
            <div className="form-section">
              <h3 className="section-title">Care Requirements</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Level of Care Needed *</label>
                  <select
                    name="careLevel"
                    value={formData.careLevel}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Care Level</option>
                    <option value="independent">Independent Living</option>
                    <option value="assisted">Assisted Living</option>
                    <option value="memory">Memory Care</option>
                    <option value="skilled">Skilled Nursing</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Room Type</label>
                  <select
                    name="preferredRoom"
                    value={formData.preferredRoom}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Room Type</option>
                    <option value="private">Private Room</option>
                    <option value="semi-private">Semi-Private Room</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Special Needs or Requirements</label>
                  <textarea
                    name="specialNeeds"
                    value={formData.specialNeeds}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Please describe any special needs, dietary restrictions, or other requirements"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Move-In Date</label>
                  <input
                    type="date"
                    name="moveInDate"
                    value={formData.moveInDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3 className="section-title">Additional Information</h3>
              <div className="form-group">
                <label className="form-label">Additional Comments</label>
                <textarea
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                  placeholder="Please share any additional information that would help us provide the best care"
                />
              </div>
            </div>

            <div className="form-submit">
              <button 
                type="submit" 
                className="btn primary-btn full-width"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <p className="form-note">
                * Required fields. By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AdmissionPage;