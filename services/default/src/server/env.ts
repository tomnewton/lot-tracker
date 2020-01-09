export function setupENV() {
  if (
    process.env.GOOGLE_CLOUD_PROJECT == 'indigo-griffin-254218' &&
    process.env.NODE_ENV == 'production'
  ) {
    process.env.REDIRECT_URI = 'https://indigo-griffin-254218.appspot.com';
    process.env.COOKIE_DOMAIN = 'indigo-griffin-254218.appspot.com';
  } else {
    process.env.REDIRECT_URI = 'http://localhost:8080';
    process.env.COOKIE_DOMAIN = 'localhost';
    process.env.GOOGLE_CLOUD_PROJECT = 'theta-window-254420';
  }

  if (process.env.NODE_ENV == 'test') {
    process.env.DATASTORE_DATASET = 'test';
    process.env.DATASTORE_EMULATOR_HOST = 'localhost:8081';
    process.env.DATASTORE_EMULATOR_HOST_PATH = 'localhost:8081/datastore';
    process.env.DATASTORE_RESET_URL = 'http://localhost:8081/reset';
    process.env.DATASTORE_HOST = 'http://localhost:8081';
    process.env.DATASTORE_PROJECT_ID = 'test';
  }

  process.env.OAUTH_REDIRECT = process.env.REDIRECT_URI + '/authcode';
  process.env.GOOGLE_CLIENT_ID =
    '650681620406-t65g3fb241sqq6tggf0dlqqmkbj6o9eg.apps.googleusercontent.com';
  process.env.LOCATION = 'us-central1';
  process.env.DEFAULT_QUEUE = 'default';
  process.env.NIXIT_DOMAIN = 'letsnixit.com';
}
