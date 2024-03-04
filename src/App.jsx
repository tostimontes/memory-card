import { useState, useEffect, useRef } from 'react';
import './App.css';
import Grid from './components/Grid';
import Icon from '@mdi/react';
import { mdiAlert, mdiClose, mdiExclamationThick } from '@mdi/js';

function App() {
  const [imageSource, setImageSource] = useState(
    localStorage.getItem('imageSource') || 'cooper-hewitt',
  );

  const [difficulty, setDifficulty] = useState(
    localStorage.getItem('difficulty') || 10,
  );

  const [bestScores, setBestScores] = useState({});

  const currentScore = useRef(0);

  // TODO: set font-family depending on imagesource
  // TODO: set dialog display to flex for first visits
  // TODO: add a loading... message for fetch wait (and error catching and resolver)
  useEffect(() => {
    localStorage.setItem('difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem('imageSource', imageSource);
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
    setDifficulty(e.target.value);
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
        <select
          name="image-selection"
          id="image-selection"
          onChange={fetchImages}
          value={imageSource}
        >
          <option name="cooper-hewitt" value="cooper-hewitt">
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
            Best score: {bestScores[`${imageSource}-${difficulty}`]}
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
        <Grid difficulty={difficulty} imagesSource={imageSource}></Grid>
      </main>
    </>
  );
}

export default App;
