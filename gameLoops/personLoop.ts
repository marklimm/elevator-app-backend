
import { processCallingTheElevator } from '../state/People'

export const personLoop = async (name: string) : Promise<void> => {
  await processCallingTheElevator(name)

  // await processGettingOnAndPressingButton()
}
