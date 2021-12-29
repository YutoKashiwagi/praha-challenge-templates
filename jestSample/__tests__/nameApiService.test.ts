import { NameApiService } from "../nameApiService"
import type { IAxiosInstance } from "../nameApiService"

describe('getFirstName', () => {
  test('5文字未満の場合、firstNameを返すこと', () => {
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
    const AxiosMock = jest.fn<IAxiosInstance, any>().mockImplementation(() => {
      return {
        get
      }
    })
    const axios: IAxiosInstance = new AxiosMock()
    const nameApiService = new NameApiService(axios)

    // アサーション
    return nameApiService.getFirstName().then(fetchedName => {
      expect(get.mock.calls.length).toBe(1) // 呼び出し回数の確認
      expect(get.mock.calls[0][0]).toEqual("https://random-data-api.com/api/name/random_name") // 引数のチェック
      expect(fetchedName).toEqual("aaa")
    })
  })

  test('5文字以上の場合、例外が発生すること', () => {
    // モック
    const response = () => {
      return {
        data: {
          first_name: "aaaaa"
        }
      }
    }
    const get = jest.fn((url: string) => {
      return new Promise((resolve) => {
        resolve(response())
      })
    })
    const AxiosMock = jest.fn<IAxiosInstance, any>().mockImplementation(() => {
      return {
        get
      }
    })
    const axios: IAxiosInstance = new AxiosMock()
    const nameApiService = new NameApiService(axios)

    // アサーション
    return nameApiService.getFirstName().catch(error => {
      expect(get.mock.calls.length).toBe(1) // 呼び出し回数の確認
      expect(get.mock.calls[0][0]).toEqual("https://random-data-api.com/api/name/random_name") // 引数のチェック
      expect(error.message).toMatch("firstName is too long!")
    })
  })
})
