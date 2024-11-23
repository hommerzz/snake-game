import '../styles/VirtualControls.css'

const VirtualControls = ({ onDirectionChange, currentDirection, visible }) => {
  if (!visible) return null

  return (
    <div className="virtual-controls">
      <div className="control-row">
        <button 
          className={`control-btn ${currentDirection === 'UP' ? 'active' : ''}`}
          onClick={() => currentDirection !== 'DOWN' && onDirectionChange('UP')}
        >
          ↑
        </button>
      </div>
      <div className="control-row">
        <button 
          className={`control-btn ${currentDirection === 'LEFT' ? 'active' : ''}`}
          onClick={() => currentDirection !== 'RIGHT' && onDirectionChange('LEFT')}
        >
          ←
        </button>
        <button 
          className={`control-btn ${currentDirection === 'RIGHT' ? 'active' : ''}`}
          onClick={() => currentDirection !== 'LEFT' && onDirectionChange('RIGHT')}
        >
          →
        </button>
      </div>
      <div className="control-row">
        <button 
          className={`control-btn ${currentDirection === 'DOWN' ? 'active' : ''}`}
          onClick={() => currentDirection !== 'UP' && onDirectionChange('DOWN')}
        >
          ↓
        </button>
      </div>
    </div>
  )
}

export default VirtualControls