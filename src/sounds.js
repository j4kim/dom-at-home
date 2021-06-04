import { Howl } from 'howler'

export default function (name, loop = false) {
  return new Howl({
    src: `sounds/${name}.mp3`,
    loop,
    volume: localStorage.volume || 1
  })
}