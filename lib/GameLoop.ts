import { Server } from "socket.io";
import { getNumberOfPeopleInBuilding } from './Randomizer'

const numFloors = 5
let numPeopleInBuilding = 0

export const getGameLoop = (io: Server) => {

  return () => {
    //  the loop
      
    console.log(`-- loop is executing at ${new Date()}`)

    numPeopleInBuilding = getNumberOfPeopleInBuilding()
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
