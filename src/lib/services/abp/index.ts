import http from '../httpService'
import http2 from '../httpServiceTesting'
import { ApplicationConfigurationDto } from './dto'

class AbpService {
  public async abpApplicationConfigurationGet(
    accessToken: string,
    includeLocalizationResources: boolean,
    lng: string,
    tenant: string | undefined,
    devOnly?: boolean
  ): Promise<ApplicationConfigurationDto> {
    let result = await (devOnly ? http2 : http).get(`api/abp/application-configuration`, {
      params: {
        IncludeLocalizationResources: includeLocalizationResources,
      },
      headers: {
        Authorization: 'Bearer ' + accessToken,
        __tenant: tenant ?? '',
      },
    })
    return result.data
  }
}

const abpServiceInstance = new AbpService()
export default abpServiceInstance
