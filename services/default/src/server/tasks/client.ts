const tasks = require('@google-cloud/tasks');
//import CloudTasksClient from '@google-cloud/tasks';

export const client = new tasks.CloudTasksClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
});
