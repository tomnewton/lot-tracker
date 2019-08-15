import CloudTasksClient from '@google-cloud/tasks';

export async function enqueueJob(
  queue: string,
  payload: string,
  client: CloudTasksClient,
) {
  const parent = client.queuePath(
    process.env.PROJECT,
    process.env.LOCATION,
    queue,
  );
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
