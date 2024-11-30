import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();

const db = admin.firestore();

export const publishScheduledPins = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();

    const scheduledPinsSnapshot = await db
      .collectionGroup('scheduled_pins')
      .where('scheduledTime', '<=', now)
      .get();

    const batch = db.batch();

    for (const doc of scheduledPinsSnapshot.docs) {
      const pin = doc.data();
      const userDoc = await db.collection('users').doc(pin.userId).get();
      const user = userDoc.data();

      if (user && user.pinterestAccessToken) {
        try {
          await createPin(user.pinterestAccessToken, pin);
          batch.delete(doc.ref);
        } catch (error) {
          console.error(`Failed to publish pin ${doc.id}:`, error);
          // If the error is due to an expired token, you might want to handle token refresh here
        }
      }
    }

    await batch.commit();

    console.log(`Processed ${scheduledPinsSnapshot.size} scheduled pins.`);
  });

async function createPin(accessToken: string, pin: any) {
  const response = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board_id: pin.boardId,
      title: pin.title,
      description: pin.description,
      link: pin.link,
      media_source: {
        source_type: 'image_url',
        url: pin.imageUrl,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create pin: ${response.statusText}`);
  }

  return response.json();
}

