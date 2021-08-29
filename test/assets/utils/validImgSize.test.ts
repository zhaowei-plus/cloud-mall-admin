import { validImgSize } from '../../../src/assets/utils'

const IMG_URL =
  'https://global.uban360.com/sfs/file?digest=fid1067e1c4978385c01d206e14d0b2a3ec&fileType=2' // 800 X 800

/* 设计js原生 Image 对象，测试失败 */
describe('校验图片大小是否符合要求', () => {
  test('校验图片 resolves', async () => {
    // expect.assertions(1)
    // const result = await validImgSize(IMG_URL, 800, 800)
    // return expect(result).toBe(true)
  })

  test('校验图片 rejects', async () => {
    // expect.assertions(1)
    // const result = await validImgSize(IMG_URL, 800, 801)
    // return expect(result).toEqual({
    //   width: 800,
    //   height: 800,
    // })
  })
})
