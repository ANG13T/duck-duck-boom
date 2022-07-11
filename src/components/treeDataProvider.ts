import * as vscode from 'vscode';

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;
  
    data: TreeItem[];
  
    constructor(payloads: any) {
      for (var prop in payloads) {
        let valueProp : any = prop;
        console.log("valueProp is", prop);
        // let payloadArray = [];
        // if (Object.prototype.hasOwnProperty.call(payloads, prop)) {
        //     for (var values in valueProp) {
        //       payloadArray.push(new TreeItem(prop))
        //     }
        // }
    }
      this.data = [new TreeItem('Payloads', [
        new TreeItem(
            'Ford', [new TreeItem('Fiesta'), new TreeItem('Focus'), new TreeItem('Mustang')]),
        new TreeItem(
            'BMW', [new TreeItem('320'), new TreeItem('X3'), new TreeItem('X5')])
      ])];
    }
  
    getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
      return element;
    }
  
    getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
      if (element === undefined) {
        return this.data;
      }
      return element.children;
    }
  }
  
  class TreeItem extends vscode.TreeItem {
    children: TreeItem[]|undefined;
  
    constructor(label: string, children?: TreeItem[]) {
      super(
          label,
          children === undefined ? vscode.TreeItemCollapsibleState.None :
                                   vscode.TreeItemCollapsibleState.Expanded);
      this.children = children;
    }
  }