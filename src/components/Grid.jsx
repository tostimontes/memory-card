import Card from './Card';

export default function Grid({ images, onCardClick }) {
  return (
    <div className="cards-grid">
      {images.map((img) => (
        <Card
          key={img}
          source={img}
          alt=""
          onClick={() => onCardClick(img)}
        ></Card>
      ))}
    </div>
  );
}
