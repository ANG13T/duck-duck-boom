import * as vscode from 'vscode';

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  onDidChangeTreeData?: vscode.Event<TreeItem | null | undefined> | undefined;

  data: TreeItem[];

  constructor(payloads: any) {
    let payloadArray = [];
    for (var category in payloads) {
      let valueProp: any = category;
      console.log("valueProp is", category);
      if (Object.prototype.hasOwnProperty.call(payloads, category)) {
        for (var values in valueProp) {
          payloadArray.push(new TreeItem(category, payloads[category]))
        }
      }
    }
    console.log("payload arary", payloadArray)
    this.data = [new TreeItem('Payloads', payloadArray)];
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;

  constructor(label: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);
    this.children = children;
  }
}