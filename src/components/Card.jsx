export default function Card({ source, onClick, isInfoMode }) {
  return (
    <div className="card" onClick={onClick}>
      <div className={`card-inner ${isInfoMode ? 'hover' : ''}`}>
        <div className="card-front">
          <img src={source} alt="" />
        </div>
        <div className="card-back">{source}</div>
      </div>
    </div>
  );
}
