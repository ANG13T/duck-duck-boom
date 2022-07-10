import fetch from 'node-fetch';
import { PayloadResponse } from '../utils/payloadTypes';

export class PayloadController {
    private payloads: any = {
        'credentials': [],
        'execution': [], 
        'exfiltration': [],
        'general': [], 
        'incident_response': [], 
        'mobile': [], 
        'phishing': [], 
        'prank': [], 
        'recon': [], 
        'remote_access': []
    }
    constructor() {
        this.payloads = {
            'credentials': [],
            'execution': [], 
            'exfiltration': [],
            'general': [], 
            'incident_response': [], 
            'mobile': [], 
            'phishing': [], 
            'prank': [], 
            'recon': [], 
            'remote_access': []
        }
    }

    public async getPayloadsForCategories() : Promise<any>{
        return new Promise(async(resolve) => {
            const files = ['credentials', 'execution', 'exfiltration', 'general', 'incident_response', 'mobile', 'phishing', 'prank', 'recon', 'remote_access'];
            await files.forEach(async(file, index) => {
                let results = await this.runPayloadsByCategory(file);
                this.payloads[file] = results;
                if(file == 'remote_access') {
                    resolve(this.payloads);
                }
            });
        })
    }

    public async runPayloadsByCategory(selectedFile: string) {
        const response = await fetch(`https://api.github.com/repos/hak5/usbrubberducky-payloads/contents/payloads/library/${selectedFile}`);
        const payloads = await response.json() as PayloadResponse[];
        const filteredPayloads = payloads.filter(obj => {
            return obj.name != 'placeholder';
        })
        return filteredPayloads;
    }
}