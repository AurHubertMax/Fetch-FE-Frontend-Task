import React, { useEffect } from 'react';
import './dogModal.css';

const DogModal = ({ dog, isOpen, onClose, onFavoriteToggle, isFavorite }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleFavoriteToggle = () => {
        onFavoriteToggle(dog.id);
    };

    if (!isOpen || !dog) return null;

    return (
        <div className="dog-modal-overlay" onClick={onClose}>
            <div className="dog-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose} aria-label="Close">
                    ×
                </button>
                
                <div className="dog-modal-grid">
                    <div className="dog-modal-image-container">
                        <img 
                            src={dog.img} 
                            alt={`${dog.name} - ${dog.breed}`} 
                            className="dog-modal-image"
                        />
                    </div>
                    
                    <div className="dog-modal-details">
                        <h2 className="dog-modal-name">{dog.name}</h2>
                        
                        <div className="dog-detail-row">
                            <span className="detail-label">Breed:</span>
                            <span className="detail-value">{dog.breed}</span>
                        </div>
                        
                        <div className="dog-detail-row">
                            <span className="detail-label">Age:</span>
                            <span className="detail-value">
                                {dog.age} {dog.age === 1 ? 'year' : 'years'}
                            </span>
                        </div>
                        
                        <div className="dog-detail-row">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">{dog.zip_code}</span>
                        </div>
                        
                        <div className="dog-modal-actions">
                            <button 
                                className={`action-button ${isFavorite ? 'remove-favorite-button' : 'favorite-button'}`}
                                onClick={handleFavoriteToggle}
                            >
                                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DogModal;