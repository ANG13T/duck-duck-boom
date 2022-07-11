import {commands, ExtensionContext, window, workspace} from 'vscode';
import { TreeDataProvider } from './components/treeDataProvider';
import { CopyLinkController } from './controllers/copyLinkController';
import { PayloadController } from './controllers/payloadController';
import { QuickPickController } from './controllers/quickPickController';

export async function activate(context: ExtensionContext) {
	let quickPickController = new QuickPickController(context);
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

	if (payloads.credentials.length == 0) {
		await payloadController.getPayloadsForCategories().then((result) => {
			if(result) {
				payloads = result;
			}
		})
	}

	window.registerTreeDataProvider('payloadView', new TreeDataProvider(payloads));

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.quickInput', async () => {
		quickPickController.showQuickPick();
	}));

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.copyPayloadLink', async () => {
		copyLinkController.copyPayloadLink(payloads);
	}));
}

export function deactivate() {}
