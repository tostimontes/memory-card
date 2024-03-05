import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import Grid from './components/Grid';
import Icon from '@mdi/react';
import {
  mdiAlert,
  mdiClose,
  mdiExclamationThick,
  mdiInformation,
} from '@mdi/js';

// TODO: get more text ingo from other sources

function App() {
  const [imageSource, setImageSource] = useState(
    localStorage.getItem('imageSource') || 'cooperHewitt',
  );

  const [difficulty, setDifficulty] = useState(
    localStorage.getItem('difficulty') || 10,
  );

  const [bestScores, setBestScores] = useState(() => {
    const storedBestScores = localStorage.getItem('bestScores') || 'undefined';
    return storedBestScores !== 'undefined' ? JSON.parse(storedBestScores) : {};
  });

  const [clickedCards, setClickedCards] = useState(new Set());
  const [allImages, setAllImages] = useState([]);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoMode, setIsInfoMode] = useState(false);
  const [isClickable, setIsClickable] = useState(true);

  const currentScore = useRef(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDialog('win');
        closeDialog('instructions');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSpaceKeyPress = useCallback(() => {
    isInfoMode
      ? document.querySelector('.info-button').classList.remove('info-mode')
      : document.querySelector('.info-button').classList.add('info-mode');
    setIsInfoMode(!isInfoMode);
  });
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        handleSpaceKeyPress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSpaceKeyPress]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited) {
      showInstructions();
      localStorage.setItem('hasVisited', 'true');
    }
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
    shuffleCards(allImages);
  }, [difficulty, allImages]);

  useEffect(() => {
    async function isValidImage(url) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      } catch (error) {
        return false;
      }
    }

    const fetchObjects = async () => {
      setIsClickable(false);

      let fetchedImages = sessionStorage.getItem(imageSource) || [];
      if (fetchedImages.length > 0) {
        fetchedImages = JSON.parse(fetchedImages);
        setImages([]);
        setIsLoading(true);
        document.querySelector('.loading').classList.add('active');
        setTimeout(() => {
          setAllImages(fetchedImages);
          setIsLoading(false);
          document.querySelector('.loading').classList.remove('active');
          setIsClickable(true);
        }, 500);
      } else {
        document.querySelector('.loading').classList.add('active');
        setIsLoading(true);
        setImages([]);

        const sourcesURLs = {
          cooperHewitt: `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.tags.getObjects&access_token=${import.meta.env.VITE_COOPER_HEWITT_ACCESS_TOKEN}&type=poster&page=1&per_page=100`,
          europeana: `https://api.europeana.eu/record/v2/search.json?wskey=${import.meta.env.VITE_EUROPEANA_API_KEY}&query=painting&reusability=open&media=true&rows=100`,
          harvard: `https://api.harvardartmuseums.org/object?apikey=${import.meta.env.VITE_HARVARD_ART_MUSEUM_API_KEY}&classification=Prints&size=100&hasimage=1`,
        };
        const response = await fetch(sourcesURLs[imageSource]);
        const data = await response.json();

        switch (imageSource) {
          case 'cooperHewitt':
            fetchedImages = data.objects.reduce((acc, object) => {
              if (
                object.images &&
                object.images.length > 0 &&
                object.title &&
                object.url &&
                object.medium &&
                object.dimensions &&
                object.date &&
                object.creditline
              ) {
                const cmDimensions = object.dimensions
                  .match(/.*cm/)?.[0]
                  .trim();
                const imageInfo = {
                  imageUrl: object.images[0].n.url,
                  title: object.title,
                  url: object.url,
                  medium: object.medium,
                  dimensions: cmDimensions || object.dimensions,
                  date: object.date,
                  creditline: object.creditline,
                };

                acc.push(imageInfo);
              }
              return acc;
            }, []);
            break;
          case 'europeana':
            for (const item of data.items) {
              const imageInfo = {
                imageUrl: item.edmIsShownBy ? item.edmIsShownBy[0] : '',
                url: item.edmIsShownAt ? item.edmIsShownAt[0] : '',
                location:
                  item.dataProvider && item.country
                    ? `${item.dataProvider[0]}, ${item.country[0]}`
                    : '',
                creator:
                  item.dcCreatorLangAware?.en?.[0] ||
                  item.dcCreatorLangAware?.def?.[0] ||
                  '',
              };
              if (await isValidImage(imageInfo.imageUrl)) {
                fetchedImages.push(imageInfo);
              }
            }
            break;
          case 'harvard':
            for (const record of data.records) {
              if (
                record.images &&
                record.images.length > 0 &&
                record.images[0].baseimageurl
              ) {
                const cmDimensions = record.dimensions
                  ? record.dimensions.match(/.*cm/)?.[0].trim()
                  : '';
                const imageInfo = {
                  imageUrl: record.images[0].baseimageurl,
                  title: record.title || '',
                  url: record.url || '',
                  technique: record.technique || '',
                  dimensions: cmDimensions || record.dimensions || '',
                  date: record.dateend || '',
                  creditline: record.creditline || '',
                };

                if (await isValidImage(imageInfo.imageUrl)) {
                  fetchedImages.push(imageInfo);
                }
              }
            }
            break;

          default:
            break;
        }

        sessionStorage.setItem(imageSource, JSON.stringify(fetchedImages));
        setAllImages(fetchedImages);
        setIsLoading(false);
        document.querySelector('.loading').classList.remove('active');

        setIsClickable(true);
      }
    };

    fetchObjects();
  }, [imageSource]);

  const showInstructions = () => {
    const dialog = document.querySelector('.instructions');
    dialog.style.display = 'flex';
    dialog.showModal();
  };

  const showWinMessage = () => {
    const dialog = document.querySelector('.win');
    dialog.style.display = 'flex';
    dialog.showModal();
  };

  const closeDialog = (dialogClass) => {
    const dialog = document.querySelector(`.${dialogClass}`);
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
    if (!isClickable) return;
    if (clickedCards.has(cardId)) {
      updateBestScore();
      currentScore.current = 0;
      setClickedCards(new Set());
    } else {
      setClickedCards(new Set(clickedCards).add(cardId));
      currentScore.current += 1;
      if (currentScore.current === parseInt(difficulty)) {
        showWinMessage();
        updateBestScore();
        currentScore.current = 0;
        setClickedCards(new Set());
      }
    }
    shuffleCards(images);
  };

  const shuffleCards = (fullImageSet) => {
    setIsClickable(false); // Disable clicks during shuffling
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
      setIsClickable(true); // Re-enable clicks after shuffling
    }, 500);
  };

  const updateBestScore = () => {
    const key = `${imageSource}-${difficulty}`;
    const currentBest = bestScores[key] || 0;
    if (currentScore.current > currentBest) {
      setBestScores({ ...bestScores, [key]: currentScore.current });
    }
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
        <button
          className="info-button"
          type="button"
          onClick={handleSpaceKeyPress}
        >
          Toggle Image Info
        </button>

        <label htmlFor="image-selection">Image Source:</label>
        <select
          name="image-selection"
          id="image-selection"
          onChange={fetchImages}
          value={imageSource}
        >
          <option name="cooper-hewitt" value="cooperHewitt">
            Cooper Hewitt (Smithsonian Design Museumm) (posters)
          </option>
          <option name="europeana" value="europeana">
            Europeana (paintings)
          </option>
          <option name="harvard" value="harvard">
            Harvard Art Museum (prints)
          </option>
        </select>
        <label htmlFor="difficulty-selection">Difficulty:</label>
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
          <div className="instructions-text-wrapper">
            <button
              type="button"
              className="close-dialog"
              onClick={() => closeDialog('instructions')}
            >
              <Icon path={mdiClose} className="close-icon"></Icon>
            </button>
            <h2>
              <Icon path={mdiAlert}></Icon> WARNING: any change of museum or
              difficulty will finish the current game
            </h2>
            <ol>
              <li>
                Select a <b>source</b> for the images in the image dropdown
              </li>
              <li>
                Select a <b>difficulty</b> level dropdown
                <br />
                (Easy = 10 imgs, Medium = 20 imgs, Hard = 30 imgs)
              </li>
              <li>Wait for the images to display and...</li>
              <li>Start by clicking on any image!</li>
            </ol>
            <hr />
            <ul>
              <li>
                The goal is to click on each image <b>only once</b>.
              </li>
              <li>
                After every click, the images will reorder randomly. <br />
              </li>
              <li>
                If you select all the images only once, congratulations! You
                won!
              </li>
              <br />
              <Icon path={mdiExclamationThick}></Icon>
              <i>
                The best score reflects your best score for each image source
                and difficulty
              </i>
              <hr />
              <p>
                <Icon path={mdiInformation}></Icon> Press the <b>Spacebar</b> at
                any time during the game to activate the
                <b> Image Info Mode</b>. This will temporarily disable the
                memory game's click functionality and allow you to hover over
                each image to get information about it.
              </p>
            </ul>
            <div>
              Image sources:
              <ul>
                <li>
                  <a href="URL_for_Cooper_Hewitt">
                    Cooper Hewitt Smithsonian Design Museum
                  </a>{' '}
                  (posters)
                </li>
                <li>
                  <a href="URL_for_Europeana">Europeana</a> (paintings)
                </li>
                <li>
                  <a href="URL_for_Harvard_Art_Museum">Harvard Art Museums</a>{' '}
                  (prints)
                </li>
              </ul>
            </div>
          </div>
        </dialog>
        <dialog className="win">
          <button
            type="button"
            className="close-dialog"
            onClick={() => closeDialog('win')}
          >
            <Icon path={mdiClose} className="close-icon"></Icon>
          </button>
          <p>You won!</p>
          {parseInt(difficulty) < 30 ? (
            <p>Try the next level!</p>
          ) : (
            <p>Try with another museum!</p>
          )}
        </dialog>
        <p className="loading">{isLoading ? 'loading images' : null}</p>
        <Grid
          images={images.slice(0, difficulty)}
          onCardClick={isInfoMode ? null : handleCardClick}
          isInfoMode={isInfoMode}
          imageSource={imageSource}
        ></Grid>
      </main>
    </>
  );
}

export default App;
