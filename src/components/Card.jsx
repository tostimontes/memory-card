import { useEffect, useRef } from 'react';

function adjustFontSizeToFit(container, elements) {
  const containerHeight = container.clientHeight;
  let fontSize = parseFloat(
    window.getComputedStyle(elements[0], null).getPropertyValue('font-size'),
  );

  const getTotalHeight = () =>
    elements.reduce((total, el) => total + el.scrollHeight, 0);

  while (getTotalHeight() > containerHeight && fontSize > 0) {
    fontSize -= 0.5;
    elements.forEach((el) => (el.style.fontSize = fontSize + 'px'));
  }
}

export default function Card({
  source,
  onClick,
  isInfoMode,
  info,
  imageSource,
}) {
  const titleRef = useRef(null);
  const mediumRef = useRef(null);
  const dimensionsRef = useRef(null);
  const creditlineRef = useRef(null);
  const locationRef = useRef(null);
  const creatorRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    if (isInfoMode) {
      let textElements = [];

      switch (imageSource) {
        case 'cooperHewitt':
          textElements = [
            titleRef.current,
            mediumRef.current,
            dimensionsRef.current,
            creditlineRef.current,
          ];
          break;
        case 'europeana':
          textElements = [locationRef.current, creatorRef.current];
          break;
        case 'harvard':
          textElements = [
            titleRef.current,
            mediumRef.current,
            dimensionsRef.current,
            creditlineRef.current,
          ];
          break;

        // Add cases for other sources as necessary
      }

      adjustFontSizeToFit(backRef.current, textElements);
    }
  }, [isInfoMode, imageSource]);

  const renderCardBackContent = () => {
    switch (imageSource) {
      case 'cooperHewitt':
        return (
          <>
            <a
              href={info.url}
              target="_blank"
              ref={titleRef}
              rel="noopener noreferrer"
            >
              {info.title}
            </a>
            <p ref={mediumRef}>{`${info.medium}, ${info.date}`}</p>
            <p ref={dimensionsRef}>{info.dimensions}</p>
            <p ref={creditlineRef}>{info.creditline}</p>
          </>
        );
      case 'europeana':
        return (
          <>
            <a
              href={info.url}
              target="_blank"
              ref={locationRef}
              rel="noopener noreferrer"
            >
              {info.location}
            </a>
            <p ref={creatorRef}>{info.creator}</p>
          </>
        ); // Add more cases for other image sources here
      case 'harvard':
        return (
          <>
            <a
              href={info.url}
              target="_blank"
              ref={titleRef}
              rel="noopener noreferrer"
            >
              {info.title}
            </a>
            <p ref={mediumRef}>
              {info.technique ? `${info.technique}, ` : ''}
              {info.date}
            </p>
            <p ref={dimensionsRef}>{info.dimensions}</p>
            <p ref={creditlineRef}>{info.creditline}</p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card" onClick={onClick}>
      <div className={`card-inner ${isInfoMode ? 'hover' : ''}`}>
        <div className="card-front">
          <img src={source} alt="" />
        </div>
        <div className="card-back" ref={backRef}>
          {renderCardBackContent()}
        </div>
      </div>
    </div>
  );
}
