import { Server as SocketIOServer, Socket } from 'socket.io'
import { NewConnectionBuildingResponse, OkOrError } from '../types/EventPayloads'

import { GameLoopManager } from '../gameLoops/GameLoopManager'
import { StateManager } from '../state/StateManager'
import AsyncLock from 'async-lock'
import { Broadcasters } from '../broadcasters/Broadcasters'

/**
 * This class manages client connections and stores the number of clients that are currently subscribing to events that will be pushed out from our socket io server
 */
export class ConnectionManager {
  private _numClients: number

  private _stateManager: StateManager

  private _gameLoopManager: GameLoopManager

  private _lock: AsyncLock

  constructor (io: SocketIOServer, stateManager: StateManager, broadcasters: Broadcasters, lock: AsyncLock) {
    this._numClients = 0

    this._stateManager = stateManager
    this._lock = lock

    this._gameLoopManager = new GameLoopManager(io, stateManager, broadcasters, lock)
  }

  private onNewConnection (socket: Socket) : void {
    if (!this._gameLoopManager.areRunning) {
      //  the first client to connect will start the game loops
      this._gameLoopManager.start()
    }

    this._numClients += 1
    console.log(`New user connected - there are now ${this._numClients} client(s) connected`)

    const building = this._stateManager.building

    const newConnectionResponse: NewConnectionBuildingResponse = {

      name: building.name,
      numFloors: building.numFloors,
      yearBuilt: building.yearBuilt,

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
    }
  }

  public setConnectionListeners (socket: Socket) : void {
    this.onNewConnection(socket)

    socket.on('disconnect', this.onDisconnect.bind(this))
  }
}
