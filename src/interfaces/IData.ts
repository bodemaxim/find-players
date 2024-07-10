export interface IPlayer {
  id: number
  name: string
  info: string
}

export interface IPlayerWithSelection extends IPlayer {
  selected: boolean
}
