import { Server } from 'socket.io'
import { OkOrError, StatusUpdateResponse } from '../lib/BuildingActions'

import { getNumPeople, getUsers } from '../state/People'

let _io: Server

export const initializeBroadcaster = (io : Server) : void => {
  _io = io
}

export const broadcastStatusUpdate = () : void => {
  const numPeople = getNumPeople()
  const users = getUsers()

  const statusUpdateResponse: StatusUpdateResponse = {
    numPeople,
    users,
    status: OkOrError.Ok
  }

  console.log(`broadcasting ${users}`)

  //  broadcast a status update to all clients
  _io.emit('status-update', statusUpdateResponse)
}
