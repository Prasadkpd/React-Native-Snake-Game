import React from 'react'
import { observer } from 'mobx-react'
import { GameEngine } from 'react-native-game-engine'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, StatusBar, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { action, computed, makeObservable, observable } from 'mobx'

import Head from './components/Head'
import Food from './components/Food'
import Tail from './components/Tail'
import BoardGrid from './components/BoardGrid'
import DirectionPad from './components/DirectionPad'
import GameOverModal from './components/GameOverModal'
import Button from 'components/Button'
import Icon from 'components/Icon'

import GameLoop from './systems'
import SettingsStore from 'stores/SettingsStore'

import { AppStackRoutes } from 'navigator/stacks/AppStack/routes'
import { AppStackParamsList } from 'navigator/stacks/AppStack/types'

import { randomBetween } from 'utils'
import c, { Difficulties } from '@constants'

type Props = StackScreenProps<AppStackParamsList, AppStackRoutes.Game>

type GameUiState = {
  score: number
  isPaused: boolean
  isGameOver: boolean
}

class Game extends React.Component<Props, GameUiState> {
  static updateFrequency = {
    low: 15,
    medium: 5,
    high: 2,
  }

  static randomFoodPosition = (gridSize: number, occupied: number[] = [0, 0]) => {
    let x = randomBetween(0, gridSize - 1)
    let y = randomBetween(0, gridSize - 1)
    let attempts = 0

    while (x === occupied[0] && y === occupied[1] && attempts < gridSize * gridSize) {
      x = randomBetween(0, gridSize - 1)
      y = randomBetween(0, gridSize - 1)
      attempts += 1
    }

    return [x, y]
  }

  static buildLevel = (gridSize: number, difficulty: Difficulties) => ({
    head: {
      position: [0, 0],
      xspeed: 1,
      yspeed: 0,
      nextMove: 10,
      updateFrequency: Game.updateFrequency[difficulty],
      size: 20,
      renderer: Head,
    },
    food: {
      position: Game.randomFoodPosition(gridSize),
      size: 20,
      renderer: Food,
    },
    tail: {
      size: 20,
      elements: [],
      renderer: Tail,
    },
  })

  constructor(props: Props) {
    super(props)

    this.state = {
      score: 0,
      isPaused: false,
      isGameOver: false,
    }

    makeObservable<Game, 'gridSize' | 'cellSize' | 'boardSize' | 'isRunning' | 'setIsRunning'>(this, {
      isRunning: observable,
      setIsRunning: action,
      gridSize: computed,
      cellSize: computed,
      boardSize: computed,
    })
  }

  private isRunning = true

  private setIsRunning = (value: boolean) => {
    this.isRunning = value
  }

  private get gridSize() {
    const { boardSize } = SettingsStore.settings

    return parseInt(boardSize.slice(0, 2), 10)
  }

  private get cellSize() {
    const { boardSize } = SettingsStore.settings

    return parseInt(boardSize.slice(3, 5), 10)
  }

  private get boardSize() {
    return this.gridSize * this.cellSize
  }

  private engineRef: GameEngine | null = null

  private reset = () => {
    const { difficulty } = SettingsStore.settings

    this.engineRef?.swap(Game.buildLevel(this.gridSize, difficulty))
    this.setState({ score: 0, isGameOver: false, isPaused: false })
    this.setIsRunning(true)
  }

  private togglePause = () => {
    if (this.state.isGameOver) {
      return
    }

    const nextPaused = !this.state.isPaused
    this.setIsRunning(!nextPaused)
    this.setState({ isPaused: nextPaused })
  }

  private handleMove = (direction: 'move-up' | 'move-down' | 'move-left' | 'move-right') => {
    if (this.state.isPaused || this.state.isGameOver) {
      return
    }

    this.engineRef?.dispatch({ type: direction })
  }

