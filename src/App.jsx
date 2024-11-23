import { useState, useEffect, useRef } from 'react'
import './App.css'
import { GameModes } from './constants/gameModes'
import { Themes } from './constants/themes'
import { Skills } from './constants/skills'
import { Achievements } from './constants/achievements'
import ParticleEffect from './components/ParticleEffect'
import VirtualControls from './components/VirtualControls'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import Tutorial from './components/Tutorial'
import Leaderboard from './components/Leaderboard'

// 游戏配置
const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150
const SPEED_INCREASE = 0.95
const MAX_SPEED = 50

// 食物类型配置
const FOOD_TYPES = {
  NORMAL: { points: 1, color: '#e74c3c', chance: 0.7 },
  SPECIAL: { points: 3, color: '#f1c40f', chance: 0.2 },
  SUPER: { points: 5, color: '#9b59b6', chance: 0.08 },
  SKILL: { points: 1, color: '#3498db', chance: 0.02 }
}

function App() {
  // 游戏状态
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [direction, setDirection] = useState('RIGHT')
  const [food, setFood] = useState(generateFood())
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('snakeHighScore')) || 0
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED)
  const [difficulty, setDifficulty] = useState('NORMAL')
  const [currentTheme, setCurrentTheme] = useState('LIGHT')
  const [gameMode, setGameMode] = useState('CLASSIC')
  const [obstacles, setObstacles] = useState([])
  const [activeSkills, setActiveSkills] = useState([])
  const [particles, setParticles] = useState([])
  const [playerName, setPlayerName] = useState(
    localStorage.getItem('playerName') || ''
  )
  
  // 音频状态
  const [volume, setVolume] = useState(0.5)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [bgmPlaying, setBgmPlaying] = useState(false)

  // 排行榜状态
  const [leaderboard, setLeaderboard] = useState(() => {
    const savedLeaderboard = localStorage.getItem('snakeLeaderboard')
    return savedLeaderboard ? JSON.parse(savedLeaderboard) : []
  })
  
  // 界面状态
  const [showSettings, setShowSettings] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showStats, setShowStats] = useState(false)
  
  // 统计数据
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('snakeStats')
    return savedStats ? JSON.parse(savedStats) : {
      totalGames: 0,
      totalScore: 0,
      highestScore: 0,
      totalTime: 0,
      achievements: {}
    }
  })

  // 音频系统
  const audioRef = useRef({
    bgm: new Audio('/sounds/bgm.mp3'),
    eat: new Audio('/sounds/eat.mp3'),
    gameOver: new Audio('/sounds/gameover.mp3'),
    skill: new Audio('/sounds/skill.mp3')
  })

  // 初始化音频系统
  useEffect(() => {
    const audio = audioRef.current
    
    // 设置背景音乐的高品质配置
    audio.bgm.preload = 'auto'
    audio.bgm.loop = true
    audio.bgm.volume = volume * 0.4
    
    // 设置音效的音量
    audio.eat.volume = volume * 0.6
    audio.gameOver.volume = volume * 0.6
    audio.skill.volume = volume * 0.6

    return () => {
      Object.values(audio).forEach(sound => {
        sound.pause()
        sound.currentTime = 0
      })
    }
  }, [])

  // 音量控制
  useEffect(() => {
    const audio = audioRef.current
    audio.bgm.volume = volume * 0.4
    audio.eat.volume = volume * 0.6
    audio.gameOver.volume = volume * 0.6
    audio.skill.volume = volume * 0.6
  }, [volume])

  // 背景音乐控制
  useEffect(() => {
    const bgm = audioRef.current.bgm
    
    if (audioEnabled && bgmPlaying && isPlaying) {
      const playPromise = bgm.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('BGM autoplay prevented:', error)
        })
      }
    } else {
      bgm.pause()
    }

    return () => {
      bgm.pause()
    }
  }, [audioEnabled, bgmPlaying, isPlaying])

  // 更新排行榜
  function updateLeaderboard() {
    const newScore = {
      score,
      date: new Date().toISOString(),
      mode: gameMode,
      name: playerName.trim() || '匿名玩家'
    }

    const newLeaderboard = [...leaderboard, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    setLeaderboard(newLeaderboard)
    localStorage.setItem('snakeLeaderboard', JSON.stringify(newLeaderboard))
  }

  // 生成食物
  function generateFood() {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      type: 'NORMAL'
    }

    const rand = Math.random()
    if (rand > (1 - FOOD_TYPES.SKILL.chance)) {
      newFood.type = 'SKILL'
    } else if (rand > (1 - FOOD_TYPES.SUPER.chance)) {
      newFood.type = 'SUPER'
    } else if (rand > (1 - FOOD_TYPES.SPECIAL.chance)) {
      newFood.type = 'SPECIAL'
    }

    return newFood
  }

  // 检查碰撞
  function checkCollision(head) {
    if (gameMode !== 'WRAP') {
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return true
      }
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true
      }
    }

    if (gameMode === 'MAZE') {
      return obstacles.some(obstacle => 
        obstacle.x === head.x && obstacle.y === head.y
      )
    }

    return false
  }

  // 移动蛇
  function moveSnake() {
    const newSnake = [...snake]
    const head = { ...newSnake[0] }

    switch (direction) {
      case 'UP':
        head.y -= 1
        break
      case 'DOWN':
        head.y += 1
        break
      case 'LEFT':
        head.x -= 1
        break
      case 'RIGHT':
        head.x += 1
        break
    }

    if (gameMode === 'WRAP') {
      if (head.x >= GRID_SIZE) head.x = 0
      if (head.x < 0) head.x = GRID_SIZE - 1
      if (head.y >= GRID_SIZE) head.y = 0
      if (head.y < 0) head.y = GRID_SIZE - 1
    }

    if (checkCollision(head)) {
      handleGameOver()
      return
    }

    if (head.x === food.x && head.y === food.y) {
      handleFoodEaten()
    } else {
      newSnake.pop()
    }

    newSnake.unshift(head)
    setSnake(newSnake)
  }

  // 处理食物被吃掉的情况
  function handleFoodEaten() {
    if (audioEnabled) {
      const eatSound = audioRef.current.eat
      eatSound.currentTime = 0
      eatSound.play()
    }

    const points = FOOD_TYPES[food.type].points
    setScore(prev => prev + points)
    
    if (food.type === 'SKILL') {
      // 处理技能食物
      const availableSkills = Object.keys(Skills)
      const randomSkill = Skills[availableSkills[Math.floor(Math.random() * availableSkills.length)]]
      
      setActiveSkills(prev => [...prev, {
        ...randomSkill,
        startTime: Date.now()
      }])
    }

    // 生成新的食物
    setFood(generateFood())

    // 增加游戏速度
    if (gameSpeed > MAX_SPEED) {
      setGameSpeed(prev => prev * SPEED_INCREASE)
    }

    // 添加粒子效果
    setParticles(prev => [...prev, {
      id: Date.now(),
      x: food.x * CELL_SIZE,
      y: food.y * CELL_SIZE,
      color: FOOD_TYPES[food.type].color
    }])
  }

  // 处理游戏结束
  function handleGameOver() {
    setIsGameOver(true)
    setIsPlaying(false)
    setBgmPlaying(false)
    
    if (audioEnabled) {
      const gameOverSound = audioRef.current.gameOver
      gameOverSound.play()
    }

    // 更新最高分
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('snakeHighScore', score)
    }

    // 更新统计数据
    const newStats = {
      ...stats,
      totalGames: stats.totalGames + 1,
      totalScore: stats.totalScore + score,
      highestScore: Math.max(stats.highestScore, score)
    }
    setStats(newStats)
    localStorage.setItem('snakeStats', JSON.stringify(newStats))

    // 更新排行榜
    updateLeaderboard()
  }

  // 重置游戏
  function resetGame() {
    setSnake([{ x: 10, y: 10 }])
    setDirection('RIGHT')
    setFood(generateFood())
    setScore(0)
    setGameSpeed(INITIAL_SPEED)
    setIsGameOver(false)
    setIsPlaying(true)
    setBgmPlaying(true)
    setActiveSkills([])
    setParticles([])
  }

  // 返回菜单
  function returnToMenu() {
    setIsPlaying(false)
    setIsGameOver(false)
    setBgmPlaying(false)
    setScore(0)
    setSnake([{ x: 10, y: 10 }])
    setDirection('RIGHT')
    setActiveSkills([])
    setParticles([])
  }

  // 开始游戏
  function handleStartGame() {
    if (!playerName.trim()) {
      alert('请输入你的名字')
      return
    }
    setIsPlaying(true)
    setBgmPlaying(true)
    resetGame()
  }

  // 键盘控制
  useEffect(() => {
    if (!isPlaying || isGameOver) return

    function handleKeyPress(e) {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'ArrowDown':
        case 's':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'ArrowLeft':
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'ArrowRight':
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, isPlaying, isGameOver])

  // 游戏主循环
  useEffect(() => {
    if (!isPlaying || isGameOver) return

    const gameLoop = setInterval(() => {
      moveSnake()
    }, gameSpeed)

    return () => clearInterval(gameLoop)
  }, [snake, direction, food, isPlaying, isGameOver, gameSpeed])

  // 技能效果处理
  useEffect(() => {
    if (!isPlaying || isGameOver) return

    const now = Date.now()
    setActiveSkills(prev => 
      prev.filter(skill => now - skill.startTime < skill.duration)
    )
  }, [isPlaying, isGameOver])

  // 触摸控制处理
  const touchStart = useRef({ x: 0, y: 0 })
  
  function handleTouchStart(e) {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  function handleTouchEnd(e) {
    if (!isPlaying) return

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }

    const dx = touchEnd.x - touchStart.current.x
    const dy = touchEnd.y - touchStart.current.y

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && direction !== 'LEFT') setDirection('RIGHT')
      else if (dx < 0 && direction !== 'RIGHT') setDirection('LEFT')
    } else {
      if (dy > 0 && direction !== 'UP') setDirection('DOWN')
      else if (dy < 0 && direction !== 'DOWN') setDirection('UP')
    }
  }

  return (
    <div 
      className={`game-container theme-${currentTheme.toLowerCase()}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!isPlaying && !isGameOver ? (
        <div className="start-screen">
          <h1>贪吃蛇游戏</h1>
          <div className="player-name-input">
            <input
              type="text"
              placeholder="请输入你的名字"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value)
                localStorage.setItem('playerName', e.target.value)
              }}
              maxLength={10}
            />
          </div>
          <div className="menu-buttons">
            <button onClick={handleStartGame} disabled={!playerName.trim()}>
              开始游戏
            </button>
            <button onClick={() => setShowSettings(true)}>设置</button>
            <button onClick={() => setShowTutorial(true)}>教程</button>
            <button onClick={() => setShowLeaderboard(true)}>排行榜</button>
            <button onClick={() => setShowStats(true)}>统计</button>
          </div>
          <div className="game-modes">
            <h3>游戏模式</h3>
            <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
              {Object.entries(GameModes).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="game-area">
          <div className="game-info">
            <div className="top-bar">
              <button onClick={returnToMenu}>返回菜单</button>
              <p>得分: {score}</p>
              <p>最高分: {highScore}</p>
            </div>
            {activeSkills.length > 0 && (
              <div className="active-skills">
                {activeSkills.map((skill, index) => (
                  <div key={index} className="skill-indicator">
                    {skill.name} ({Math.ceil((skill.duration - (Date.now() - skill.startTime)) / 1000)}s)
                  </div>
                ))}
              </div>
            )}
          </div>

          <div 
            className="game-board"
            style={{
              width: `${GRID_SIZE * CELL_SIZE}px`,
              height: `${GRID_SIZE * CELL_SIZE}px`,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
            }}
          >
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`snake-segment ${index === 0 ? 'snake-head' : ''}`}
                style={{
                  left: `${segment.x * CELL_SIZE}px`,
                  top: `${segment.y * CELL_SIZE}px`,
                  width: `${CELL_SIZE - 2}px`,
                  height: `${CELL_SIZE - 2}px`,
                  backgroundColor: index === 0 ? '#2E7D32' : `hsl(120, 60%, ${50 - (index * 2)}%)`
                }}
              />
            ))}

            <div
              className={`food food-${food.type.toLowerCase()}`}
              style={{
                left: `${food.x * CELL_SIZE}px`,
                top: `${food.y * CELL_SIZE}px`,
                width: `${CELL_SIZE - 2}px`,
                height: `${CELL_SIZE - 2}px`,
                backgroundColor: FOOD_TYPES[food.type].color
              }}
            />

            {gameMode === 'MAZE' && obstacles.map((obstacle, index) => (
              <div
                key={index}
                className="obstacle"
                style={{
                  left: `${obstacle.x * CELL_SIZE}px`,
                  top: `${obstacle.y * CELL_SIZE}px`,
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`
                }}
              />
            ))}

            {particles.map(particle => (
              <ParticleEffect
                key={particle.id}
                x={particle.x}
                y={particle.y}
                color={particle.color}
                onComplete={() => setParticles(prev => 
                  prev.filter(p => p.id !== particle.id)
                )}
              />
            ))}
          </div>

          {isGameOver && (
            <div className="game-over">
              <h2>游戏结束!</h2>
              <p>最终得分: {score}</p>
              <div className="game-over-buttons">
                <button onClick={resetGame}>重新开始</button>
                <button onClick={returnToMenu}>返回菜单</button>
              </div>
            </div>
          )}

          <VirtualControls
            onDirectionChange={setDirection}
            currentDirection={direction}
            visible={window.innerWidth <= 768}
          />
        </div>
      )}

      {showSettings && (
        <Settings
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          volume={volume}
          setVolume={setVolume}
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          theme={currentTheme}
          setTheme={setCurrentTheme}
          bgmPlaying={bgmPlaying}
          setBgmPlaying={setBgmPlaying}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showTutorial && (
        <Tutorial onClose={() => setShowTutorial(false)} />
      )}

      {showLeaderboard && (
        <Leaderboard
          data={leaderboard}
          currentScore={score}
          gameMode={gameMode}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {showStats && (
        <Statistics
          stats={stats}
          achievements={stats.achievements}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  )
}

export default App