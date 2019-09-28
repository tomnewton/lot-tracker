import CloudTasksClient from '@google-cloud/tasks';

export async function enqueueJob(
  queue: string,
  payload: string,
  client: CloudTasksClient,
) {
  const parent = client.queuePath(
    process.env.GOOGLE_CLOUD_PROJECT,
    process.env.LOCATION,
    queue,
  );
  console.log(`queuePath: ${parent}`);
  const task = {
    appEngineHttpRequest: {
      httpMethod: 'POST',
      relativeUri: '/job/process',
      body: Buffer.from(payload).toString('base64'),
    },
  };
  const request = {
    parent: parent,
    task: task,
  };
  const [response] = await client.createTask(request);
  const name = response.name;
  console.log(`Created task ${name}`);
}
