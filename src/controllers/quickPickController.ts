import { ExtensionContext, window, QuickPickItem, workspace, ProgressLocation } from 'vscode';
const fs = require('fs');
const path = require('path');
const Readable = require('stream').Readable;

import fetch from 'node-fetch';
import { PayloadResponse } from '../utils/payloadTypes';

class PayloadCategoryItem implements QuickPickItem {
    label: string;
    index: number;

    constructor(public itemLabel: string, public itemIndex: number) {
        this.label = itemLabel;
        this.index = itemIndex;
    }
}

class PayloadItem implements QuickPickItem {
    label: string;
    index: number;
    response: PayloadResponse;

    constructor(public itemLabel: string, public itemIndex: number, public itemResponse: PayloadResponse) {
        this.label = itemLabel;
        this.index = itemIndex;
        this.response = itemResponse;
    }
}


export class QuickPickController {
    private extensionContent: ExtensionContext;

    public constructor(context: ExtensionContext) {
        this.extensionContent = context;
    }

    public async showQuickPick() {
        const categories: PayloadCategoryItem[] = [new PayloadCategoryItem('Credentials', 0), new PayloadCategoryItem('Execution', 1), new PayloadCategoryItem('Exfiltration', 2), new PayloadCategoryItem('General', 3), new PayloadCategoryItem('Incident Response', 4), new PayloadCategoryItem('Mobile', 5), new PayloadCategoryItem('Phishing', 6), new PayloadCategoryItem('Prank', 7), new PayloadCategoryItem('Reconnaissance', 8), new PayloadCategoryItem('Remote Access', 9)]

        const quickPick = window.createQuickPick();
        quickPick.items = categories;
        quickPick.placeholder = 'Choose Payload Category';

        quickPick.onDidChangeSelection(selection => {
            if (selection[0] && selection[0] instanceof PayloadCategoryItem) {
                this.retrievePayloadsForCategory(selection[0]);
            }
        })

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }

    private async retrievePayloadsForCategory(category: PayloadCategoryItem) {
        const files = ['credentials', 'execution', 'exfiltration', 'general', 'incident_response', 'mobile', 'phishing', 'prank', 'recon', 'remote_access'];
        let selectedFile = files[category.index];
        if (selectedFile == 'mobile') {
            let chosenMobile = await this.showMobileQuickPick();
            selectedFile = `${selectedFile}/${chosenMobile}`;
            await this.runPayloadsByCategory(selectedFile);
        } else {
            await this.runPayloadsByCategory(selectedFile);
        }
    }

    public async runPayloadsByCategory(selectedFile: string) {
        const response = await fetch(`https://api.github.com/repos/hak5/usbrubberducky-payloads/contents/payloads/library/${selectedFile}`);
        const payloads = await response.json() as PayloadResponse[];
        const filteredPayloads = payloads.filter(obj => {
            return obj.name != 'placeholder';
        })

        this.showPayloadsForCategory(filteredPayloads);
    }

    public async showMobileQuickPick(): Promise<string> {
        return new Promise((resolve) => {
            const categories: PayloadCategoryItem[] = [new PayloadCategoryItem('Android', 0), new PayloadCategoryItem('IOS', 1)]

            const quickPick = window.createQuickPick();
            quickPick.items = categories;
            quickPick.placeholder = 'Choose Mobile Type';

            quickPick.onDidChangeSelection(selection => {
                if (selection[0] && selection[0] instanceof PayloadCategoryItem) {
                    resolve(selection[0].label);
                }
            })

            quickPick.onDidHide(() => quickPick.dispose());
            quickPick.show();
        })
    }

    public async showPayloadsForCategory(payloads: PayloadResponse[]) {
        const payloadItems: PayloadItem[] = payloads.map((payload, index) => {
            return new PayloadItem(payload.name, index, payload);
        })
        const quickPick = window.createQuickPick();
        quickPick.items = payloadItems;
        quickPick.placeholder = "Choose Payload";

        quickPick.onDidChangeSelection(selection => {
            if (selection[0] && selection[0] instanceof PayloadItem) {
                // Include Edge cases
                if(selection[0].itemLabel == "Ascii") {
                    this.runPayloadsByCategory("general/Ascii");
                    return;
                }

                window.showInformationMessage(`Chose ${selection[0].itemLabel} payload!`);

                window.withProgress({
                    location: ProgressLocation.Window,
                    cancellable: false,
                    title: 'Loading payload'
                }, async (progress) => {

                    progress.report({ increment: 0 });

                    await this.choosePayload(selection[0]);

                    progress.report({ increment: 100 });
                });
            }
        })

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }

    public async choosePayload(payload: any) {
        // gets files under the payload directory
        const payloadPath = payload.itemResponse.html_url.split('https://github.com/hak5/usbrubberducky-payloads/tree/master/')[1];
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

        await this.createPayloadDirectory(payload.itemLabel, correctPayloadFiles)

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

    public dispose() { }

}