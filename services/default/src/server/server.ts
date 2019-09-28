import {app} from './app';

const PORT = process.env.PORT || 8080;

if (
  process.env.GOOGLE_CLOUD_PROJECT == 'indigo-griffin-254218' &&
  process.env.NODE_ENV == 'production'
) {
}

process.env.LOCATION = 'us-central1';
process.env.DEFAULT_QUEUE = 'default';

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
