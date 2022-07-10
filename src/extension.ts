import {commands, ExtensionContext, window, workspace} from 'vscode';
import { CopyLinkController } from './controllers/copyLinkController';
import { QuickPickController } from './controllers/quickPickController';
import { ViewsController } from './controllers/viewsController';

export function activate(context: ExtensionContext) {
	let quickPickController = new QuickPickController(context);
	let viewsController = new ViewsController();
	let copyLinkController = new CopyLinkController();

	// get all data for payloads (catgeory -> payload name) in beginning and pass data down to controllers

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.quickInput', async () => {
		quickPickController.showQuickPick();
	}));

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.views', async () => {
		console.log("show views controller")
	}));

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.copyPayloadLink', async () => {
		copyLinkController.copyPayloadLink();
	}));
}

export function deactivate() {}
