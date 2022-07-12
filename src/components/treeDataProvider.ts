import * as vscode from 'vscode';

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  onDidChangeTreeData?: vscode.Event<TreeItem | null | undefined> | undefined;

  data: TreeItem[];

  constructor(payloads: any) {
    let payloadArray: TreeItem[] | undefined = [];
    const categories = ['credentials', 'execution', 'exfiltration', 'general', 'incident_response', 'mobile', 'phishing', 'prank', 'recon', 'remote_access'];
    for(let category of categories) {
      payloadArray.push(new TreeItem(category, this.getPayloadsOfCategory(category, payloads)))
    }
    this.data = [new TreeItem('Payloads', payloadArray)];
  }

  getPayloadsOfCategory(category: string, payloads: any){
    let finalArray = [];
    let selectedPayloads = payloads[category];
    for(let payload of selectedPayloads) {
      finalArray.push(new TreeItem(payload.name, undefined, payload))
    }
    return finalArray;
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
  metadata: any | undefined;
  command: vscode.Command | undefined;

  constructor(label: string, children?: TreeItem[], metadata?: any) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);
    this.children = children;
    this.metadata = metadata;
    this.command = {
      "title": "Show Payload",
      "command": "duck-duck-boom.showPayload",
      "arguments": [this.metadata]
    }
  }
}