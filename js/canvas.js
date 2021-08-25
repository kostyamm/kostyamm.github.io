let canvasStars = null
let elemLeft = null
let elemTop = null
let ctx = null

const DEFAULT_OPTIONS = { points: 5, outer: 30, inner: 12, stroke: 'gray', line: 2 }
const STARS = [
  { color: 'red', top: 100, left: 75 },
  { color: 'blue', top: 100, left: 175 },
  { color: 'green', top: 200, left: 75 },
  { color: 'yellow', top: 200, left: 175 },
  { color: 'black', top: 300, left: 75 }
]

const initCanvasPage = () => {
  canvasStars = document.getElementById('canvas-stars')
  elemLeft = canvasStars.offsetLeft
  elemTop = canvasStars.offsetTop
  ctx = canvasStars.getContext('2d')

  STARS.forEach(({ color, left, top }, index) => {
    drawStar(index, left, top, color)
  })

  canvasStars.addEventListener('click', function (event) {
    let x = event.pageX - elemLeft
    let y = event.pageY - elemTop

    const isStar = star => ctx.isPointInPath(star.path, x, y)
    const starIndex = STARS.findIndex(isStar)

    if (~starIndex) { return addColorOnCanvas(STARS[starIndex]) }

    addColorOnCanvas({ color: 'white' })
  }, false)
}


function drawStar (index, centerX, centerY, fill, { points, outer, inner, stroke, line } = DEFAULT_OPTIONS) {
  const STAR = new Path2D()

  STAR.moveTo(centerX, centerY + outer)
  for (let i = 0; i < 2 * points + 1; i++) {
    const r = (i % 2 === 0) ? outer : inner
    const a = Math.PI * i / points
    STAR.lineTo(centerX + r * Math.sin(a), centerY + r * Math.cos(a))
  }

  STARS[index].path = STAR

  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill(STAR)
  ctx.strokeStyle = stroke
  ctx.lineWidth = line
  ctx.stroke(STAR)
}

function addColorOnCanvas (e) {
  const canvasColored = document.getElementById('canvas-colored')
  const ctx = canvasColored.getContext('2d')
  ctx.fillStyle = e.color
  ctx.fillRect(0, 0, 600, 50);
}
