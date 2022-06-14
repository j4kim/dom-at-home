import { Fireworks } from 'fireworks-js'

export var fireworks

export function startFireworks () {
  console.log("startFireworks")
  if (!fireworks) {
    fireworks = new Fireworks(
      document.querySelector('.fireworks-container')
    )
  }
  fireworks.start()
}

export function stopFireworks () {
  console.log("stopFireworks")
  fireworks.stop()
}