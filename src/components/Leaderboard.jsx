import React, { useState } from 'react'
import './Leaderboard.css'
import { GameModes } from '../constants/gameModes'

const Leaderboard = ({ data, currentScore, gameMode, onClose }) => {
  const [selectedMode, setSelectedMode] = useState('ALL')
  
  const filteredData = selectedMode === 'ALL' 
    ? data 
    : data.filter(item => item.mode === selectedMode)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const getModeName = (modeKey) => {
    return GameModes[modeKey]?.name || modeKey
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content leaderboard">
        <h2>排行榜</h2>
        
        <div className="mode-selector">
          <select 
            value={selectedMode} 
            onChange={(e) => setSelectedMode(e.target.value)}
          >
            <option value="ALL">所有模式</option>
            {Object.keys(GameModes).map(mode => (
              <option key={mode} value={mode}>
                {GameModes[mode].name}
              </option>
            ))}
          </select>
        </div>

        <div className="leaderboard-list">
          {filteredData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>排名</th>
                  <th>玩家</th>
                  <th>分数</th>
                  <th>模式</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr 
                    key={`${item.date}-${index}`} 
                    className={item.score === currentScore ? 'current-score' : ''}
                  >
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.score}</td>
                    <td>{getModeName(item.mode)}</td>
                    <td>{formatDate(item.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">暂无记录</p>
          )}
        </div>

        <div className="leaderboard-footer">
          <button className="close-button" onClick={onClose}>关闭</button>
          {currentScore > 0 && (
            <p className="current-game">
              当前游戏: {currentScore} 分 ({getModeName(gameMode)})
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard