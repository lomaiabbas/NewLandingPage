import { AxiosRequestConfig } from 'axios';
import http from '../httpService';
import { SignupDto } from './dto';

class CompaniesForManagerService {

    // public async signup(input: SignupDto): Promise<any> {
    //     let result = await http.post('api/app/application-requests-for-manager/sign-up', input);
    //     return result.data;
    // }

    // the same request; `config` lets a caller (the landing page's register modal) pass
    // skipErrorHandler and show the error itself instead of httpService's global popup
    public async signup(input: SignupDto, config?: AxiosRequestConfig & { skipErrorHandler?: boolean }): Promise<any> {
        let result = await http.post('api/app/application-requests-for-manager/sign-up', input, config);
        return result.data;
    }

    public async updateCompanyBasicSignupInfo(input: SignupDto): Promise<any> {
        let result = await http.put('api/app/application-requests-for-manager/company-basic-sign-up-info', input);
        return result.data;
    }
    public async completeSignupInfo(input: any): Promise<any> {
        let result = await http.post('api/app/application-requests-for-manager/complete-sign-up-info', input);
        return result.data;
    }

    public async companySignupInfo(input: any): Promise<any> {
        let result = await http.get('api/app/application-requests-for-manager/company-sign-up-info', {
            params: {
                phoneNumber: input.phoneNumber,
                countryCode: input.countryCode,
                code: input.code,
                subDomainName:input.subDomainName
            }
        });
        return result.data;
    }

}

const companiesForManagerServiceInstance = new CompaniesForManagerService();
export default companiesForManagerServiceInstance;
