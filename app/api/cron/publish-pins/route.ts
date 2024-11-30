import { NextResponse } from 'next/server'
import { collection, query, where, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createPin } from '@/lib/pinterest'

export async function GET(request: Request) {
  // Add a simple authorization check
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = serverTimestamp()

  const scheduledPinsSnapshot = await getDocs(
    query(collection(db, 'scheduled_pins'), where('scheduledTime', '<=', now))
  )

  const batch = writeBatch(db)
  let publishedCount = 0

  for (const doc of scheduledPinsSnapshot.docs) {
    const pin = doc.data()
    const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', pin.userId)))
    const userData = userDoc.docs[0]?.data()

    if (userData && userData.pinterestAccessToken) {
      try {
        await createPin(userData.pinterestAccessToken, pin)
        batch.delete(doc.ref)
        publishedCount++
      } catch (error) {
        console.error(`Failed to publish pin ${doc.id}:`, error)
        // If the error is due to an expired token, you might want to handle token refresh here
      }
    }
  }

  await batch.commit()

  return NextResponse.json({ message: `Published ${publishedCount} pins` })
}

