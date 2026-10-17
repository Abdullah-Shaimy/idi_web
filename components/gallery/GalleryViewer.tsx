'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchFolders, fetchPhotosByFolder } from '../../lib/supabaseClient';

export default function GalleryViewer() {
  const { t, language } = useLanguage();
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [errorFolders, setErrorFolders] = useState(null);

  const [currentFolder, setCurrentFolder] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [errorPhotos, setErrorPhotos] = useState(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Load folders on mount
  useEffect(() => {
    let isMounted = true;
    fetchFolders()
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          setFolders(res.data);
        } else if (res.error) {
          setErrorFolders(res.error);
        }
        setLoadingFolders(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorFolders(err.message || 'Failed to load folders');
        setLoadingFolders(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Open album
  const handleOpenFolder = (folder) => {
    setCurrentFolder(folder);
    setLoadingPhotos(true);
    setErrorPhotos(null);

    fetchPhotosByFolder(folder.id)
      .then((res) => {
        if (res.data) {
          setPhotos(res.data);
        } else if (res.error) {
          setErrorPhotos(res.error);
        }
        setLoadingPhotos(false);
      })
      .catch((err) => {
        setErrorPhotos(err.message || 'Failed to load photos');
        setLoadingPhotos(false);
      });
  };

  const handleBackToFolders = () => {
    setCurrentFolder(null);
    setPhotos([]);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = useCallback(() => {
    if (photos.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % photos.length);
    }
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    if (photos.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  }, [photos.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextPhoto, prevPhoto]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString(language === 'ta' ? 'ta-LK' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  const currentPhoto = photos[lightboxIndex];

  return (
    <>
      {/* Hero Section */}
      <section className="hero page-head">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">{t('pages.events.hero.subtitle', t('pages.gallery.hero.subtitle', 'Moments Captured'))}</span>
          <h1>{t('pages.events.hero.title', t('pages.gallery.hero.title', 'Our Events'))}</h1>
          <p>
            {t(
              'pages.events.hero.copy',
              t(
                'pages.gallery.hero.copy',
                'Glimpses of life, learning, events, and spiritual growth at the Institute.'
              )
            )}
          </p>
        </div>
      </section>

      {/* Main Dynamic Gallery Section */}
      <section className="section-container" id="gallery-main-section">
        {!currentFolder ? (
          /* VIEW 1: ALBUM FOLDERS VIEW */
          <div id="folders-view">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span
                className="subtitle"
                style={{
                  color: 'var(--accent-gold)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontSize: '0.85rem',
                }}
              >
                {t('pages.events.folders.subtitle', t('pages.gallery.folders.subtitle', 'Event Albums'))}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                  marginTop: '0.5rem',
                  color: 'var(--text-primary)',
                }}
              >
                {t('pages.events.folders.title', t('pages.gallery.folders.title', 'Explore Our Events'))}
              </h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
                {t(
                  'pages.events.folders.copy',
                  t(
                    'pages.gallery.folders.copy',
                    'Select an album to browse photographs of campus activities, ceremonies, and special occasions.'
                  )
                )}
              </p>
            </div>

            {loadingFolders && (
              <div className="folders-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-box skeleton-cover"></div>
                    <div className="skeleton-box skeleton-text"></div>
                    <div className="skeleton-box skeleton-text sub"></div>
                  </div>
                ))}
              </div>
            )}

            {errorFolders && (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger)' }}>
                <i className="fa-solid fa-triangle-exclamation fa-2x" style={{ marginBottom: '1rem' }}></i>
                <p>{errorFolders}</p>
              </div>
            )}

            {!loadingFolders && !errorFolders && (
              <div className="folders-grid" id="folders-grid">
                {folders.length === 0 ? (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    {t('pages.events.folders.emptyAlbums', 'No event albums found.')}
                  </p>
                ) : (
                  folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="folder-card page-enter"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenFolder(folder)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenFolder(folder);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="folder-cover">
                        {folder.cover_image_url ? (
                          <>
                            <img
                              src={folder.cover_image_url}
                              alt={folder.name}
                              className="folder-cover-img"
                              loading="lazy"
                              draggable="false"
                            />
                            <div className="folder-cover-overlay"></div>
                          </>
                        ) : (
                          <div className="folder-fallback-icon">
                            <i className="fa-solid fa-folder"></i>
                            <span style={{ fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>
                              {t('pages.events.folders.defaultCover', 'IDI Album')}
                            </span>
                          </div>
                        )}
                        <div className="folder-badge-count">
                          <i className="fa-regular fa-image"></i> {folder.photo_count || 0}{' '}
                          {(folder.photo_count || 0) === 1 ? t('pages.events.folders.photo', 'Photo') : t('pages.events.folders.photos', 'Photos')}
                        </div>
                      </div>

                      <div className="folder-card-body">
                        <div className="folder-title-row">
                          <i className="fa-solid fa-folder-open folder-icon-inline"></i>
                          <h3 className="folder-card-title">{folder.name}</h3>
                        </div>
                        <p className="folder-card-desc">
                          {folder.description || t('pages.events.folders.defaultDesc', 'Explore photos from this album.')}
                        </p>
                        <div className="folder-card-footer">
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <i className="fa-regular fa-calendar"></i> {formatDate(folder.created_at)}
                          </span>
                          <span>
                            {t('pages.events.folders.viewAlbum', 'View Album')} <i className="fa-solid fa-arrow-right"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: ALBUM PHOTOS VIEW */
          <div id="album-view" className="album-view-container">
            <div className="album-header-bar">
              <div className="album-header-left">
                <div className="album-nav-breadcrumb">
                  <a
                    href="javascript:void(0)"
                    onClick={handleBackToFolders}
                    id="btn-breadcrumb-gallery"
                  >
                    <i className="fa-solid fa-folder-open"></i> {t('common.nav.events', 'Events')}
                  </a>
                  <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.75rem', opacity: 0.5 }}></i>
                  <span id="album-breadcrumb-title">{currentFolder.name}</span>
                </div>
                <h2 className="album-current-title" id="album-title">
                  {currentFolder.name}
                </h2>
                <p className="album-current-desc" id="album-desc">
                  {currentFolder.description || t('pages.events.folders.defaultPhotoDesc', 'Collection of photographs and moments.')}
                </p>
              </div>
              <div className="album-header-right">
                <button
                  type="button"
                  className="btn-back-gallery"
                  onClick={handleBackToFolders}
                >
                  <i className="fa-solid fa-arrow-left"></i> {t('pages.events.folders.backToAlbums', 'Back to Albums')}
                </button>
              </div>
            </div>

            {loadingPhotos && (
              <div className="photos-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-box" style={{ aspectRatio: '4/3' }}></div>
                  </div>
                ))}
              </div>
            )}

            {errorPhotos && (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger)' }}>
                <p>{errorPhotos}</p>
              </div>
            )}

            {!loadingPhotos && !errorPhotos && (
              <div className="photos-grid" id="photos-grid">
                {photos.length === 0 ? (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    {t('pages.events.folders.emptyPhotos', 'No photos found in this album.')}
                  </p>
                ) : (
                  photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="photo-card"
                      onClick={() => openLightbox(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={photo.photo_url}
                        alt={photo.title || currentFolder.name}
                        className="photo-card-img"
                        loading="lazy"
                        draggable="false"
                      />
                      <div className="photo-card-overlay">
                        <div className="photo-zoom-icon">
                          <i className="fa-solid fa-eye"></i>
                        </div>
                      </div>
                      <div className="photo-card-desc">
                        {photo.title || currentFolder.name}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && currentPhoto && (
        <div
          id="gallery-lightbox"
          className="lightbox-overlay active"
          role="dialog"
          aria-modal="true"
        >
          <div className="lightbox-topbar">
            <span id="lightbox-album-name">{currentFolder?.name}</span>
            <span id="lightbox-counter">
              {lightboxIndex + 1} / {photos.length}
            </span>
            <button
              type="button"
              id="lightbox-close"
              aria-label="Close"
              onClick={closeLightbox}
            >
              &times;
            </button>
          </div>

          <div
            className="lightbox-stage"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            <button
              type="button"
              className="lightbox-nav-btn prev"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="lightbox-img-wrapper" onClick={(e) => e.stopPropagation()}>
              <img
                src={currentPhoto.photo_url}
                alt={currentPhoto.title || 'Photo'}
                id="lightbox-img"
                draggable="false"
              />
            </div>

            <button
              type="button"
              className="lightbox-nav-btn next"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="lightbox-caption">
            <h4 id="lightbox-title">{currentPhoto.title || ''}</h4>
            <p id="lightbox-desc">{currentPhoto.description || ''}</p>
          </div>
        </div>
      )}
    </>
  );
}
