import React, { useEffect } from 'react';
import './matchedDogModal.css';

const MatchedDogModal = ({ dog, isOpen, onClose }) => {
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

    if (!isOpen || !dog) return null;

    return (
        <div className="matched-modal-overlay" onClick={onClose}>
            <div className="matched-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose} aria-label="Close">
                    ×
                </button>
                
                <div className="matched-modal-header">
                    <h2>It's a Match! 🎉</h2>
                    <p className="match-subtitle">You've been matched with the perfect dog for you!</p>
                </div>
                
                <div className="matched-modal-grid">
                    <div className="matched-modal-image-container">
                        <img 
                            src={dog.img} 
                            alt={`${dog.name} - ${dog.breed}`} 
                            className="matched-modal-image"
                        />
                        <div className="match-badge">Perfect Match</div>
                    </div>
                    
                    <div className="matched-modal-details">
                        <h2 className="matched-modal-name">{dog.name}</h2>
                        
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
                    
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default MatchedDogModal;