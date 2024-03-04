import { useState, useEffect } from 'react';
import Card from './Card';

export default function Grid({ difficulty, imagesSource }) {
  const [images, setImages] = useState([]);

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
    <div className="cards-grid">
      {images.slice(0, difficulty).map((img, index) => (
        <Card key={index} src={img} alt=""></Card>
      ))}
    </div>
  );
}
