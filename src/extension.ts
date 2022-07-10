import {commands, ExtensionContext, window, workspace} from 'vscode';
import { CopyLinkController } from './controllers/copyLinkController';
import { PayloadController } from './controllers/payloadController';
import { QuickPickController } from './controllers/quickPickController';
import { ViewsController } from './controllers/viewsController';

export async function activate(context: ExtensionContext) {
	let quickPickController = new QuickPickController(context);
	let viewsController = new ViewsController();
	let copyLinkController = new CopyLinkController();
	let payloadController = new PayloadController();

	let payloads = {
		'credentials': [],
		'execution': [], 
		'exfiltration': [],
		'general': [], 
		'incident_response': [], 
		'mobile': [], 
		'phishing': [], 
		'prank': [], 
		'recon': [], 
		'remote_access': []
	}	

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.quickInput', async () => {
		quickPickController.showQuickPick();
	}));

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.views', async () => {
		viewsController.showView();
	}));

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.copyPayloadLink', async () => {
		if (payloads.credentials.length == 0) {
			await payloadController.getPayloadsForCategories().then((result) => {
				if(result) {
					console.log("WYAYAY", result)
					payloads = result;
				}
			})
		}
		copyLinkController.copyPayloadLink(payloads);
	}));
}

export function deactivate() {}
