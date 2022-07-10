import {commands, ExtensionContext, window, workspace} from 'vscode';
import { QuickPickController } from './controllers/quickPickController';
import { ViewsController } from './controllers/viewsController';

export function activate(context: ExtensionContext) {
	let quickPickController = new QuickPickController(context);
	let viewsController = new ViewsController();

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.quickInput', async () => {
		quickPickController.showQuickPick();
	}));

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.views', async () => {
		console.log("show views controller")
	}));
}

export function deactivate() {}
