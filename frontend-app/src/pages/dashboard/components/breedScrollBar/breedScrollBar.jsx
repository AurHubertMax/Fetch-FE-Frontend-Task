import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './breedScrollBar.css';

const BreedScrollBar = ({ breeds, isLoading, selectedBreed, onBreedSelect, onMatchedSelect, favoriteDogs = [] }) => {
    const breedsGridRef = useRef(null);
    const selectedCardRef = useRef(null);
    const scrollAnimationRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBreeds = breeds.filter(breed => 
        breed.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (filteredBreeds.length > 0 && !selectedBreed) {
            onBreedSelect(filteredBreeds[0]);
        }
    }, [filteredBreeds, selectedBreed, onBreedSelect]);

    useEffect(() => {
        if (filteredBreeds.length > 0 && breedsGridRef.current) {
            const handleWheel = (e) => {
                if (breedsGridRef.current) {
                    e.preventDefault();
                    
                    const scrollAmount = e.deltaY || e.deltaX;
                    
                    breedsGridRef.current.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            };
            
            const breedsGrid = breedsGridRef.current;
            
            if (breedsGrid) {
                breedsGrid.addEventListener('wheel', handleWheel, { passive: false });
                
                return () => {
                    breedsGrid.removeEventListener('wheel', handleWheel);
                };
            }
        }
    }, [filteredBreeds]);

    useEffect(() => {
        if (selectedBreed && breedsGridRef.current && selectedCardRef.current) {
            if (scrollAnimationRef.current) {
                cancelAnimationFrame(scrollAnimationRef.current);
            }
            
            const container = breedsGridRef.current;
            const selectedElement = selectedCardRef.current;
            
            const containerWidth = container.offsetWidth;
            const elementLeft = selectedElement.offsetLeft;
            const elementWidth = selectedElement.offsetWidth;
            
            const targetScrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);
            
            const startScrollPosition = container.scrollLeft;
            
            const scrollDistance = targetScrollPosition - startScrollPosition;
            
            if (Math.abs(scrollDistance) < 10) return;

            const duration = 500; 
            const startTime = performance.now();

            const animateScroll = (currentTime) => {
                const elapsedTime = currentTime - startTime;

                if (elapsedTime >= duration) {
                    container.scrollLeft = targetScrollPosition;
                    return;
                }
                
                const progress = elapsedTime / duration;
                const easeProgress = easeInOutCubic(progress);
                const newScrollPosition = startScrollPosition + (scrollDistance * easeProgress);
                
                container.scrollLeft = newScrollPosition;
                
                scrollAnimationRef.current = requestAnimationFrame(animateScroll);
            };
            
            scrollAnimationRef.current = requestAnimationFrame(animateScroll);
            
            return () => {
                if (scrollAnimationRef.current) {
                    cancelAnimationFrame(scrollAnimationRef.current);
                }
            };
        }
    }, [selectedBreed]);
    
    const easeInOutCubic = (t) => {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (isLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="breeds-container">
            <div className="breeds-header">
                <div className='breeds-header-left'>
                    
                    
                    <div className="breeds-search-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search breeds..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="breed-search-input"
                            />
                            {searchTerm && (
                                <button 
                                    className="clear-search" 
                                    onClick={() => setSearchTerm('')}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                    <h2>Available Dog Breeds ({filteredBreeds.length})</h2>
                </div>
            </div>
            
            <div className="scrollbar-container">
                <div 
                    className="breeds-grid" 
                    ref={breedsGridRef}
                    tabIndex="0"
                >
                    {filteredBreeds
                        .filter(breed => breed !== "Favorites" && breed !== "Matched")
                        .map((breed, index) => (
                            <div 
                                key={index} 
                                className={`breed-card ${selectedBreed === breed ? 'selected' : ''}`}
                                onClick={() => onBreedSelect(breed)}
                                ref={selectedBreed === breed ? selectedCardRef : null}
                            >
                                <span>{breed}</span>
                            </div>
                        ))
                    }
                    
                </div>
                
            </div>
            <div className='breeds-footer'>
                {breeds.includes("Favorites") && (
                    <div 
                        className={`header-favorites-card ${selectedBreed === "Favorites" ? 'selected' : ''}`}
                        onClick={() => onBreedSelect("Favorites")}
                    >
                        <span className="favorites-icon">★</span>
                        <span>Favorites</span>
                    </div>
                )}
                <div 
                    className={`header-matched-card ${selectedBreed === "Matched" ? 'selected' : ''} ${favoriteDogs.length === 0 ? 'disabled' : ''}`}
                    onClick={() => favoriteDogs.length > 0 ? onMatchedSelect() : null}
                >
                    <span className="matched-icon">✔</span>
                    <span>Matched</span>
                    {favoriteDogs.length === 0 && (
                        <span className="tooltip">Add favorites first</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BreedScrollBar;