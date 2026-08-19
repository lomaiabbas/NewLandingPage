import http from '../httpService'

class LanguageService {
  public async get(): Promise<any> {
    let result = await http.get(`api/app/user-language/`)
    return result.data
  }

  public async update(language: string): Promise<any> {
    let result = await http.put('api/app/user-language/', {
      language,
    })
    return result.data
  }
}

const languageServiceInstance = new LanguageService()
export default languageServiceInstance
