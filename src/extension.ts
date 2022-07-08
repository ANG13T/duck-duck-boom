import * as vscode from 'vscode';
import fetch from 'node-fetch';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('duck-duck-boom.helloWorld', async() => {
		vscode.window.showInformationMessage('Hello World from Duck Duck Boom!');
		let results = await createAPICall();
	});


	let disposable2 = vscode.commands.registerCommand('duck-duck-boom.quickInput', async() => {
		const options: { [key: string]: (context: vscode.ExtensionContext) => Promise<void> } = {
			showInputBox
		};
		const quickPick = vscode.window.createQuickPick();
		quickPick.items = Object.keys(options).map(label => ({ label }));
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				options[selection[0].label](context)
					.catch(console.error);
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}


async function createAPICall(): Promise<void> {
	// https://api.github.com/users/github
	const response = await fetch('https://api.github.com/repos/hak5/usbrubberducky-payloads/contents/payloads/library');
	const data = await response.json();

	console.log(data);

	return;
}