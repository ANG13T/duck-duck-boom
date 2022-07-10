const path = require('path');

export class CopyLinkController {
    constructor() {
        
    }

    public async copyPayloadLink(payloads: any) {
        const parentDir = path.basename(path.dirname(__filename));
    }
}