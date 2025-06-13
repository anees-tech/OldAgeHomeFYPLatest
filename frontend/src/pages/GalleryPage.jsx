import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/gallery.css';

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchImages();
    fetchCategories();
  }, [selectedCategory]);

  const fetchImages = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('active', 'true'); // Only show active images
      
      const response = await axios.get(`http://localhost:5000/api/gallery?${params}`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery/meta/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  const nextImage = () => {
    const currentIndex = images.findIndex(img => img._id === selectedImage._id);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = images.findIndex(img => img._id === selectedImage._id);
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setSelectedImage(images[prevIndex]);
  };

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="container">
          <div className="loading">Loading gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Our Gallery</h1>
          <p className="page-description">
            Take a glimpse into daily life at Golden Years Home through our photo gallery. 
            See the joy, activities, and care that make our community special.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="gallery-filters">
        <div className="container">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Photos
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-section">
        <div className="container">
          {images.length === 0 ? (
            <div className="no-images">
              <div className="no-images-icon"></div>
              <h3>No images found</h3>
              <p>There are no images in this category yet.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {images.map((image, index) => (
                <div 
                  key={image._id} 
                  className="gallery-item"
                  onClick={() => openModal(image)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="image-container">
                    <img src={image.imageUrl} alt={image.title} loading="lazy" />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <h3>{image.title}</h3>
                        <p>{image.category}</p>
                        <div className="overlay-icon">
                          <i className="fas fa-search-plus"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showModal && selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <button className="modal-nav prev" onClick={prevImage}>
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <button className="modal-nav next" onClick={nextImage}>
              <i className="fas fa-chevron-right"></i>
            </button>
            
            <div className="modal-content">
              <img src={selectedImage.imageUrl} alt={selectedImage.title} />
              <div className="image-details">
                <h3>{selectedImage.title}</h3>
                <span className="image-category">{selectedImage.category}</span>
                {selectedImage.description && (
                  <p className="image-description">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;