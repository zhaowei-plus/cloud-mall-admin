// 省份
export default (state = 0, action: { type: string; payload: number }) => {
  switch (action.type) {
    case 'SET_PROVINCE': {
      return action.payload
    }
    default:
      return state
  }
}
