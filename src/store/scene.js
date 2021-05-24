import { sample, range, difference, product } from 'lodash'

import { BodyPart, Head, Drink, Food } from '@/GameObjects'

function initialState () { 
  return {
    grid: {
      columns: 11,
      rows: 16
    },
    snake: {
      bodyParts: [ new BodyPart([6,15]) ],
      head: new Head([6,14], [0,-1]),
    },
    drink: new Drink(),
    food: new Food()
  }
}

export default {
  namespaced: true,

  state: initialState,

  getters: {
    objects (state) {
      return [
        state.snake.head,
        ...state.snake.bodyParts,
        state.drink,
        state.food
      ].filter(o => o.pos)
    },
    verticalMove({ snake }){
      return snake.head.dir[0] === 0
    },
    allPositions({ grid }) {
      let columns = range(1, grid.columns + 1)
      let rows = range(1, grid.rows + 1)
      return product(columns, rows).map(pos => pos.join())
    },
    objectPositions(state, { objects }){
      return objects.map(o => o.pos.join())
    },
    availablePositions(state, getters){
      return difference(getters.allPositions, getters.objectPositions)
    },
    snakeCollision: ({ snake }) => (pos) => {
      return snake.bodyParts.some(part => part.hits(pos))
    },
    wallCollision: ({ grid }) => (pos) => {
      return (
        pos[0] < 1 ||
        pos[0] > grid.columns ||
        pos[1] < 1 ||
        pos[1] > grid.rows
      )
    },
    collision: (state, getters) => (pos) => {
      return getters.snakeCollision(pos) || getters.wallCollision(pos)
    },
    randomPos: (state, getters) => {
      let pos = sample(getters.availablePositions)
      return pos ? pos.split(',') : undefined
    },
  },

  mutations: {
    reset (state) {
      Object.assign(state, initialState())
    },
    addBodyPart ({ snake }, bodyPart) {
      snake.bodyParts.push(bodyPart)
    },
    insertBodyPart ({ snake }, bodyPart) {
      snake.bodyParts.unshift(bodyPart)
    },
    setNextDir ({ snake }, dir) {
      snake.head.nextDir = dir
    },
    setDrinkPos ({ drink }, pos) {
      drink.pos = pos
    },
    setFoodPos ({ food }, pos) {
      food.pos = pos
    },
    removeFood({ food }){
      food.pos = null
    },
  },

  actions: {
    spawnDrink({ commit, getters }){
      commit('setDrinkPos', getters.randomPos)
    },
    spawnFood({ commit, getters }){
      commit('setFoodPos', getters.randomPos)
    },
    move ({ state, getters, commit, dispatch }) {
      let newHeadPos = state.snake.head.nextPos()
      let tailPart = state.snake.bodyParts.pop()
      if (getters.collision(newHeadPos)) {
        dispatch('gameOver', null, { root: true })
      } else {
        if (state.drink.hits(newHeadPos)) {
          commit('addBodyPart', new BodyPart(tailPart.pos))
          dispatch('game/drinkDrink', null, { root: true })
        } else if (state.food.hits(newHeadPos)) {
          dispatch('game/eatFood', null, { root: true })
        }
        tailPart.pos = state.snake.head.pos
        commit('insertBodyPart', tailPart)
        state.snake.head.move()
      }
    },
    changeDirection({ rootState, getters, commit }, directions){
      if (rootState.game.over) { return }
      if (getters.verticalMove) {
        if (directions.left) {
          commit('setNextDir', [-1,0])
        } else if (directions.right) {
          commit('setNextDir', [1,0])
        }
      } else {
        if (directions.top) {
          commit('setNextDir', [0,-1])
        } else if (directions.bottom) {
          commit('setNextDir', [0,1])
        }
      }
    }
  }
}