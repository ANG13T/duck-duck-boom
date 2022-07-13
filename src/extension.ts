import {commands, ExtensionContext, window} from 'vscode';
import { TreeDataProvider } from './components/treeDataProvider';
import { PayloadController } from './controllers/payloadController';
import { QuickPickController } from './controllers/quickPickController';

export async function activate(context: ExtensionContext) {
	let quickPickController = new QuickPickController(context);
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

	// TODO: work in progress
	// if (payloads['credentials'].length == 0) {
	// 	payloadController.getPayloadsForCategories().then((result) => {
	// 		if(result) {
	// 			payloads = result;
	// 			console.log("payloads now", payloads, payloads['credentials']);
	// 			if(payloads['credentials'] && payloads['credentials'].length > 0) {
	// 				window.registerTreeDataProvider('payloadView', new TreeDataProvider(payloads));
	// 			}
	// 		}
	// 	}).then(undefined, err => {
	// 		console.error('I am error', err);
	// 	 })
	// }

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.quickInput', async () => {
		quickPickController.showQuickPick();
	}));

	context.subscriptions.push(commands.registerCommand('duck-duck-boom.showPayload', async (payloadMetadata: any) => {	
		await payloadController.choosePayload(payloadMetadata);
	}));
}

export function deactivate() {}
