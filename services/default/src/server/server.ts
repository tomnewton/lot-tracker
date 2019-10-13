import {startApp} from './app';
import {config} from 'dotenv';
config();

const PORT = process.env.PORT || 8080;

async function start() {
  const app = await startApp();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
    console.log(`NODE_ENV == ${process.env.NODE_ENV}`);
  });
}

start();
