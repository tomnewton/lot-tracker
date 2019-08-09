const tasks = require('@google-cloud/tasks');

const client = new tasks.CloudTasksClient({});

export async function enqueueJob(queue: string, payload: string) {
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
