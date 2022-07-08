import { window } from 'vscode';

export class QuickPickController {
    public constructor() {
    }

    public async showQuickPick() {
        let i = 0;
        const result = await window.showQuickPick(['eins', 'zwei', 'drei'], {
            placeHolder: 'eins, zwei or drei',
            onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
        });
        window.showInformationMessage(`Got: ${result}`);
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

}