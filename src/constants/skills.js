export const Skills = [
  {
    type: 'SPEED_BOOST',
    name: '加速',
    duration: 5000,
    description: '移动速度提升30%',
    icon: '⚡'
  },
  {
    type: 'THROUGH_WALL',
    name: '穿墙',
    duration: 10000,
    description: '可以穿过墙壁',
    icon: '🌀'
  },
  {
    type: 'INVINCIBLE',
    name: '无敌',
    duration: 5000,
    description: '暂时无视碰撞',
    icon: '⭐'
  },
  {
    type: 'GHOST',
    name: '幽灵',
    duration: 8000,
    description: '可以穿过自身',
    icon: '👻'
  },
  {
    type: 'MAGNET',
    name: '磁铁',
    duration: 7000,
    description: '吸引附近的食物',
    icon: '🧲'
  }
]

export const getRandomSkill = () => {
  return Skills[Math.floor(Math.random() * Skills.length)]
}