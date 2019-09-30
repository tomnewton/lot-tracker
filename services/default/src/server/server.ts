import {app} from './app';

const PORT = process.env.PORT || 8080;

if (
  process.env.GOOGLE_CLOUD_PROJECT == 'indigo-griffin-254218' &&
  process.env.NODE_ENV == 'production'
) {
  process.env.OAUTH_REDIRECT =
    'https://indigo-griffin-254218.appspot.com/authcode';
} else {
  process.env.OAUTH_REDIRECT = 'http://localhost:8080/authcode';
}

process.env.GOOGLE_CLIENT_ID =
  '650681620406-t65g3fb241sqq6tggf0dlqqmkbj6o9eg.apps.googleusercontent.com';
process.env.LOCATION = 'us-central1';
process.env.DEFAULT_QUEUE = 'default';

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
