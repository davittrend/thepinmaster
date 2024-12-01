export const config = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  pinterest: {
    clientId: process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID,
    clientSecret: process.env.PINTEREST_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI,
  },
};

// Validate environment variables
Object.entries(config.firebase).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Firebase config is missing ${key}`);
  }
});

Object.entries(config.pinterest).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Pinterest config is missing ${key}`);
  }
});

