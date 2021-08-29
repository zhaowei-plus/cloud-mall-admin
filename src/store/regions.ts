export default (state = [], action: { type: string; payload: number }) => {
  switch (action.type) {
    case 'SET_REGIONS': {
      return action.payload
    }
    default:
      return state
  }
}
