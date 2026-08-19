import { LiteEntityDto, PagedResultDto } from '../dto'
import http from '../httpService'
import {
  GetAllCompaniesForAdminResponseDto,
  GetAllPayload,
  WhatsAppBusinessAccountDto,
} from './dto'

class CompaniesService {
  public async getAll(
    input: GetAllPayload
  ): Promise<PagedResultDto<GetAllCompaniesForAdminResponseDto>> {
    let result = await http.get('api/app/company-for-admin', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        name: input.name,
        id: input.id,
        phoneNumber: input.phoneNumber,
        status: input.status,
        industry: input.industry,
      },
    })
    return result.data
  }

  public async getAllLite(input: GetAllPayload): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/app/company-for-admin/lite', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        name: input.name,
        status: input.status,
        hasChannel: input.hasChannel,
      },
    })
    return result.data
  }

  public async get(id: number): Promise<any> {
    let result = await http.get(`api/app/company-for-admin/${id}`)
    return result.data
  }

  public async active(id: number): Promise<any> {
    let result = await http.post('api/app/company-for-admin/active', { id })
    return result.data
  }

  public async deactive(id: number): Promise<any> {
    let result = await http.post('api/app/company-for-admin/de-active', { id })
    return result.data
  }

  public async update(input: any): Promise<any> {
    let result = await http.put(`api/app/company-for-admin/${input.id}`, input)
    return result.data
  }

  public async getFeatures(providerKey: string): Promise<any> {
    let result = await http.get(`api/feature-management/features`, {
      params: {
        providerName: 'T',
        providerKey: providerKey,
      },
    })
    return result.data
  }

  public async updateFeatures(providerKey: string, input: any): Promise<any> {
    let result = await http.put(`api/feature-management/features`, input, {
      params: {
        providerName: 'T',
        providerKey: providerKey,
      },
    })
    return result.data
  }

  public async getRolesByCompany(input: GetAllPayload): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/app/company-for-admin/roles-by-company', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        companyId: input.id,
      },
    })
    return result.data
  }

  public async getWhatsAppBusinessAccount(): Promise<WhatsAppBusinessAccountDto> {
    let result = await http.get(`api/app/company-for-admin/whats-app-business-account`)
    return result.data
  }

  public async enableSendingTemplates(companyId: number): Promise<any> {
    let result = await http.post(`api/app/company-for-admin/enable-sending-templates/${companyId}`)
    return result.data
  }

  public async disableSendingTemplates(companyId: number): Promise<any> {
    let result = await http.post(`api/app/company-for-admin/disable-sending-templates/${companyId}`)
    return result.data
  }
  
  public async hideInLandingPage(companyId: number): Promise<any> {
    let result = await http.post(`api/app/company-for-admin/hide-in-landing-page/${companyId}`)
    return result.data
  }

  public async showInLandingPage(companyId: number): Promise<any> {
    let result = await http.post(`api/app/company-for-admin/show-in-landing-page/${companyId}`)
    return result.data
  }

  public async getUserContextForAdmin(): Promise<any> {
    let result = await http.get('api/app/user-context-for-admin')
    return result.data
  }
}

const companiesServiceInstance = new CompaniesService()
export default companiesServiceInstance
