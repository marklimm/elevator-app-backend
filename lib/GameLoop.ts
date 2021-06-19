import { Server } from 'socket.io'

import { getChangeByAmount } from './Randomizer'

interface IBuildingState {
  /**
   * This value will fluctuate with every run of the game loop
   */
  numPeopleInBuilding: number
}

const buildingState: IBuildingState = {

  numPeopleInBuilding: 500
}

export const getGameLoop = (io: Server) => {
  return () : void => {
    //  the loop

    console.log(`-- loop is executing at ${new Date()}`)

    numPeopleInBuilding += getChangeByAmount()

    console.log(`there are currently ${numPeopleInBuilding} people in the building`)

    const newStatusMessage = {
      name: 'some name',
      text: `there are currently ${numPeopleInBuilding} people in the building`,
      numPeopleInBuilding
    }

    //  broadcast the number of people in the building to all clients
    io.emit('status-update', newStatusMessage)
  }
}
