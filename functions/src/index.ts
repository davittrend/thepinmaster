import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const PINTEREST_API_URL = 'https://api-sandbox.pinterest.com/v5';

export const publishScheduledPins = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();

    const scheduledPinsSnapshot = await db
      .collectionGroup('scheduled_pins')
      .where('scheduledTime', '<=', now)
      .where('status', '==', 'scheduled')
      .get();

    const batch = db.batch();
    let publishedCount = 0;

    for (const doc of scheduledPinsSnapshot.docs) {
      const pin = doc.data();
      const userDoc = await db.collection('users').doc(pin.userId).get();
      const userData = userDoc.data();

      if (userData && userData.pinterestAccounts && userData.pinterestAccounts[pin.accountId]) {
        const account = userData.pinterestAccounts[pin.accountId];
        try {
          await createPin(account.accessToken, pin);
          batch.update(doc.ref, { status: 'published', publishedAt: now });
          publishedCount++;
        } catch (error) {
          console.error(`Failed to publish pin ${doc.id}:`, error);
          if (error.message.includes('token')) {
            // Handle token refresh here
            // For now, we'll just mark it as failed
            batch.update(doc.ref, { status: 'failed', error: error.message });
          }
        }
      }
    }

    await batch.commit();

    console.log(`Published ${publishedCount} pins.`);
  });

async function createPin(accessToken: string, pin: any) {
  const response = await fetch(`${PINTEREST_API_URL}/pins`, {
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

