import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './breedDogCards.css';

import DogModal from '../dogModal/dogModal';
import { dogsService } from '../../../../services/endpoints/dogs';

const BreedDogCards = ({ breed='Affenpinscher', favoriteDogs, setFavoriteDogs }) => {
    const [dogIds, setDogIds] = useState([]);
    const [dogCardinfo, setDogCardInfo] = useState([]);
    const [selectedDog, setSelectedDog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    //sorting and filtering states
    const [filterBy, setFilterBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc'); 

    // pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextPageUrl, setNextPageUrl] = useState('');
    const [prevPageUrl, setPrevPageUrl] = useState('');
    const DOGS_PER_PAGE = 8; 

    const fetchDogsForPage = async (breedName, page = 1) => {
        setIsLoading(true);
        
        try {
            breedName = Array.isArray(breedName) ? String(breedName) : breedName;
            console.log('breedName:', breedName, 'type:', typeof breedName);
            const from = (page - 1) * DOGS_PER_PAGE;
            const dogIdsResponse = await dogsService.getDogsByBreed(
                breedName, 
                DOGS_PER_PAGE, 
                from, 
                `${filterBy}:${sortOrder}`
            );
            
            if (!dogIdsResponse || !dogIdsResponse.resultIds || dogIdsResponse.resultIds.length === 0) {
                alert('No dogs found for this page');
                return false;
            }
            
            const dogDetails = await dogsService.getDogInfoByIds(dogIdsResponse.resultIds);

            
            const filteredDogDetails = dogDetails.filter(dog => dog.breed === breedName);
            
            
            if (filteredDogDetails.length < dogDetails.length) {
                console.warn(`API returned ${dogDetails.length - filteredDogDetails.length} dogs of breeds other than ${breedName}`);
            }
            
            setDogIds(filteredDogDetails.map(dog => dog.id));
            setDogCardInfo(filteredDogDetails);

            setNextPageUrl(dogIdsResponse.next);
            setPrevPageUrl(dogIdsResponse.prev);
            setTotalPages(Math.ceil(dogIdsResponse.total / DOGS_PER_PAGE));
            setCurrentPage(page);
            
            return true;
        } catch (error) {
            alert('Error fetching dogs for page:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchDogs = async () => {
            setIsLoading(true);
            
            if (!breed) {
                alert('Breed is not selected or provided');
                setIsLoading(false);
                return;
            }

            if (breed === 'Favorites') {
                if (favoriteDogs.length > 0) {
                    try {
                        const dogDetails = await dogsService.getDogInfoByIds(favoriteDogs);
                        let sortedDogs = [...dogDetails];
                        sortedDogs.sort((a, b) => {
                            if (filterBy === 'name') {
                                return sortOrder === 'asc' 
                                    ? a.name.localeCompare(b.name)
                                    : b.name.localeCompare(a.name);
                            } else if (filterBy === 'age') {
                                return sortOrder === 'asc' 
                                    ? a.age - b.age 
                                    : b.age - a.age;
                            }
                            return 0;
                        });
                        
                        const startIndex = (currentPage - 1) * DOGS_PER_PAGE;
                        const endIndex = startIndex + DOGS_PER_PAGE;
                        
                        const dogsForCurrentPage = sortedDogs.slice(startIndex, endIndex);
                        
                        setDogCardInfo(dogsForCurrentPage);
                        setTotalPages(Math.ceil(favoriteDogs.length / DOGS_PER_PAGE));
                        
                        setNextPageUrl(currentPage < Math.ceil(favoriteDogs.length / DOGS_PER_PAGE) ? 'favorites-next' : '');
                        setPrevPageUrl(currentPage > 1 ? 'favorites-prev' : '');
                    } catch (error) {
                        alert('Error fetching favorite dogs:', error);
                    }
                } else {
                    setDogCardInfo([]);
                    setTotalPages(1);
                }
                setIsLoading(false);
                return;
            }

            const success = await fetchDogsForPage(breed);
            if (!success) {
                alert('Failed to fetch dogs for the selected breed');
            }
        }

        fetchDogs();
    }, [breed, filterBy, sortOrder, favoriteDogs]);

    const handleFilterChange = (newFilter, newSortOrder) => {
        setCurrentPage(1);
        
        setFilterBy(newFilter);
        setSortOrder(newSortOrder);
        
        setIsLoading(true);
    };

    const handlePageChange = async (action, url) => {
        setIsLoading(true);
        
        try {
            if (breed === 'Favorites') {
                let newPage = currentPage;
                
                if (action === 'next' && currentPage < totalPages) {
                    newPage = currentPage + 1;
                } else if (action === 'prev' && currentPage > 1) {
                    newPage = currentPage - 1;
                }
                
                if (newPage !== currentPage) {
                    const dogDetails = await dogsService.getDogInfoByIds(favoriteDogs);
                    
                    let sortedDogs = [...dogDetails];
                    sortedDogs.sort((a, b) => {
                        if (filterBy === 'name') {
                            return sortOrder === 'asc' 
                                ? a.name.localeCompare(b.name)
                                : b.name.localeCompare(a.name);
                        } else if (filterBy === 'age') {
                            return sortOrder === 'asc' 
                                ? a.age - b.age 
                                : b.age - a.age;
                        }
                        return 0;
                    });

                    const startIndex = (newPage - 1) * DOGS_PER_PAGE;
                    const endIndex = startIndex + DOGS_PER_PAGE;

                    const dogsForNewPage = sortedDogs.slice(startIndex, endIndex);
                    
                    setDogCardInfo(dogsForNewPage);
                    setCurrentPage(newPage);

                    setNextPageUrl(newPage < totalPages ? 'favorites-next' : '');
                    setPrevPageUrl(newPage > 1 ? 'favorites-prev' : '');
                }
                
                setIsLoading(false);
                return;
            }

            if (url) {
                const dogIdsResponse = await dogsService.getNextDogInfosByUrl(url);
                
                if (dogIdsResponse && dogIdsResponse.resultIds && dogIdsResponse.resultIds.length > 0) {
                    const dogInfoResponse = await dogsService.getDogInfoByIds(dogIdsResponse.resultIds);

                    if (action === 'next') {
                        setCurrentPage(prev => prev + 1);
                    } else if (action === 'prev') {
                        setCurrentPage(prev => prev - 1);
                    }

                    setDogCardInfo(dogInfoResponse);
                    setNextPageUrl(dogIdsResponse.next);
                    setPrevPageUrl(dogIdsResponse.prev);

                    if (dogIdsResponse.total) {
                        setTotalPages(Math.ceil(dogIdsResponse.total / DOGS_PER_PAGE));
                    }
                }
            }
        } catch (error) {
            alert('Error fetching page data:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const openDogModal = (dog) => {
        setSelectedDog(dog);
        setIsModalOpen(true);
    };
    
    const closeDogModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedDog(null), 300);
    };

    const handleFavoriteToggle = (dogId) => {
        setFavoriteDogs((prevFavorites) => {
            if (prevFavorites.includes(dogId)) {
                return prevFavorites.filter(id => id !== dogId);
            } else {
                return [...prevFavorites, dogId];
            }
        })
    }

    const isDogFavorite = (dogId) => {
        return favoriteDogs.includes(dogId);
    }

    const SkeletonCards = () => {
        return (
            <>
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="dog-card skeleton">
                        <div className="dog-card-image-container skeleton-image"></div>
                        <div className="dog-card-content">
                            <div className="skeleton-text skeleton-title"></div>
                            <div className="skeleton-text skeleton-subtitle"></div>
                            <div className="skeleton-text skeleton-subtitle shorter"></div>
                        </div>
                    </div>
                ))}
            </>
        );
    };
    
    return (
        <div className="breed-card-container">
            <div className='breed-card-filter-sort'>
                <div className="filter-controls">
                    <div className="filter-label">Sort by:</div>
                    <div className="filter-options">
                        <button 
                            className={`filter-button ${filterBy === 'name' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('name', filterBy === 'name' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc')}
                        >
                            Name
                            {filterBy === 'name' && (
                                <span className="sort-icon">
                                    {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                                </span>
                            )}
                        </button>
                        <button 
                            className={`filter-button ${filterBy === 'age' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('age', filterBy === 'age' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc')}
                        >
                            Age
                            {filterBy === 'age' && (
                                <span className="sort-icon">
                                    {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className="dog-cards-grid">
                {isLoading ? (
                    <SkeletonCards />
                ) : (
                    dogCardinfo.map((dog) => (
                        <div 
                            key={dog.id} 
                            className={`dog-card ${isDogFavorite(dog.id) ? 'is-favorite' : ''}`}
                            onClick={() => openDogModal(dog)}
                        >
                            {isDogFavorite(dog.id) && (
                                <span className="favorite-indicator">★</span>
                            )}
                            <div className="dog-card-image-container">
                                <img 
                                    src={dog.img} 
                                    alt={dog.name} 
                                    className="dog-card-image"
                                />
                            </div>
                            <div className="dog-card-content">
                                <h4 className="dog-card-name">{dog.name}</h4>
                                <p className="dog-card-breed">{dog.breed}</p>
                                <p className="dog-card-age">Age: {dog.age} {dog.age === 1 ? 'year' : 'years'}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <DogModal 
                dog={selectedDog}
                isOpen={isModalOpen}
                onClose={closeDogModal}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={selectedDog ? isDogFavorite(selectedDog.id) : false}
            />

            <div className="pagination-controls">
                <button 
                    className="pagination-button" 
                    onClick={() => handlePageChange('prev', prevPageUrl)} 
                    disabled={!prevPageUrl || isLoading}
                >
                    Previous
                </button>
                <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    className="pagination-button" 
                    onClick={() => handlePageChange('next', nextPageUrl)} 
                    disabled={!nextPageUrl || isLoading || currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default BreedDogCards;