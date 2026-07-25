import { Dimensions } from 'react-native'

export enum ColorThemes {
  yellow = 'yellow',
  blue = 'blue',
  green = 'green',
}

export enum BoardSizes {
  '15x20' = '15x20',
  '20x20' = '20x20',
}

export enum Difficulties {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

type Theme = {
  [key in ColorThemes]: {
    primaryColor: string
    darkerPrimaryColor: string
    secondaryColor: string
    lightColor: string
    boardColor: string
    gridColor: string
    foodColor: string
    snakeColor: string
    snakeHeadColor: string
    mutedColor: string
  }
}

const THEMES: Theme = {
  yellow: {
    primaryColor: '#FCDE89',
    darkerPrimaryColor: '#C9AB56',
    secondaryColor: '#1A1D1D',
    lightColor: '#FFFFFF',
    boardColor: '#252929',
    gridColor: '#323838',
    foodColor: '#FF6B6B',
    snakeColor: '#FCDE89',
    snakeHeadColor: '#FFF3C4',
    mutedColor: '#9BA3A3',
  },
  blue: {
    primaryColor: '#37A6E0',
    darkerPrimaryColor: '#1163F3',
    secondaryColor: '#12141A',
    lightColor: '#FFFFFF',
    boardColor: '#1C2030',
    gridColor: '#2A3144',
    foodColor: '#FF8FAB',
    snakeColor: '#37A6E0',
    snakeHeadColor: '#7DD3FC',
    mutedColor: '#8B95B0',
  },
  green: {
    primaryColor: '#25E47B',
    darkerPrimaryColor: '#16894A',
    secondaryColor: '#101412',
    lightColor: '#FFFFFF',
    boardColor: '#182019',
    gridColor: '#243028',
    foodColor: '#FFB347',
    snakeColor: '#25E47B',
    snakeHeadColor: '#86EFAC',
    mutedColor: '#8FA896',
  },
}

export default {
  MAX_WIDTH: Dimensions.get('screen').width,
  MAX_HEIGHT: Dimensions.get('screen').height,
  FONTS: { JOYSTIX: 'joystix' },
  SETTINGS: {
    BOARD_SIZES: [BoardSizes['15x20'], BoardSizes['20x20']],
    DIFFICULTIES: [Difficulties.low, Difficulties.medium, Difficulties.high],
    THEMES: [ColorThemes.yellow, ColorThemes.blue, ColorThemes.green],
    USE_SWIPES: [true, false],
    TELEPORT: [true, false],
  },
  LOADING_DURATION: 1500,
  THEMES,
}
