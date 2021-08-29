export default (state = [], action: { type: string; payload: Array<any> }) => {
  switch (action.type) {
    case 'SET_BUTTONS':
      return action.payload
    default:
      return state
  }
}
