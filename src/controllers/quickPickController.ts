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
            this.showPayloadsForCategory(selection[0]);
           }
        })

        quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();     
    }

    private async showPayloadsForCategory(category: PayloadCategoryItem) {
        const files = ['credentials', 'execution', 'exfiltration', 'general', 'incident_response', 'mobile', 'phishing', 'prank', 'recon', 'remote_access'];
        const selectedFile = files[category.index];
        const response = await fetch(`https://api.github.com/repos/hak5/usbrubberducky-payloads/contents/payloads/library/${selectedFile}`);
	    const payloads = await response.json();
        console.log(payloads)
        window.showInformationMessage(`Chose ${category} category!`);

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