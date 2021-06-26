import { getNumUsers, spawnNewUser } from '../state/People'

export const spawnNewUserLoop = () : void => {
  //  don't add more people if there's already one user
  if (getNumUsers() > 0) { return }

  spawnNewUser()
}