  private onEvent = (e: { type: string }) => {
    if (e.type === 'food-eaten') {
      this.setState(prevState => ({ score: prevState.score + 1 }))
    }

    if (e.type === 'game-over') {
      this.setIsRunning(false)
      this.setState({ isGameOver: true })
    }
  }

  render() {
    const { useSwipes, difficulty, theme } = SettingsStore.settings
    const { score, isPaused, isGameOver } = this.state
    const colors = c.THEMES[theme]
    const length = score + 1

    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.secondaryColor }]} edges={['top', 'bottom']}>
        <StatusBar translucent={false} backgroundColor={colors.secondaryColor} barStyle="light-content" />

        <View style={styles.topBar}>
          <Button onPress={() => this.props.navigation.goBack()}>
            <View style={[styles.iconButton, { backgroundColor: colors.boardColor }]}>
              <Icon name="backIcon" style={{ tintColor: colors.lightColor, width: 18, height: 18 }} />
            </View>
          </Button>

          <View style={styles.stats}>
            <View style={[styles.statPill, { backgroundColor: colors.boardColor }]}>
              <Text style={[styles.statLabel, { color: colors.mutedColor }]}>Score</Text>
              <Text style={[styles.statValue, { color: colors.primaryColor }]}>{score}</Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: colors.boardColor }]}>
              <Text style={[styles.statLabel, { color: colors.mutedColor }]}>Length</Text>
              <Text style={[styles.statValue, { color: colors.lightColor }]}>{length}</Text>
            </View>
          </View>

          <Button onPress={this.togglePause}>
            <View style={[styles.iconButton, { backgroundColor: colors.boardColor }]}>
              <Text style={[styles.pauseLabel, { color: colors.primaryColor }]}>{isPaused ? '▶' : '❚❚'}</Text>
            </View>
          </Button>
        </View>

        <View style={[styles.wrapper, { justifyContent: useSwipes ? 'center' : 'space-between' }]}>
          <View style={styles.boardShell}>
            <BoardGrid
              gridSize={this.gridSize}
              cellSize={this.cellSize}
              boardColor={colors.boardColor}
              gridColor={colors.gridColor}
            />
            <GameEngine
              ref={ref => {
                this.engineRef = ref
              }}
              style={{
                width: this.boardSize,
                height: this.boardSize,
                backgroundColor: 'transparent',
                flex: undefined,
              }}
              systems={[GameLoop(this.gridSize, useSwipes, SettingsStore.settings.useTeleport)]}
              entities={Game.buildLevel(this.gridSize, difficulty)}
              running={this.isRunning}
              onEvent={this.onEvent}
            />

            {isPaused && !isGameOver ? (
              <View style={styles.pauseOverlay}>
                <Text style={[styles.pauseText, { color: colors.lightColor }]}>Paused</Text>
                <Text style={[styles.pauseHint, { color: colors.mutedColor }]}>Tap ▶ to resume</Text>
              </View>
            ) : null}
          </View>

          {useSwipes ? (
            <Text style={[styles.swipeHint, { color: colors.mutedColor }]}>Swipe anywhere on the board to steer</Text>
          ) : (
            <DirectionPad
              primaryColor={colors.primaryColor}
              darkerPrimaryColor={colors.darkerPrimaryColor}
              labelColor={colors.secondaryColor}
              onMove={this.handleMove}
            />
          )}
        </View>

        <GameOverModal
          visible={isGameOver}
          score={score}
          primaryColor={colors.primaryColor}
          secondaryColor={colors.boardColor}
          lightColor={colors.lightColor}
          onMenu={() => this.props.navigation.goBack()}
          onRestart={this.reset}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  statPill: {
    minWidth: 88,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 22,
    marginTop: 2,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 16,
  },
  boardShell: {
    position: 'relative',
    marginTop: 8,
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  pauseText: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 28,
  },
  pauseHint: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 12,
    marginTop: 8,
  },
  swipeHint: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 12,
    marginTop: 18,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
})

export default observer(Game)
