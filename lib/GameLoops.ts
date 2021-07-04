
import { Server as SocketIOServer } from 'socket.io'
import { GameLoopManager } from '../gameLoops/GameLoopManager'

export let gameLoopManager: GameLoopManager

export const initializeGameLoops = (io: SocketIOServer) : void => {
  //  initialize the game loops but don't start them yet
  gameLoopManager = new GameLoopManager(io)
}
