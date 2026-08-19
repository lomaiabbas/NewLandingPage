import { LiteEntityDto, PagedResultDto } from '../dto';
import http from '../httpService';
import { CreateOrUpdateLocationDto, GetAllPayload, LocationDto } from './dto';

class LocationService {
   
    public async getAll(input: GetAllPayload): Promise<PagedResultDto<LocationDto>> {
        let result = await http.get('api/app/location', {
            params: {
                skipCount: input.skipCount,
                maxResultCount: input.maxResultCount,
                name: input.name,
                isActive: input.isActive,
                parentId: input.parentId,
                type: input.type
            }
        });
        return result.data;
    }

    public async getAllLite(input: GetAllPayload): Promise<PagedResultDto<LiteEntityDto>> {
        let result = await http.get('api/app/location/lite', {
            params: {
                skipCount: input.skipCount,
                maxResultCount: input.maxResultCount,
                name: input.name,
                isActive: input.isActive,
                parentId: input.parentId,
                type: input.type
            }
        });
        return result.data;
    }

    public async get(id: number): Promise<LocationDto> {
        let result = await http.get('api/app/location/{id}');
        return result.data;
    }
    
    public async create(input: CreateOrUpdateLocationDto): Promise<LocationDto> {
        let result = await http.post('api/app/location', input);
        return result.data;
    }
    
    public async update(input: CreateOrUpdateLocationDto, id: number): Promise<LocationDto> {
        let result = await http.put(`api/app/location/${id}`, input);
        return result.data;
    }

    public async active(id: number): Promise<any> {
        let result = await http.post('api/app/location/activate', { id });
        return result.data;
    }
    
    public async deactive(id: number): Promise<any> {
        let result = await http.post('api/app/location/de-activate', { id });
        return result.data;
    }
   
}

const locationServiceInstance = new LocationService();
export default locationServiceInstance;
