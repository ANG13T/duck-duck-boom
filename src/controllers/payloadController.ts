import fetch from 'node-fetch';
import { PayloadResponse } from '../utils/payloadTypes';
import { window, workspace, ProgressLocation } from 'vscode';
const fs = require('fs');
const path = require('path');
const Readable = require('stream').Readable;

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
            await files.forEach(async(file) => {

                if (file == 'mobile') {
                    let IOSPayloads = await this.runPayloadsByCategory(`${file}/IOS`);
                    let AndroidPayloads = await this.runPayloadsByCategory(`${file}/Android`);
                    this.payloads[file] = [...IOSPayloads, ...AndroidPayloads];
                }else {
                    this.payloads[file] = await this.runPayloadsByCategory(file);
                }
                
                if(file == 'remote_access') {
                    resolve(this.payloads);
                }
            });
        })
    }

    public async runPayloadsByCategory(selectedFile: string) {
        const response = await fetch(`https://api.github.com/repos/hak5/usbrubberducky-payloads/contents/payloads/library/${selectedFile}`);
        const payloads = await response.json() as PayloadResponse[];
        if(!payloads) return [];
        const filteredPayloads = payloads.filter(obj => {
            return obj.name != 'placeholder';
        })
        return filteredPayloads;
    }

    public async choosePayload(paylaod: any) {
        window.showInformationMessage(`Chose ${paylaod.name} payload!`);

        window.withProgress({
            location: ProgressLocation.Window,
            cancellable: false,
            title: 'Loading payload'
        }, async (progress) => {

            progress.report({ increment: 0 });

            await this.choosePayloadFile(paylaod);

            progress.report({ increment: 100 });
        });
        
    }

    public async choosePayloadFile(payload: any) {
        // gets files under the payload directory
        const payloadPath = payload.html_url.split('https://github.com/hak5/usbrubberducky-payloads/tree/master/')[1];
        let updatedURL = `https://api.github.com/repos/hak5/usbrubberducky-payloads/contents/${payloadPath}`;
        const response = await fetch(updatedURL);
        const files = await response.json();
        
        if (files.length == 0) {
            window.showErrorMessage("No payloads available");
            return;
        }
        const correctPayloadFiles = files.filter((file: any) => {
            return file.type == "file" && file.name != "placeholder";
        }); 

        await this.createPayloadDirectory(payload.name, correctPayloadFiles)

    }

    public async createPayloadDirectory(payloadName: string, payloadFiles: any[]) {
        if (!workspace || !workspace.workspaceFolders) {
            return window.showErrorMessage('Please open a project folder first');
        }

        const folderPath = workspace.workspaceFolders[0]?.uri
            .toString()
            .split(':')[1].concat(`/${payloadName}`);


        if (!fs.existsSync(folderPath)) {
            await fs.mkdir(folderPath, (err: any) => {
                console.log("error", err)
            });
        } else {
            window.showErrorMessage('Payload already imported!')
        }

        for await (const results of payloadFiles) {
            await this.processPayloadFile(results.path, folderPath);
        }
    }

    public async processPayloadFile(payloadFilePath: string, folderPath: string) {
        let updatedFinalURL = `https://api.github.com/repos/hak5/usbrubberducky-payloads/contents/${payloadFilePath}`;
        const response2 = await fetch(updatedFinalURL);
        const payloads2 = await response2.json();

        const fileBuffer = Buffer.from(payloads2.content, 'base64')

        var stream = new Readable()

        stream.push(fileBuffer)
        stream.push(null)

        stream.pipe(fs.createWriteStream(path.join(folderPath, payloads2.name)), (err: any) => {
            if (err) {
                return window.showErrorMessage(
                    'Failed to import payload!'
                );
            }
        });
    }
}