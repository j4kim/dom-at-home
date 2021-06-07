import { Howl, Howler } from 'howler'

function load (name, loop = false, onload) {
  return new Howl({
    src: `sounds/${name}.mp3`,
    loop,
    onload
  })
}

function many (...names) {
  let sounds = {}
  names.forEach(name => {
    sounds[name] = load(name)
  })
  return sounds
}

const mute = Howler.mute

export { load, many, mute }