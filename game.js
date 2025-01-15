// 获取画布和上下文
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let score = 0;
let running = false;
const minerals = [];
const feedbacks = [];
let hook = {
  x: canvas.width / 2,
  y: 50,
  length: 50,
  angle: Math.PI / 4, // 初始角度 (45度)
  angleSpeed: 0.02,
  direction: 1,
  isFiring: false,
};

// 初始化矿物
function generateMinerals() {
  minerals.length = 0; // 清空矿物数组
  for (let i = 0; i < 10; i++) {
    const type = Math.random() > 0.5 ? 'red' : 'green'; // 50% 概率分配颜色
    const scoreRange = type === 'red' ? [0, 10] : [10, 20];
    const x = Math.random() * (canvas.width - 50) + 25;
    const y = Math.random() * (canvas.height - 200) + 200;
    const value = Math.floor(Math.random() * (scoreRange[1] - scoreRange[0] + 1)) + scoreRange[0];
    minerals.push({ x, y, color: type, value, size: 30 });
  }
}

// 绘制矿物
function drawMinerals() {
  minerals.forEach(mineral => {
    ctx.beginPath();
    ctx.arc(mineral.x, mineral.y, mineral.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = mineral.color === 'red' ? '#FF0000' : '#00FF00'; // 红色或绿色
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
      score += mineral.value;

      // 添加 "+分数" 动态反馈
      feedbacks.push({
        text: `+${mineral.value}`,
        x: mineral.x,
        y: mineral.y,
        opacity: 1, // 初始透明度
      });

      minerals.splice(i, 1); // 移除矿物
      hook.isFiring = false; // 停止抓取
      hook.length = 50; // 恢复初始长度
      break;
    }
  }
}

// 绘制动态反馈
function drawFeedbacks() {
  feedbacks.forEach((feedback, index) => {
    ctx.globalAlpha = feedback.opacity; // 设置透明度
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFD700'; // 金黄色
    ctx.fillText(feedback.text, feedback.x, feedback.y);

    // 动态减少透明度，逐渐消失
    feedback.opacity -= 0.02;
    feedback.y -= 1; // 文字上移
    if (feedback.opacity <= 0) {
      feedbacks.splice(index, 1); // 移除反馈
    }
  });
  ctx.globalAlpha = 1; // 恢复默认透明度
}

// 绘制总分数（在钩子右侧）
function drawScore() {
  ctx.font = '24px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(`总分数: ${score}`, hook.x + 50, hook.y);
}

// 更新钩子状态
function updateHook() {
  if (!hook.isFiring) {
    hook.angle += hook.angleSpeed;
    if (hook.angle > Math.PI || hook.angle < 0) {
      hook.angleSpeed *= -1;
    }
  } else {
    hook.length += hook.direction * 5;
    if (hook.length > canvas.height || hook.length < 50) {
      hook.direction *= -1;
    }
    if (hook.length === 50) {
      hook.isFiring = false;
    }
  }
}

// 渲染游戏
function renderGame() {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMinerals();
  drawHook();
  drawFeedbacks();
  drawScore();
  if (hook.isFiring) checkCollision();
  updateHook();

  requestAnimationFrame(renderGame);
}

// 游戏控制
document.getElementById('start-btn').addEventListener('click', () => {
  running = true;
  score = 0;
  feedbacks.length = 0; // 清空反馈
  generateMinerals();
  renderGame();
});

document.getElementById('stop-btn').addEventListener('click', () => {
  running = false;
  alert('游戏已关闭！');
});

// 键盘控制
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' && !hook.isFiring) {
    hook.isFiring = true;
    hook.direction = 1;
  }
});
