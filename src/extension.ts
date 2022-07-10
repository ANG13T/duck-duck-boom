import {commands, ExtensionContext, window, workspace} from 'vscode';
import fetch from 'node-fetch';
import { QuickPickController } from './controllers/quickPickController';
import { ViewsController } from './controllers/viewsController';

export function activate(context: ExtensionContext) {
	let quickPickController = new QuickPickController(context);
	let viewsController = new ViewsController();

	let disposable = commands.registerCommand('duck-duck-boom.helloWorld', async() => {
		window.showInformationMessage('Hello World from Duck Duck Boom!');
	});

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.quickInput', async () => {
		quickPickController.showQuickPick();
	}));

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.views', async () => {
		console.log("show views controller")
	}));

	context.subscriptions.push(disposable);
}

export function deactivate() {}
