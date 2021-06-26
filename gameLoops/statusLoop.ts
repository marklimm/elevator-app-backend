import { OkOrError, StatusUpdateResponse } from '../lib/BuildingActions'
import { broadcastUpdate } from '../state/Broadcaster'
import { getNumPeople, getUsersStatus } from '../state/People'

/**
 * Broadcasts the current status of people in the building
 */
export const statusLoop = () : void => {
  const numPeople = getNumPeople()
  const usersStatus = getUsersStatus()

  const statusUpdateResponse: StatusUpdateResponse = {
    numPeople,
    usersStatus,
    status: OkOrError.Ok
  }

  broadcastUpdate(statusUpdateResponse)
}
