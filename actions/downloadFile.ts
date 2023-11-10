import { ActionFunction } from '@remix-run/server-runtime';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export let action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const fileUrl = url.searchParams.get('fileUrl');

  if (!fileUrl) {
    return new Response('Missing file URL', { status: 400 });
  }

  try {
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });

    const filePath = path.resolve(__dirname, 'downloads', path.basename(fileUrl));
    fs.writeFileSync(filePath, response.data);

    return new Response('File downloaded successfully', { status: 200 });
  } catch (error) {
    return new Response('Failed to download file', { status: 500 });
  }
};