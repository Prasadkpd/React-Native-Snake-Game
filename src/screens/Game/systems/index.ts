import { ReactNode } from 'react'

type Entities = {
  head: {
    position: number[]
    nextMove: number
    renderer: ReactNode
    size: number
    updateFrequency: number
    xspeed: number
    yspeed: number
  }
  food: { position: number[] }
  tail: {
    elements: number[][]
    renderer: ReactNode
    size: number
  }
}

type GameEvent = { type: 'game-over' | 'food-eaten' }

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

const isCellOccupied = (x: number, y: number, head: Entities['head'], tail: Entities['tail']) => {
  if (head.position[0] === x && head.position[1] === y) {
    return true
  }

  return tail.elements.some(segment => segment[0] === x && segment[1] === y)
}

const spawnFood = (gridSize: number, head: Entities['head'], tail: Entities['tail']) => {
  let x = randomBetween(0, gridSize - 1)
  let y = randomBetween(0, gridSize - 1)
  let attempts = 0

  while (isCellOccupied(x, y, head, tail) && attempts < gridSize * gridSize) {
    x = randomBetween(0, gridSize - 1)
    y = randomBetween(0, gridSize - 1)
    attempts += 1
  }

  return [x, y]
}

const cloneEntities = (entities: Entities): Entities => ({
  ...entities,
  head: { ...entities.head, position: [...entities.head.position] },
  food: { ...entities.food, position: [...entities.food.position] },
  tail: { ...entities.tail, elements: entities.tail.elements.map(segment => [...segment]) },
})

type Object = {
  touches: {
    id: number
    type: 'move'
    delta: {
      locationX: number
      locationY: number
      pageX: number
      pageY: number
      timestamp: number
    }
    tail: object
    event: {
      changeTouches: []
      force: number
      identifier: number
      locationX: number
      locationY: number
      pageX: number
      pageY: number
      target: number
      timestamp: number
      touches: []
    }
  }[]
  dispatch: (param: GameEvent) => void
  events: {
    type: 'move-down' | 'move-up' | 'move-left' | 'move-right'
  }[]
}

const GameLoop =
  (gridSize: number, useSwipes: boolean, useTeleport: boolean) =>
  (entities: Entities, { touches, dispatch, events }: Object) => {
    const { head, food, tail } = entities

    if (useSwipes) {
      const moveTouches = touches.filter(t => t.type === 'move')

      for (const { delta } of moveTouches) {
        if (!(head && head.position)) continue

        if (!(delta.pageY && delta.pageX)) continue

        if (delta.pageY && Math.abs(delta.pageY) > Math.abs(delta.pageX)) {
          if (delta.pageY < 0 && head.yspeed !== 1) {
            head.yspeed = -1
            head.xspeed = 0
          } else if (delta.pageY > 0 && head.yspeed !== -1) {
            head.yspeed = 1
            head.xspeed = 0
          }
        } else if (delta.pageX) {
          if (delta.pageX < 0 && head.xspeed !== 1) {
            head.xspeed = -1
            head.yspeed = 0
          } else if (delta.pageX > 0 && head.xspeed !== -1) {
            head.xspeed = 1
            head.yspeed = 0
          }
        }
      }
    } else if (events.length) {
      for (const { type } of events) {
        switch (true) {
          case type === 'move-down' && head.yspeed !== -1:
            head.yspeed = 1
            head.xspeed = 0
            break
          case type === 'move-up' && head.yspeed !== 1:
            head.yspeed = -1
            head.xspeed = 0
            break
          case type === 'move-left' && head.xspeed !== 1:
            head.yspeed = 0
            head.xspeed = -1
            break
          case type === 'move-right' && head.xspeed !== -1:
            head.yspeed = 0
            head.xspeed = 1
            break
        }
      }
    }

    head.nextMove -= 1

    if (head.nextMove === 0) {
      head.nextMove = head.updateFrequency

      let nextX = head.position[0] + head.xspeed
      let nextY = head.position[1] + head.yspeed

      const hitsWall = nextX < 0 || nextX >= gridSize || nextY < 0 || nextY >= gridSize

      if (hitsWall) {
        if (!useTeleport) {
          dispatch({ type: 'game-over' })
          return cloneEntities(entities)
        }

        if (nextX < 0) nextX = gridSize - 1
        if (nextX >= gridSize) nextX = 0
        if (nextY < 0) nextY = gridSize - 1
        if (nextY >= gridSize) nextY = 0
      }

      tail.elements = [[head.position[0], head.position[1]]].concat(tail.elements)

      head.position = [nextX, nextY]

      for (let i = 0; i < tail.elements.length; i++) {
        if (tail.elements[i][0] === head.position[0] && tail.elements[i][1] === head.position[1]) {
          dispatch({ type: 'game-over' })
          return cloneEntities(entities)
        }
      }

      if (head.position[0] === food.position[0] && head.position[1] === food.position[1]) {
        dispatch({ type: 'food-eaten' })
        food.position = spawnFood(gridSize, head, tail)
      } else {
        tail.elements = tail.elements.slice(0, -1)
      }
    }

    return cloneEntities(entities)
  }

export default GameLoop
