import { ExtensionContext, QuickPickItemKind, window, QuickPickItem, workspace, commands, Uri } from 'vscode';
import { showInputBox, showQuickPick } from '../components/QuickPick/basicInput';
import { multiStepInput } from '../components/QuickPick/multiStepInput';
import { quickOpen } from '../components/QuickPick/quickOpen';
import fetch from 'node-fetch';

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

type PayloadResponse = {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    type: string;
}

export class QuickPickController {
    public constructor(context: ExtensionContext) {
    }

    public async showQuickPick() {
        const categories: PayloadCategoryItem[] = [new PayloadCategoryItem('Credentials', 0), new PayloadCategoryItem('Execution', 1), new PayloadCategoryItem('Exfiltration', 2), new PayloadCategoryItem('General', 3), new PayloadCategoryItem('Incident Response', 4), new PayloadCategoryItem('Mobile', 5), new PayloadCategoryItem('Phishing', 6), new PayloadCategoryItem('Prank', 7), new PayloadCategoryItem('Reconnaissance', 8), new PayloadCategoryItem('Remote Access', 9)]

        const quickPick = window.createQuickPick();
        quickPick.items = categories;
        quickPick.placeholder = 'Choose Payload Category';

        quickPick.onDidChangeSelection(selection => {
           if(selection[0] && selection[0] instanceof PayloadCategoryItem) {
            this.retrievePayloadsForCategory(selection[0]);
           }
        })

        quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();     
    }

    private async retrievePayloadsForCategory(category: PayloadCategoryItem) {
        const files = ['credentials', 'execution', 'exfiltration', 'general', 'incident_response', 'mobile', 'phishing', 'prank', 'recon', 'remote_access'];
        const selectedFile = files[category.index];
        const response = await fetch(`https://api.github.com/repos/hak5/usbrubberducky-payloads/contents/payloads/library/${selectedFile}`);
	    const payloads = await response.json() as PayloadResponse[];
        const filteredPayloads = payloads.filter(obj => {
            return obj.name != 'placeholder';
        })
        this.showPayloadsForCategory(filteredPayloads);
    }

    public async showPayloadsForCategory(payloads: PayloadResponse[]) {
        console.log(payloads);
        const payloadItems : PayloadItem[] = payloads.map((payload, index) => {
           return new PayloadItem(payload.name, index, payload);
        })
        const quickPick = window.createQuickPick();
        quickPick.items = payloadItems;
        quickPick.placeholder = "Choose Payload";

        quickPick.onDidChangeSelection(selection => {
            if(selection[0] && selection[0] instanceof PayloadItem) {
                window.showInformationMessage(`Chose ${selection[0].itemLabel} payload!`);
                console.log("payload is", selection[0]);
                this.choosePayload(selection[0]);
            }
        })

        quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();   
    }

    public async choosePayload(payload: PayloadItem) {
        console.log("choosing", payload.itemResponse.html_url)
        const path = payload.itemResponse.html_url.split('https://github.com/hak5/usbrubberducky-payloads/tree/master/')[1];
        console.log("choosing 2", path)
        let updatedURL = `https://api.github.com/repos/hak5/usbrubberducky-payloads/contents/${path}`;
        const response = await fetch(updatedURL);
	    const payloads = await response.json();
        console.log("new", payloads[0].content)
        // const folderUri = Uri.file(`/${payload.itemLabel}`);
        // commands.executeCommand('vscode.openFolder', folderUri);
        let payloadURL = await Uri.parse(payloads[0].url);
        console.log("calling", payloads[0].url)
        const response2 = await fetch(payloads[0].url);
	    const payloads2 = await response2.json();
        console.log("jackpot", payloads2)
        workspace.updateWorkspaceFolders(0,undefined,{uri: payloadURL, name:payload.itemLabel});
    }

    public dispose(){}

}