'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { submitContactInquiry } from '../../lib/supabaseClient';

export default function ContactContent() {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { name, email, city, phone, message } = formData;

    if (!name.trim()) {
      setFeedback({ type: 'error', message: t('pages.contact.form.errName', 'Please enter your full name.') });
      return;
    }
    if (!city.trim()) {
      setFeedback({ type: 'error', message: t('pages.contact.form.errCity', 'Please enter your city or location.') });
      return;
    }
    if (!phone.trim()) {
      setFeedback({ type: 'error', message: t('pages.contact.form.errPhone', 'Please enter your phone number.') });
      return;
    }
    if (!message.trim()) {
      setFeedback({ type: 'error', message: t('pages.contact.form.errMessage', 'Please enter your message.') });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await submitContactInquiry({
        name: name.trim(),
        email: email.trim(),
        city: city.trim(),
        phone: phone.trim(),
        subject: `Inquiry from ${city.trim()}`,
        message: message.trim(),
      });

      setConfirmedData({
        name: name.trim(),
        city: city.trim(),
        phone: phone.trim(),
      });

      setFeedback({
        type: 'success',
        message: t(
          'pages.contact.form.success',
          'Message Sent! Thank you, your inquiry has been successfully submitted. Our administration will contact you shortly.'
        ),
      });

      setShowConfirmModal(true);

      setFormData({
        name: '',
        email: '',
        city: '',
        phone: '',
        message: '',
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setFeedback({
        type: 'error',
        message: err.message || t('pages.contact.form.fail', 'Failed to submit inquiry. Please try again.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero page-head">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">{t('pages.contact.hero.subtitle', 'Get in Touch')}</span>
          <h1>{t('pages.contact.hero.title', 'Contact Us')}</h1>
          <p>
            {t(
              'pages.contact.hero.copy',
              'We are here to assist you with any inquiries regarding our programs and admissions.'
            )}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-container">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="subtitle" style={{ color: 'var(--accent-emerald)' }}>
              {t('pages.contact.info.subtitle', 'Reach Out')}
            </span>
            <h2 className="section-title" style={{ textAlign: 'left', marginTop: '1rem', marginBottom: '3rem' }}>
              {t('pages.contact.info.title', "Let's Start a Conversation")}
            </h2>

            <div className="contact-method">
              <div className="method-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  {t('pages.contact.info.visitTitle', 'Visit Us')}
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  123 Madrasa Lane, Islamic District,<br />
                  City, State 12345
                </p>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  {t('pages.contact.info.callTitle', 'Call Us')}
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  +1 234 567 890<br />
                  +1 987 654 321
                </p>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  {t('pages.contact.info.emailTitle', 'Email Us')}
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  info@idi.edu<br />
                  admissions@idi.edu
                </p>
              </div>
            </div>
          </div>

          <div className="form-card">
            {feedback && (
              <div
                className={`form-feedback ${feedback.type === 'success' ? 'success' : 'error'}`}
                style={{ display: 'flex' }}
              >
                <i
                  className={
                    feedback.type === 'success'
                      ? 'fa-solid fa-circle-check'
                      : 'fa-solid fa-circle-exclamation'
                  }
                  style={{ marginRight: '0.5rem' }}
                ></i>
                <span>{feedback.message}</span>
              </div>
            )}

            <form id="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="name" className="form-label">
                  {t('pages.contact.form.name', 'Full Name *')}
                </label>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                />
                <label htmlFor="email" className="form-label">
                  {t('pages.contact.form.email', 'Email Address (Optional)')}
                </label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  placeholder=" "
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="city" className="form-label">
                  {t('pages.contact.form.city', 'City / Location *')}
                </label>
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="phone" className="form-label">
                  {t('pages.contact.form.phone', 'Phone Number *')}
                </label>
              </div>

              <div className="form-group">
                <textarea
                  id="message"
                  name="message"
                  className="form-input"
                  placeholder=" "
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{ resize: 'none' }}
                ></textarea>
                <label htmlFor="message" className="form-label">
                  {t('pages.contact.form.message', 'Your Message *')}
                </label>
              </div>

              <button
                type="submit"
                id="btn-submit-inquiry"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>
                    <i className="fa-solid fa-spinner fa-spin"></i>{' '}
                    {t('pages.contact.form.submitting', isTamil ? 'அனுப்பப்படுகிறது...' : 'Submitting...')}
                  </span>
                ) : (
                  <span>
                    <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i>
                    {t('pages.contact.form.submit', 'Send Message')}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Inquiry Confirmation Modal */}
      {showConfirmModal && confirmedData && (
        <div
          className="confirm-modal-overlay active"
          id="confirm-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirmModal(false);
          }}
        >
          <div className="confirm-modal-card">
            <div className="confirm-icon-circle">
              <i className="fa-solid fa-check"></i>
            </div>
            <h3>{t('pages.contact.confirm.title', 'Message Sent Successfully!')}</h3>
            <p>
              {t(
                'pages.contact.confirm.copy',
                'Jazakallah Khair! Your message has been received by our administration team. We will review your inquiry and get in touch with you shortly.'
              )}
            </p>

            <div className="confirm-details-box">
              <div className="detail-row">
                <span className="detail-label">{t('pages.contact.confirm.nameLabel', 'Sender Name:')}</span>
                <span className="detail-val" id="confirm-name">
                  {confirmedData.name}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('pages.contact.confirm.cityLabel', 'Location:')}</span>
                <span className="detail-val" id="confirm-city">
                  {confirmedData.city}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('pages.contact.confirm.phoneLabel', 'Phone:')}</span>
                <span className="detail-val" id="confirm-phone">
                  {confirmedData.phone}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('pages.contact.confirm.statusLabel', 'Status:')}</span>
                <span className="detail-val" style={{ color: '#16a34a' }}>
                  <i className="fa-solid fa-circle-check"></i> {t('pages.contact.confirm.statusVal', 'Transmitted to Admins')}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-confirm-ok"
              id="btn-close-confirm"
              onClick={() => setShowConfirmModal(false)}
            >
              <i className="fa-solid fa-check" style={{ marginRight: '6px' }}></i> {t('pages.contact.confirm.doneBtn', 'Done')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
