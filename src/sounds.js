import { Howl } from 'howler'

function load (name, loop = false, onload) {
  return new Howl({
    src: `sounds/${name}.mp3`,
    loop,
    onload,
    volume: localStorage.volume || 1
  })
}

function many (...names) {
  let sounds = {}
  names.forEach(name => {
    sounds[name] = load(name)
  })
  return sounds
}

export { load, many }