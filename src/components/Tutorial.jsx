import '../styles/Modal.css'

const Tutorial = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>游戏教程</h2>
        
        <div className="tutorial-section">
          <h3>基本玩法</h3>
          <ul>
            <li>使用方向键或WASD控制蛇的移动</li>
            <li>吃到食物可以增长身体并得分</li>
            <li>撞到墙壁或自己的身体会游戏结束</li>
          </ul>
        </div>

        <div className="tutorial-section">
          <h3>食物类型</h3>
          <ul>
            <li>🔴 普通食物：1分</li>
            <li>🟡 特殊食物：3分</li>
            <li>🟣 超级食物：5分</li>
            <li>🔵 技能食物：获得随机技能</li>
          </ul>
        </div>

        <div className="tutorial-section">
          <h3>游戏模式</h3>
          <ul>
            <li>经典模式：传统贪吃蛇玩法</li>
            <li>穿墙模式：可以从边界穿过</li>
            <li>迷宫模式：需要避开障碍物</li>
            <li>双人模式：两名玩家同时游戏</li>
          </ul>
        </div>

        <div className="tutorial-section">
          <h3>技能系统</h3>
          <ul>
            <li>⚡ 加速：暂时提升移动速度</li>
            <li>🌀 穿墙：可以穿过墙壁</li>
            <li>⭐ 无敌：暂时无视碰撞</li>
          </ul>
        </div>

        <button className="close-btn" onClick={onClose}>开始游戏</button>
      </div>
    </div>
  )
}

export default Tutorial
