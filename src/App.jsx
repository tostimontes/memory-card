import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [difficulty, setDifficulty] = useState(10);
  // TODO: add URL state that can hold 3-4 different APIs
  // ! PASS FETCH FUNCTIONALITY TO THE CARD CONTAINER COMPONENT, which should get the fetch url and difficulty as props
  // TODO: add a loading... message for fetch wait (and error catching and resolver)

  const changeDifficulty = (e) => {
    setDifficulty(e.target.value);
  };

  useEffect(() => {
    const fetchObjects = async () => {
      const response = await fetch(
        `https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.tags.getObjects&access_token=${import.meta.env.VITE_COOPER_HEWITT_ACCESS_TOKEN}&type=poster&page=1&per_page=100`,
      );
      const data = await response.json();
      const newImages = data.objects.reduce((acc, object) => {
        if (object.images && object.images.length > 0) {
          acc.push(object.images[0].n.url);
        }
        return acc;
      }, []);

      setImages(newImages);
    };

    fetchObjects();
  }, [difficulty]);

  return (
    <div>
      <select
        name="difficulty"
        id="difficulty-selection"
        onChange={changeDifficulty}
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
      {images.slice(0, difficulty).map((img, index) => (
        <img key={index} src={img} alt={`Image ${index}`} />
      ))}
    </div>
  );
}

export default App;
