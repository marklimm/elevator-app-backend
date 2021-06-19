export interface BuildingDetails {
  name: string
  numFloors: number
  yearBuilt: number
}

export interface BuildingStatus {
  numPeople: number
}

export enum OkOrError {
  Ok = 'ok',
  Error = 'error',
}

export interface ResponseStatus {
  error?: string
  message?: string
  status: OkOrError
}

export type NewConnectionBuildingResponse = BuildingDetails &
  BuildingStatus &
  ResponseStatus

export type NumPeopleUpdatedResponse = BuildingStatus & ResponseStatus
