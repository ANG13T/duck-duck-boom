import fetch from 'node-fetch';
import { PayloadResponse } from '../utils/payloadTypes';

export class PayloadController {
    private payloads = {
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

    public async getPayloadsForCategories() {
        const files = ['credentials', 'execution', 'exfiltration', 'general', 'incident_response', 'mobile', 'phishing', 'prank', 'recon', 'remote_access'];
        files.forEach(async(file) => {
            let results = await this.runPayloadsByCategory(file);
            this.payloads[file] = results;
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