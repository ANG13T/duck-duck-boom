import { ExtensionContext, QuickPickItemKind, window, QuickPickItem } from 'vscode';
import { showInputBox, showQuickPick } from '../components/QuickPick/basicInput';
import { multiStepInput } from '../components/QuickPick/multiStepInput';
import { quickOpen } from '../components/QuickPick/quickOpen';

export class QuickPickController {
    public constructor(context: ExtensionContext) {
    }

    public async showQuickPick() {
        await window.showQuickPick(['Credentials', 'Execution', 'Exfiltration', 'General', 'Incident Response', 'Mobile', 'Phishing', 'Prank', 'Reconnaissance', 'Remote Access'], {
            placeHolder: 'Choose Payload Category',
            onDidSelectItem: item => this.showPayloadForCategory(item)
        });
    }

    private async showPayloadForCategory(category: string | QuickPickItem) {
        window.showInformationMessage(`Chose ${category} category!`)
    }

    public async showInputBox() {
        const result = await window.showInputBox({
            value: 'abcdef',
            valueSelection: [2, 4],
            placeHolder: 'For example: fedcba. But not: 123',
            validateInput: text => {
                window.showInformationMessage(`Validating: ${text}`);
                return text === '123' ? 'Not 123!' : null;
            }
        });
        window.showInformationMessage(`Got: ${result}`);
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