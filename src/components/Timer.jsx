export default function Timer({ timeRemaining }) {

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;  
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const timePercentage = (timeRemaining / 300) * 100; 
  
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Time Remaining</div>
          <div className="stat-value">{formattedTime}</div>
        </div>
      </div>
      <progress 
        className={`progress w-56 mt-2 ${timeRemaining < 60 ? 'progress-error' : 'progress-primary'}`} 
        value={timePercentage} 
        max="100"
      ></progress>
    </div>
  );
}