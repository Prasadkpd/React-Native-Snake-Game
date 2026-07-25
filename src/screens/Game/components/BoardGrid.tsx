import React from 'react'
import { StyleSheet, View } from 'react-native'

type Props = {
  gridSize: number
  cellSize: number
  boardColor: string
  gridColor: string
}

const BoardGrid = ({ gridSize, cellSize, boardColor, gridColor }: Props) => {
  const boardSize = gridSize * cellSize

  return (
    <View
      style={[
        styles.board,
        {
          width: boardSize,
          height: boardSize,
          backgroundColor: boardColor,
          borderColor: gridColor,
        },
      ]}
    >
      {Array.from({ length: gridSize - 1 }).map((_, index) => (
        <React.Fragment key={index}>
          <View
            style={[
              styles.line,
              {
                backgroundColor: gridColor,
                left: (index + 1) * cellSize,
                height: boardSize,
                width: StyleSheet.hairlineWidth,
              },
            ]}
          />
          <View
            style={[
              styles.line,
              {
                backgroundColor: gridColor,
                top: (index + 1) * cellSize,
                width: boardSize,
                height: StyleSheet.hairlineWidth,
              },
            ]}
          />
        </React.Fragment>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  board: {
    position: 'absolute',
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    opacity: 0.45,
  },
})

export default BoardGrid
