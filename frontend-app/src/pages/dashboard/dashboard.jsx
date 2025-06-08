import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';
import { Link } from 'react-router-dom';

import { dogsService } from '../../services/endpoints/dogs';
import BreedScrollBar from './components/breedScrollBar/breedScrollBar';
import BreedDogCards from './components/breedDogCards/breedDogCards';
import MatchedDogModal from './components/matchedDogModal/matchedDogModal';

import './dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [favoriteDogs, setFavoriteDogs] = useState([]);
  const [matchedDogs, setMatchedDogs] = useState([]);
  const [showMatchedModal, setShowMatchedModal] = useState(false);
  
  const handleLogout = () => {
    logout();
  };


  useEffect(() => {
    const getAllDogBreeds = async () => {
      try {
        setIsLoading(true);
        const response = await dogsService.getAllDogBreeds();
        if (response && response.length > 0) {
          const allOptions = ["Favorites", ...response];
          setBreeds(allOptions);

          setSelectedBreed('Affenpinscher');
          
        }
      } catch (error) {
        alert('Error fetching dog breeds. Please try again later.', error);
      } finally {
        setIsLoading(false);
      }
    }

    getAllDogBreeds();
  }, []);

  const handleMatchedSelect = async () => {
    setIsLoading(true);
    try {
      if (favoriteDogs.length === 0) {
        setMatchedDogs([]);
        setIsLoading(false);
        return;
      }
      const matchedDogsResponse = await dogsService.getMatchedDogs(favoriteDogs);
      if (matchedDogsResponse.match) {
        const matchedId = [matchedDogsResponse.match];
        const matchedDogDetails = await dogsService.getDogInfoByIds(matchedId);

        if (matchedDogDetails && matchedDogDetails.length > 0) {
          setMatchedDogs(matchedDogDetails);

          setShowMatchedModal(true);
        } else {
          setMatchedDogs([]);
        }
      }
    } catch (error) {
      alert('Error fetching matched dogs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleBreedSelect = async(breed) => {

    setSelectedBreed(breed);

    
  };

  const closeMatchModal = () => {
    setShowMatchedModal(false);
  };

  
  return (
    <div className="dashboard-container">
      <div className='dashboard-header'>
        <img 
          src='https://t4.ftcdn.net/jpg/06/47/28/21/360_F_647282134_hD733iuOcRjHaiqiEjq3DuCNqY3AmHPy.jpg' 
          alt='Dashboard Header' 
          className='dashboard-header-image'
        />
      </div>
      <div className="dashboard-content">
        <h1>Dog Breeds Explorer</h1>
        
        <div className="dashboard-actions">

          
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <BreedScrollBar 
          breeds={breeds} 
          isLoading={isLoading}
          selectedBreed={selectedBreed}
          onBreedSelect={handleBreedSelect}
          onMatchedSelect={handleMatchedSelect}
          favoriteDogs={favoriteDogs}
        />
        {selectedBreed && (
          <BreedDogCards 
            breed={selectedBreed}
            favoriteDogs={favoriteDogs}
            setFavoriteDogs={setFavoriteDogs}
            matchedDogs={matchedDogs}
            setMatchedDogs={setMatchedDogs}
          />
        )}

        {matchedDogs.length > 0 && (
          <MatchedDogModal 
            dog={matchedDogs[0]} 
            isOpen={showMatchedModal} 
            onClose={closeMatchModal} 
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;