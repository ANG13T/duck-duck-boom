import { ExtensionContext, QuickPickItemKind, window, QuickPickItem } from 'vscode';
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
        window.showInformationMessage(`Chose ${category} category!`);
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
                console.log("payload is", selection[0]);
            }
        })

        quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();   
    }

    public async createQuickPick(context: ExtensionContext) {
        const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
			showQuickPick,
			showInputBox,
			multiStepInput,
			quickOpen,
		};
		const quickPick = window.createQuickPick();
		//quickPick.items = Object.keys(options).map(label => ({ label }));
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
                console.log(selection[0])
				options[selection[0].label](context)
					.catch(console.error);
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
    }

    public dispose(){}

}