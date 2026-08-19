import { PagedResultDto } from '../dto';
import http from '../httpService';
import { GetAllPayload, CreateOrUpdateApplicationReqDto, GetAllApplicationReqsResponse, ApplicationRequestDto } from './dto';

class ApplicationReqsService {
   
    public async getAll(input: GetAllPayload): Promise<PagedResultDto<GetAllApplicationReqsResponse>> {
        let result = await http.get('api/app/application-requests-for-admin', {
            params: {
                skipCount: input.skipCount,
                maxResultCount: input.maxResultCount,
                name: input.name,
                id: input.id,
                phoneNumber: input.phoneNumber,
                cityId: input.cityId,
                status: input.status
            }
        });
        return result.data;
    }
    
    public async get(id: number): Promise<ApplicationRequestDto> {
        let result = await http.get(`api/app/application-requests-for-admin/${id}`);
        return result.data;
    }

    public async verify(id: number): Promise<any> {
        let result = await http.post('api/app/application-requests-for-admin/verify', { id });
        return result.data;
    }
    
    public async reject(id: number): Promise<any> {
        let result = await http.post('api/app/application-requests-for-admin/reject', { id });
        return result.data;
    }

    public async accept(id: number, permissions: string[]): Promise<any> {
        let result = await http.post('api/app/application-requests-for-admin/accept', { id, permissions });
        return result.data;
    }

    public async create(input: CreateOrUpdateApplicationReqDto): Promise<any> {
        let result = await http.post('api/app/application-requests-for-admin', input);
        return result.data;
    }

    public async update(input: CreateOrUpdateApplicationReqDto): Promise<any> {
        let result = await http.put('api/app/application-requests-for-admin', input);
        return result.data;
    }

    public async updateCompleteInfo(input: CreateOrUpdateApplicationReqDto): Promise<any> {
        let result = await http.put('api/app/application-requests-for-admin/complete-info', input);
        return result.data;
    }

    public async setAsWaitingForApproval(id: number): Promise<any> {
        let result = await http.post('api/app/application-requests-for-admin/set-as-waiting-for-approval', { id });
        return result.data;
    }

}

const applicationReqsServiceInstance = new ApplicationReqsService();
export default applicationReqsServiceInstance;
