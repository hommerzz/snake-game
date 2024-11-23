import { Themes } from '../constants/themes'
import '../styles/Modal.css'

const Settings = ({ 
  difficulty, 
  setDifficulty, 
  volume, 
  setVolume, 
  audioEnabled, 
  setAudioEnabled,
  theme,
  setTheme,
  bgmPlaying,
  setBgmPlaying,  // 新增
  onClose 
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>设置</h2>
        
        <div className="setting-group">
          <h3>难度</h3>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="EASY">简单</option>
            <option value="MEDIUM">中等</option>
            <option value="HARD">困难</option>
          </select>
        </div>

        <div className="setting-group">
          <h3>音效</h3>
          <label>
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
            />
            启用音效
          </label>
          <div className="volume-control">
            <span>音量</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              disabled={!audioEnabled}
            />
          </div>
        </div>

        <div className="setting-group">
          <h3>主题</h3>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            {Object.entries(Themes).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
        </div>

        <div className="setting-group">
          <h3>控制说明</h3>
          <ul className="controls-list">
            <li>方向键 / WASD：控制移动</li>
            <li>空格键：暂停游戏</li>
            <li>Enter：重新开始</li>
          </ul>
        </div>

        <button className="close-btn" onClick={onClose}>关闭</button>
      </div>
    </div>
  )
}

export default Settings