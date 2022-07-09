import {commands, ExtensionContext, window} from 'vscode';
import fetch from 'node-fetch';
import { QuickPickController } from './controllers/quickPickController';
import { showInputBox, showQuickPick } from './components/QuickPick/basicInput';
import { multiStepInput } from './components/QuickPick/multiStepInput';
import { quickOpen } from './components/QuickPick/quickOpen';

export function activate(context: ExtensionContext) {

	let disposable = commands.registerCommand('duck-duck-boom.helloWorld', async() => {
		window.showInformationMessage('Hello World from Duck Duck Boom!');
		let results = await createAPICall();
	});

	let disposable2 = commands.registerCommand('duck-duck-boom.quickInput', async () => {
		// const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
		// 	showQuickPick,
		// 	showInputBox,
		// 	multiStepInput,
		// 	quickOpen,
		// };
		// const quickPick = window.createQuickPick();
		// quickPick.items = Object.keys(options).map(label => ({ label }));
		// quickPick.onDidChangeSelection(selection => {
		// 	if (selection[0]) {
		// 		options[selection[0].label](context)
		// 			.catch(console.error);
		// 	}
		// });
		// quickPick.onDidHide(() => quickPick.dispose());
		// quickPick.show();
		console.log("hello")
	});


	context.subscriptions.push(disposable2);

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