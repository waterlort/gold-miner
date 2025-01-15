// 获取画布和上下文
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let score = 0;
const minerals = [];
let hook = {
  x: canvas.width / 2,
  y: 50,
  length: 50,
  angle: Math.PI / 4, // 初始角度 (45度)
  angleSpeed: 0.02, // 旋转速度
  direction: 1, // 钩子伸缩方向
  isFiring: false, // 是否正在抓取
};

// 初始化矿物
function generateMinerals() {
  const shapes = ['circle', 'square', 'triangle'];
  for (let i = 0; i < 10; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const x = Math.random() * (canvas.width - 50) + 25;
    const y = Math.random() * (canvas.height - 200) + 200;
    const score = Math.floor(Math.random() * 20) + 10; // 分值 10-30
    minerals.push({ x, y, shape, score, size: 30 });
  }
}

// 绘制矿物
function drawMinerals() {
  minerals.forEach(mineral => {
    ctx.beginPath();
    if (mineral.shape === 'circle') {
      ctx.arc(mineral.x, mineral.y, mineral.size / 2, 0, Math.PI * 2);
    } else if (mineral.shape === 'square') {
      ctx.rect(mineral.x - mineral.size / 2, mineral.y - mineral.size / 2, mineral.size, mineral.size);
    } else if (mineral.shape === 'triangle') {
      ctx.moveTo(mineral.x, mineral.y - mineral.size / 2);
      ctx.lineTo(mineral.x - mineral.size / 2, mineral.y + mineral.size / 2);
      ctx.lineTo(mineral.x + mineral.size / 2, mineral.y + mineral.size / 2);
      ctx.closePath();
    }
    ctx.fillStyle = '#FFD700'; // 金黄色
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
  });
}

// 绘制钩子
function drawHook() {
  const endX = hook.x + hook.length * Math.cos(hook.angle);
  const endY = hook.y + hook.length * Math.sin(hook.angle);

  ctx.beginPath();
  ctx.moveTo(hook.x, hook.y);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = '#8B4513'; // 棕色
  ctx.lineWidth = 4;
  ctx.stroke();

  // 绘制钩头
  ctx.beginPath();
  ctx.arc(endX, endY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#8B4513';
  ctx.fill();
}

// 检测钩子是否抓到矿物
function checkCollision() {
  const endX = hook.x + hook.length * Math.cos(hook.angle);
  const endY = hook.y + hook.length * Math.sin(hook.angle);

  for (let i = 0; i < minerals.length; i++) {
    const mineral = minerals[i];
    const dx = endX - mineral.x;
    const dy = endY - mineral.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mineral.size / 2) {
      score += mineral.score; // 增加分数
      minerals.splice(i, 1); // 移除矿物
      hook.isFiring = false; // 停止抓取
      hook.length = 50; // 恢复初始长度
      document.getElementById('score').textContent = score;
      break;
    }
  }
}

// 更新钩子状态
function updateHook() {
  if (!hook.isFiring) {
    // 自动旋转
    hook.angle += hook.angleSpeed;
    if (hook.angle > Math.PI || hook.angle < 0) {
      hook.angleSpeed *= -1; // 反向旋转
    }
  } else {
    // 抓取动作
    hook.length += hook.direction * 5;
    if (hook.length > canvas.height || hook.length < 50) {
      hook.direction *= -1; // 反向伸缩
    }
    if (hook.length === 50) {
      hook.isFiring = false;
    }
  }
}

// 渲染游戏
function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMinerals();
  drawHook();
  if (hook.isFiring) checkCollision();

  updateHook();

  requestAnimationFrame(renderGame);
}

// 键盘事件监听
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' && !hook.isFiring) {
    hook.isFiring = true;
    hook.direction = 1; // 开始伸出
  }
});

// 初始化并启动游戏
generateMinerals();
renderGame();
