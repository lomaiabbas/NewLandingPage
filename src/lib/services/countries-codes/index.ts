import { LiteEntityDto, PagedResultDto } from '../dto';
import http from '../httpService';
import { GetAllPayload, CountryCodeDto } from './dto';

class CountriesCodesService {
   
    public async getAll(input: GetAllPayload): Promise<PagedResultDto<CountryCodeDto>> {
        let result = await http.get('api/app/country-code', {
            params: {
                skipCount: input.skipCount,
                maxResultCount: input.maxResultCount,
                name: input.name,
                isActive: input.isActive
            }
        });
        return result.data;
    }

    public async getAllLite(input: GetAllPayload): Promise<PagedResultDto<LiteEntityDto>> {
        let result = await http.get('api/app/country-code/lite', {
            params: {
                skipCount: input.skipCount,
                maxResultCount: input.maxResultCount,
                name: input.name,
                isActive: input.isActive
            }
        });
        return result.data;
    }

    public async get(id: number): Promise<CountryCodeDto> {
        let result = await http.get(`api/app/country-code/${id}`);
        return result.data;
    }

    public async update(input: any): Promise<CountryCodeDto> {
        let result = await http.put(`api/app/country-code/${input.id}`, input);
        return result.data;
    }
    
    public async create(input: any): Promise<CountryCodeDto> {
        let result = await http.post(`api/app/country-code`, input);
        return result.data;
    }

    public async activate(id: number): Promise<any> {
        let result = await http.post('api/app/country-code/activate', { id });
        return result.data;
    }
    
    public async deActivate(id: number): Promise<any> {
        let result = await http.post('api/app/country-code/de-activate', { id });
        return result.data;
    }
}

const countriesCodesServiceInstance = new CountriesCodesService();
export default countriesCodesServiceInstance;
