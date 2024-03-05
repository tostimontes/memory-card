import Card from './Card';

export default function Grid({ images, onCardClick, isInfoMode, imageSource }) {
  return (
    <div className="cards-grid">
      {images.map((imgInfo) => (
        <Card
          key={imgInfo.imageUrl}
          source={imgInfo.imageUrl}
          onClick={() => onCardClick(imgInfo.imageUrl)}
          info={imgInfo}
          isInfoMode={isInfoMode}
          imageSource={imageSource}
        />
      ))}
    </div>
  );
}
