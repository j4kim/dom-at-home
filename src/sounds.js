import { Howl, Howler } from 'howler'

function load (name, loop = false) {
  return new Howl({
    src: `sounds/${name}.mp3`,
    loop
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