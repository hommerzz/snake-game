import { Achievements } from '../constants/achievements'
import '../styles/Modal.css'

const Statistics = ({ stats, achievements, onClose }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>游戏统计</h2>
        
        <div className="stats-section">
          <h3>总体统计</h3>
          <ul className="stats-list">
            <li>游戏次数: {stats.totalGames}</li>
            <li>总得分: {stats.totalScore}</li>
            <li>最高分: {stats.highestScore}</li>
            <li>总游戏时间: {formatTime(stats.totalTime)}</li>
            <li>最长游戏: {formatTime(stats.longestGame)}</li>
            <li>平均得分: {stats.totalGames ? (stats.totalScore / stats.totalGames).toFixed(1) : 0}</li>
          </ul>
        </div>

        <div className="achievements-section">
          <h3>成就</h3>
          <div className="achievements-grid">
            {Object.entries(Achievements).map(([key, achievement]) => (
              <div 
                key={key} 
                className={`achievement-item ${achievements[key] ? 'unlocked' : 'locked'}`}
              >
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>关闭</button>
      </div>
    </div>
  )
}

export default Statistics