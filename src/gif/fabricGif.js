import { fabric } from 'fabric'
import { gifToSprite } from './gifToSprite'

const [PLAY, PAUSE, STOP] = [0, 1, 2]

/**
 * fabricGif "async"
 * Mainly a wrapper for gifToSprite
 * @param {string|File} gif can be a URL, dataURL or an "input File"
 * @param {number} maxWidth Optional, scale to maximum width
 * @param {number} maxHeight Optional, scale to maximum height
 * @param {number} maxDuration Optional, in milliseconds reduce the gif frames to a maximum duration, ex: 2000 for 2 seconds
 * @returns {*} {error} object if any or a 'fabric.image' instance of the gif with new 'play', 'pause', 'stop' methods
 */
export const fabricGif = async (gif, maxWidth, maxHeight, maxDuration) => {
  const { error, dataUrl, delay, frameWidth, framesLength } = await gifToSprite(
    gif,
    maxWidth,
    maxHeight,
    maxDuration
  )

  if (error) return { error }

  return new Promise(resolve => {
    fabric.Image.fromURL(dataUrl, img => {
      const sprite = img.getElement()
      let framesIndex = 0
      let start = performance.now()
      let status

      img.width = frameWidth
      img.height = sprite.naturalHeight
      img.mode = 'image'
      img.top = 200
      img.left = 200

      img._render = function (ctx) {
        if (status === PAUSE || (status === STOP && framesIndex === 0)) return
        const now = performance.now()
        const delta = now - start
        if (delta > delay) {
          start = now
          framesIndex++
        }
        if (framesIndex === framesLength || status === STOP) framesIndex = 0
        ctx.drawImage(
          sprite,
          frameWidth * framesIndex,
          0,
          frameWidth,
          sprite.height,
          -this.width / 2,
          -this.height / 2,
          frameWidth,
          sprite.height
        )
      }
      img.play = function () {
        status = PLAY
        this.dirty = true
      }
      img.pause = function () {
        status = PAUSE
        this.dirty = false
      }
      img.stop = function () {
        status = STOP
        this.dirty = false
      }
      img.getStatus = () => ['Playing', 'Paused', 'Stopped'][status]

      img.play()
      resolve(img)
    })
  })
}
