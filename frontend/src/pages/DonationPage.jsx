import React, { useState } from 'react';
import axios from 'axios';
import '../styles/donation.css';

function DonationPage() {
  const [donationType, setDonationType] = useState('monetary');
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    isAnonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];
  
  const donationImpacts = [
    {
      amount: 25,
      impact: "Provides nutritious meals for one resident for a day"
    },
    {
      amount: 50,
      impact: "Covers recreational activities for a week"
    },
    {
      amount: 100,
      impact: "Supports medical supplies and health monitoring"
    },
    {
      amount: 250,
      impact: "Funds therapy sessions for one month"
    },
    {
      amount: 500,
      impact: "Helps maintain facility equipment and safety systems"
    },
    {
      amount: 1000,
      impact: "Supports staff training and care quality improvements"
    }
  ];

  const handleDonorInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonorInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    const finalAmount = donationAmount === 'custom' ? customAmount : donationAmount;
    
    const donationData = {
      type: donationType,
      amount: donationType === 'monetary' ? parseFloat(finalAmount) : null,
      donorInfo: donorInfo,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post('http://localhost:5000/api/donations/create', donationData);
      setSubmitStatus('success');
      // Reset form
      setDonationAmount('');
      setCustomAmount('');
      setDonorInfo({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', state: '', zipCode: '', isAnonymous: false
      });
    } catch (error) {
      console.error('Error processing donation:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="donation-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Make a Donation</h1>
          <p className="page-description">
            Your generous contribution helps us provide exceptional care and services to our residents. 
            Every donation makes a meaningful difference in their lives.
          </p>
        </div>
      </div>

      {/* Donation Impact */}
      <section className="donation-impact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Your Impact</h2>
            <p className="section-description">
              See how your donation directly improves the lives of our residents
            </p>
          </div>
          
          <div className="impact-grid">
            {donationImpacts.map((item, index) => (
              <div key={index} className="impact-card">
                <div className="impact-amount">${item.amount}</div>
                <p className="impact-description">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="donation-form-section">
        <div className="container">
          <div className="donation-container">
            <div className="form-header">
              <h2 className="form-title">Donation Details</h2>
            </div>

            {submitStatus === 'success' && (
              <div className="alert alert-success">
                <p>Thank you for your generous donation! You will receive a confirmation email shortly.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="alert alert-error">
                <p>There was an error processing your donation. Please try again or contact us directly.</p>
              </div>
            )}

            <form className="donation-form" onSubmit={handleSubmit}>
              {/* Donation Type */}
              <div className="form-section">
                <h3 className="section-subtitle">Type of Donation</h3>
                <div className="donation-type-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="donationType"
                      value="monetary"
                      checked={donationType === 'monetary'}
                      onChange={(e) => setDonationType(e.target.value)}
                    />
                    <span className="radio-label">Monetary Donation</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="donationType"
                      value="goods"
                      checked={donationType === 'goods'}
                      onChange={(e) => setDonationType(e.target.value)}
                    />
                    <span className="radio-label">Goods & Supplies</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="donationType"
                      value="volunteer"
                      checked={donationType === 'volunteer'}
                      onChange={(e) => setDonationType(e.target.value)}
                    />
                    <span className="radio-label">Volunteer Time</span>
                  </label>
                </div>
              </div>

              {/* Monetary Donation Amount */}
              {donationType === 'monetary' && (
                <div className="form-section">
                  <h3 className="section-subtitle">Donation Amount</h3>
                  <div className="amount-options">
                    {predefinedAmounts.map(amount => (
                      <label key={amount} className="amount-option">
                        <input
                          type="radio"
                          name="donationAmount"
                          value={amount}
                          checked={donationAmount === amount.toString()}
                          onChange={(e) => setDonationAmount(e.target.value)}
                        />
                        <span className="amount-label">${amount}</span>
                      </label>
                    ))}
                    <label className="amount-option">
                      <input
                        type="radio"
                        name="donationAmount"
                        value="custom"
                        checked={donationAmount === 'custom'}
                        onChange={(e) => setDonationAmount(e.target.value)}
                      />
                      <span className="amount-label">Other</span>
                    </label>
                  </div>
                  
                  {donationAmount === 'custom' && (
                    <div className="custom-amount">
                      <label className="form-label">Custom Amount</label>
                      <div className="amount-input-wrapper">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="amount-input"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Goods Donation */}
              {donationType === 'goods' && (
                <div className="form-section">
                  <h3 className="section-subtitle">Items We Need</h3>
                  <div className="needed-items">
                    <div className="items-grid">
                      <div className="item-category">
                        <h4>Personal Care</h4>
                        <ul>
                          <li>Toiletries and hygiene products</li>
                          <li>Adult diapers and incontinence supplies</li>
                          <li>Blankets and bedding</li>
                        </ul>
                      </div>
                      <div className="item-category">
                        <h4>Activities</h4>
                        <ul>
                          <li>Books and magazines</li>
                          <li>Puzzles and games</li>
                          <li>Art and craft supplies</li>
                        </ul>
                      </div>
                      <div className="item-category">
                        <h4>Medical</h4>
                        <ul>
                          <li>Wheelchairs and walkers</li>
                          <li>Blood pressure monitors</li>
                          <li>First aid supplies</li>
                        </ul>
                      </div>
                    </div>
                    <p className="contact-note">
                      Please contact us at (555) 123-4567 before bringing donations to ensure we can accept them.
                    </p>
                  </div>
                </div>
              )}

              {/* Volunteer Information */}
              {donationType === 'volunteer' && (
                <div className="form-section">
                  <h3 className="section-subtitle">Volunteer Opportunities</h3>
                  <div className="volunteer-info">
                    <div className="volunteer-opportunities">
                      <div className="opportunity">
                        <h4>Activity Assistance</h4>
                        <p>Help with recreational activities, games, and social events</p>
                      </div>
                      <div className="opportunity">
                        <h4>Companionship</h4>
                        <p>Spend time with residents, conversation, and friendship</p>
                      </div>
                      <div className="opportunity">
                        <h4>Special Skills</h4>
                        <p>Share your talents: music, art, reading, or other hobbies</p>
                      </div>
                      <div className="opportunity">
                        <h4>Administrative Support</h4>
                        <p>Help with office tasks, events planning, and organization</p>
                      </div>
                    </div>
                    <p className="volunteer-note">
                      All volunteers must complete a background check and orientation. We'll contact you to discuss available opportunities.
                    </p>
                  </div>
                </div>
              )}

              {/* Donor Information */}
              <div className="form-section">
                <h3 className="section-subtitle">Your Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={donorInfo.firstName}
                      onChange={handleDonorInfoChange}
                      className="form-input"
                      required={!donorInfo.isAnonymous}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={donorInfo.lastName}
                      onChange={handleDonorInfoChange}
                      className="form-input"
                      required={!donorInfo.isAnonymous}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={donorInfo.email}
                      onChange={handleDonorInfoChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={donorInfo.phone}
                      onChange={handleDonorInfoChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={donorInfo.address}
                      onChange={handleDonorInfoChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={donorInfo.city}
                      onChange={handleDonorInfoChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={donorInfo.state}
                      onChange={handleDonorInfoChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={donorInfo.zipCode}
                      onChange={handleDonorInfoChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isAnonymous"
                      checked={donorInfo.isAnonymous}
                      onChange={handleDonorInfoChange}
                    />
                    <span>Make this donation anonymous</span>
                  </label>
                </div>
              </div>

              <div className="form-submit">
                <button 
                  type="submit" 
                  className="btn primary-btn full-width"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 
                   donationType === 'monetary' ? 'Proceed to Payment' : 
                   'Submit Information'}
                </button>
                <p className="form-note">
                  {donationType === 'monetary' && 
                    'You will be redirected to our secure payment processor to complete your donation.'
                  }
                  {donationType === 'goods' && 
                    'We will contact you within 2 business days to arrange donation drop-off.'
                  }
                  {donationType === 'volunteer' && 
                    'We will contact you within 2 business days to discuss volunteer opportunities.'
                  }
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DonationPage;