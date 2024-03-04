import { useState, useEffect, useRef } from 'react';
import './App.css';
import Grid from './components/Grid';
import Icon from '@mdi/react';
import { mdiAlert, mdiClose, mdiExclamationThick } from '@mdi/js';

function App() {
  const [imageSource, setImageSource] = useState(
    localStorage.getItem('imageSource') || 'cooperHewitt',
  );

  const [difficulty, setDifficulty] = useState(
    localStorage.getItem('difficulty') || 10,
  );

  const [bestScores, setBestScores] = useState(() => {
    const storedBestScores = localStorage.getItem('bestScores');
    return storedBestScores !== 'undefined' ? JSON.parse(storedBestScores) : {};
  });

  const [clickedCards, setClickedCards] = useState(new Set());
  const [allImages, setAllImages] = useState([]);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentScore = useRef(0);

  // TODO: set font-family depending on imagesource
  // TODO: set dialog display to flex for first visits
  // TODO: add a loading... message for fetch wait (and error catching and resolver)
  // TODO: button to enable hover over images for info (make them rotateY with perspective to show their back with the poster info)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDialog();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  useEffect(() => {
    localStorage.setItem('difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem('imageSource', imageSource);
  }, [imageSource]);

  useEffect(() => {
    localStorage.setItem('bestScores', JSON.stringify(bestScores));
  }, [bestScores]);

  useEffect(() => {
    shuffleCards(allImages); // Shuffle the full set of images
  }, [difficulty, allImages]);

  useEffect(() => {
    const fetchObjects = async () => {
      setIsLoading(true);
      const sourcesURLs = {
        cooperHewitt: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.tags.getObjects&access_token=${import.meta.env.VITE_COOPER_HEWITT_ACCESS_TOKEN}&type=poster&page=1&per_page=100`,
      };
      const response = await fetch(sourcesURLs[imageSource]);
      const data = await response.json();
      const newImages = data.objects.reduce((acc, object) => {
        if (object.images && object.images.length > 0) {
          acc.push(object.images[0].n.url);
        }
        return acc;
      }, []);

      setAllImages(newImages);
      // shuffleCards();
      setIsLoading(false);
    };

    fetchObjects();
  }, [imageSource]);

  const showInstructions = () => {
    const dialog = document.querySelector('dialog');
    dialog.style.display = 'flex';
    dialog.showModal();
  };

  const closeDialog = () => {
    const dialog = document.querySelector('dialog');
    dialog.style.display = 'none';
    dialog.close();
  };

  const fetchImages = (e) => {
    setImageSource(e.target.value);
  };

  const changeDifficulty = (e) => {
    currentScore.current = 0;
    setDifficulty(e.target.value);
    e.target.value === '30'
      ? (document.querySelector('.cards-grid').style.gridTemplateColumns =
          'repeat(6, 1fr)')
      : (document.querySelector('.cards-grid').style.gridTemplateColumns =
          'repeat(5, 1fr)');
  };
  const handleCardClick = (cardId) => {
    if (clickedCards.has(cardId)) {
      updateBestScore();
      currentScore.current = 0;
      setClickedCards(new Set());
    } else {
      setClickedCards(new Set(clickedCards).add(cardId));
      currentScore.current += 1;
    }
    shuffleCards(images);
  };

  const shuffleCards = (fullImageSet) => {
    const grid = document.querySelector('.cards-grid');
    grid.classList.add('shuffle');

    setTimeout(() => {
      let shuffledImages = [...fullImageSet];
      for (let i = shuffledImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledImages[i], shuffledImages[j]] = [
          shuffledImages[j],
          shuffledImages[i],
        ];
      }
      setImages(shuffledImages.slice(0, difficulty));
      grid.classList.remove('shuffle');
    }, 500);
  };

  const updateBestScore = () => {
    const key = `${imageSource}-${difficulty}`;
    const currentBest = bestScores[key] || 0;
    if (currentScore.current > currentBest) {
      setBestScores({ ...bestScores, [key]: currentScore.current });
    }
    console.log(bestScores);
  };

  return (
    <>
      <aside>
        <h1>Memory Card Game</h1>
        <button
          className="instructions-button"
          type="button"
          onClick={showInstructions}
        >
          Instructions
        </button>
        <select
          name="image-selection"
          id="image-selection"
          onChange={fetchImages}
          value={imageSource}
        >
          <option name="cooper-hewitt" value="cooperHewitt">
            Cooper Hewitt
          </option>
        </select>
        <select
          name="difficulty"
          id="difficulty-selection"
          onChange={changeDifficulty}
          value={difficulty}
        >
          <option name="easy" value="10">
            Easy
          </option>
          <option name="medium" value="20">
            Medium
          </option>
          <option name="hard" value="30">
            Hard
          </option>
        </select>
        <div className="scoreboard">
          <p className="current-score">Current score: {currentScore.current}</p>
          <p className="best-score">
            Best score: {bestScores[`${imageSource}-${difficulty}`] || 0}
          </p>
        </div>
      </aside>
      <main>
        <dialog className="instructions">
          <button type="button" className="close-dialog" onClick={closeDialog}>
            <Icon path={mdiClose} className="close-icon"></Icon>
          </button>
          <h2>
            <Icon path={mdiAlert}></Icon> WARNING: any change in the dropdowns
            will finish the current game
          </h2>
          <ol>
            <li>Select a source for the images in the image dropdown</li>
            <li>
              Select a difficulty level dropdown
              <br />
              (Easy = 10 imgs, Medium = 20 imgs, Hard = 30 imgs)
            </li>
            <li>Wait for the images to display and...</li>
            <li>Start by clicking on any image!</li>
          </ol>
          <hr />
          <ul>
            <li>The goal is to click on each image only once.</li>
            <li>
              After every click, the images will reorder randomly. <br />
            </li>
            <li>
              If you select all the images only once, congratulations! You won!
            </li>
            <br />
            <Icon path={mdiExclamationThick}></Icon>
            <i>
              The best score reflects your best score for each image source and
              difficulty
            </i>
          </ul>
        </dialog>
        <p className="loading">{isLoading ? 'loading images...' : null}</p>
        <Grid
          images={images.slice(0, difficulty)}
          onCardClick={handleCardClick}
        ></Grid>
      </main>
    </>
  );
}

export default App;
