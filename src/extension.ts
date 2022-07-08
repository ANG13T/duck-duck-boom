import * as vscode from 'vscode';
import fetch from 'node-fetch';

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "duck-duck-boom" is now active!');

	let disposable = vscode.commands.registerCommand('duck-duck-boom.helloWorld', async() => {
		vscode.window.showInformationMessage('Hello World from Duck Duck Boom!');
		let results = await createAPICall();
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