export default (state = 0, action: { type: string }) => {
  switch (action.type) {
    case 'START_LOADING':
      return (state += 1)
    case 'END_LOADING':
      return (state -= 1)
    default:
      return state
  }
}
