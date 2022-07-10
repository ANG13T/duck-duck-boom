import {commands, ExtensionContext, window, workspace} from 'vscode';
import fetch from 'node-fetch';
import { QuickPickController } from './controllers/quickPickController';

export function activate(context: ExtensionContext) {
	let quickPickController = new QuickPickController(context);

	let disposable = commands.registerCommand('duck-duck-boom.helloWorld', async() => {
		window.showInformationMessage('Hello World from Duck Duck Boom!');
		let results = await createAPICall();
	});

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.quickInput', async () => {
		quickPickController.showQuickPick();
	}));

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