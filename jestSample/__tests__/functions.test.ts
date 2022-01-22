import { asyncSumOfArray, sumOfArray, asyncSumOfArraySometimesZero, getFirstNameThrowIfLong } from "../functions"
import { DatabaseMock } from "../util"
import { IHttpClient, NameApiService } from '../nameApiService'

describe('sumOfArray', () => {
  test('配列内の数値の合計を取得できること', () => {
    expect(sumOfArray([1, 2, 3, 4])).toEqual(10)
  })

  test('配列が空の場合、0が返ること', () => {
    expect(sumOfArray([])).toEqual(0)
  })
})

describe('asyncSumOfArray', () => {
  test('配列内の数値の合計を取得できること', () => {
    return asyncSumOfArray([1, 2, 3, 4]).then(sum => {
      expect(sum).toEqual(10)
    })
  })

  test('配列が空の場合、0が返ること', () => {
    return asyncSumOfArray([]).then(sum => {
      expect(sum).toEqual(0)
    })
  })

  // 型が異なる場合、CIで落ちるはずなのでコンパイルエラーのテストは書かない
})

describe('asyncSumOfArraySometimesZero', () => {
  const save = jest.fn((numbers: number[]) => {})

  const DBMock = jest.fn<DatabaseMock, any>().mockImplementation(() => {
    return {
      save: save,
    }
  })
  const database = new DBMock()

  test('配列内の数値をsaveし、数値の合計を取得できること', () => {
    return asyncSumOfArraySometimesZero([1, 2, 3, 4], database).then(sum => {
      expect(save.mock.calls.length).toBe(1) // 呼び出し回数の確認
      expect(save.mock.calls[0][0]).toEqual([1, 2, 3, 4]) // 引数のチェック
      expect(sum).toEqual(10)
    })
  })

  test('配列が空の場合、0が返ること', () => {
    expect.assertions(1)
    return asyncSumOfArraySometimesZero([], database).then(sum => {
      expect(sum).toEqual(0)
    })
  })
})

describe('getFirstNameThrowIfLong', () => {
  const maxNameLength = 3

  test('maxNameLength以下の文字数のFirstNameの場合、FirstNameを取得できること', () => {
    // モック
    const response = () => {
      return {
        data: {
          first_name: "aaa"
        }
      }
    }  
    const get = jest.fn((url: string) => {
      return new Promise((resolve) => {
        resolve(response())
      })
    })  
    const HttpClientMock = jest.fn<IHttpClient, any>().mockImplementation(() => {
      return {
        get
      }
    })
    const httpClient: IHttpClient = new HttpClientMock()
    const nameApiService = new NameApiService(httpClient)

    // テスト
    return getFirstNameThrowIfLong(maxNameLength, nameApiService).then(firstName => {
      expect(firstName).toEqual("aaa")
    })
  })

  test('最大文字数を超過した場合、エラーが発生すること', () => {
    // モック
    const response = () => {
      return {
        data: {
          first_name: "aaaa"
        }
      }
    }  
    const get = jest.fn((url: string) => {
      return new Promise((resolve) => {
        resolve(response())
      })
    })  
    const HttpClientMock = jest.fn<IHttpClient, any>().mockImplementation(() => {
      return {
        get
      }
    })
    const httpClient: IHttpClient = new HttpClientMock()
    const nameApiService = new NameApiService(httpClient)

    // テスト
    return getFirstNameThrowIfLong(maxNameLength, nameApiService).catch(error => {
      expect(error.message).toMatch("first_name too long")
    })
  })
})
