import { ElevatorRequest } from '../types/ServerSideTypes'

export class ElevatorRequests {
  public elevatorRequestQueue: ElevatorRequest[]

  public static ELEVATOR_REQUESTS_LOCK = 'elevator-requests-lock'

  constructor () {
    this.elevatorRequestQueue = []
  }

  public reset () : void {
    this.elevatorRequestQueue = []
  }

  public async getElevatorRequest () : Promise<ElevatorRequest | null> {
    if (this.elevatorRequestQueue.length === 0) { return null }

    return this.elevatorRequestQueue[0]
  }

  public removeElevatorRequest () : ElevatorRequest | null | undefined {
    if (this.elevatorRequestQueue.length === 0) { return null }

    const elevatorRequest = this.elevatorRequestQueue.shift()
    return elevatorRequest
  }

  public addElevatorRequest (elevatorRequest: ElevatorRequest) : void {
    this.elevatorRequestQueue.push(elevatorRequest)
  }
}
