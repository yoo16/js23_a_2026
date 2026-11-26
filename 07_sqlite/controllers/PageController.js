import path from 'node:path';

const viewDir = path.resolve('views');
export const page = (name) => (req, res) => res.sendFile(path.join(viewDir, `${name}.html`));
