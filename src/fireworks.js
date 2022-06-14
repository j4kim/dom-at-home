import { Fireworks } from 'fireworks-js'

export var fireworks

export function start () {
  if (!fireworks) {
    fireworks = new Fireworks(
      document.querySelector('.fireworks-container')
    )
  }
  fireworks.start()
  setTimeout(() => fireworks.stop(), 10000)
}