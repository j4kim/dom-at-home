
class GameObject {
  constructor(pos) {
    this.pos = pos
  }

  hits(pos) {
    return this.pos && this.pos.join() === pos.join()
  }
}

export class Head extends GameObject {
  constructor(pos, dir) {
    super(pos)
    this.dir = dir
    this.nextDir = dir
    this.component = 'dom-head'
    this.key = 'head'
    this.crashed = false
  }

  nextPos() {
    return [
      this.pos[0] + this.nextDir[0],
      this.pos[1] + this.nextDir[1]
    ]
  }

  move() {
    this.pos = this.nextPos()
    this.dir = this.nextDir
  }
}

var partCounter = 1

export class BodyPart extends GameObject {
  constructor(pos) {
    super(pos)
    this.component = 'dom-beard'
    this.key = 'beard-' + partCounter++
  }
}

class Bonus extends GameObject {
  constructor(key, asset) {
    super()
    this.component = 'bonus'
    this.key = key
    this.asset = asset
  }
}

export class Drink extends Bonus {
  constructor() {
    super('drink', 'ricard')
  }
}

export class Food extends Bonus {
  constructor() {
    super('food', 'cervelas')
  }
}
