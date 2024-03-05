import { useEffect, useRef } from 'react';

function adjustFontSizeToFit(container, elements) {
  const containerHeight = container.clientHeight;
  let fontSize = parseFloat(
    window.getComputedStyle(elements[0], null).getPropertyValue('font-size'),
  );

  const getTotalHeight = () =>
    elements.reduce((total, el) => total + el.scrollHeight, 0);

  while (getTotalHeight() > containerHeight && fontSize > 0) {
    fontSize -= 0.5; // Decrease font size slightly for finer control
    elements.forEach((el) => (el.style.fontSize = fontSize + 'px'));
  }
}

export default function Card({ source, onClick, isInfoMode, info }) {
  const titleRef = useRef(null);
  const mediumRef = useRef(null);
  const dimensionsRef = useRef(null);
  const creditlineRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    if (isInfoMode) {
      const textElements = [
        titleRef.current,
        mediumRef.current,
        dimensionsRef.current,
        creditlineRef.current,
      ];
      adjustFontSizeToFit(backRef.current, textElements);
    }
  }, [isInfoMode]);
  return (
    <div className="card" onClick={onClick}>
      <div className={`card-inner ${isInfoMode ? 'hover' : ''}`}>
        <div className="card-front">
          <img src={source} alt="" />
        </div>
        <div className="card-back" ref={backRef}>
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
        </div>{' '}
      </div>
    </div>
  );
}

// Assuming adjustFontSizeToFit is defined here or imported
