export default (state = [], action: { type: string; payload: number }) => {
  switch (action.type) {
    case 'SET_MENU': {
      return action.payload
    }
    default:
      return state
  }
}
