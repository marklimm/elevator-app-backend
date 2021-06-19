import { Server } from 'socket.io'

import { building } from './Building'
import { getChangeByAmount } from './Randomizer'

export const getMainLoop = (io: Server) => {
  return () : void => {
    console.log(`-- loop is executing at ${new Date()}`)

    const numPeople = building.getNumPeople()

    console.log(`there are currently ${numPeople} people in the building`)

    const newStatusMessage = {
      name: 'some name',
      text: `there are currently ${numPeople} people in the building`,
      numPeopleInBuilding: numPeople
    }

    //  broadcast the number of people in the building to all clients
    io.emit('status-update', newStatusMessage)
  }
}

export const fluctuatingNumPeopleLoop = () : void => {
  //  increase or decrease the amount of people in the building to simulate people entering and leaving the building
  building.addPeople(getChangeByAmount())
}
