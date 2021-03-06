// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {setDirectory} from './setDirectory';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "betterquickopen" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello vscode');
        const quickpick = vscode.window.createQuickPick();
        let path = vscode.Uri.file('Users/zach/');
        if (vscode.workspace.workspaceFolders) {
            path = vscode.workspace.workspaceFolders[0].uri;
            console.log(vscode.workspace.workspaceFolders);
        }
        const dir = await vscode.workspace.fs.readDirectory(path);
        dir.forEach(file => {
            quickpick.items = quickpick.items.concat(
                {
                    label: file[0],
                    alwaysShow: true
                 }
            );
        });
        quickpick.show();
        quickpick.value = `${path.path}/`;
        let charCount = quickpick.value.length;
        let backspace = false;

        quickpick.onDidChangeValue(search => {

            // detect whether character was deleted
            if (charCount > search.length) {
               backspace = true;
               charCount--;
            } else {
                charCount++;
            }

            // automatically go to home directory if user enters ~
            if (search[search.length - 1] === '~') {
                console.log('~');
                // quickpick.value = '~/';
                setDirectory('~/', quickpick);
            }

            //TODO: Go back an entire directory if backspace is pressed on a slash
            // if (search[search.length - 1] === '/' && backspace) {
            //    let folders = search.slice(0, -1).split('/');
            //    folders.pop();
            //    let newpath = folders.join('/') + '/';
            //    setDirectory(newpath, quickpick);
            // }
            backspace = false;
        });
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
