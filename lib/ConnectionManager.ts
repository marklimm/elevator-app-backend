import { Server as SocketIOServer, Socket } from 'socket.io'
import { NewConnectionBuildingResponse, OkOrError } from './types/EventPayloads'

import { GameLoopManager } from '../gameLoops/GameLoopManager'
import { buildingDetails } from '../state/Building'
import { resetElevators } from '../state/Elevators'
import { clearPeople } from '../state/People'

export class ConnectionManager {
  private _numClients: number

  private _gameLoopManager: GameLoopManager

  constructor (io: SocketIOServer) {
    this._numClients = 0

    this._gameLoopManager = new GameLoopManager(io)
  }

  private onNewConnection (socket: Socket) : void {
    if (!this._gameLoopManager.areRunning) {
      //  the first client to connect will start the game loops
      this._gameLoopManager.start()
    }

    this._numClients += 1
    console.log(`New user connected - there are now ${this._numClients} client(s) connected`)

    // const numPeople = getNumPeople()
    // console.log(`numPeople - ${numPeople}`)

    const newConnectionResponse: NewConnectionBuildingResponse = {
      ...buildingDetails,
      status: OkOrError.Ok,
      message: 'Successfully connected!'
    }

    //  when a connection is made, send back the current state of the elevators
    socket.emit('newConnectionAck', newConnectionResponse)
  }

  private onDisconnect () : void {
    //  this executes whenever a client disconnects

    this._numClients--
    console.log('a user has disconnected')

    if (this._numClients <= 0) {
      //  stop all the intervals/game loops since no more clients are connected

      this._gameLoopManager.stop()

      //  delete any people that might currently be in state
      clearPeople()

      //  reset the elevators back to their initial state (on the first floor and ready to take a request)
      resetElevators()
    }
  }

  public setConnectionListeners (socket: Socket) : void {
    this.onNewConnection(socket)

    socket.on('disconnect', this.onDisconnect.bind(this))
  }
}
