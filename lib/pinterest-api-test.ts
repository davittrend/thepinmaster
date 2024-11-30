import dotenv from 'dotenv';
import { getPinterestAuthUrl, exchangeCodeForToken, fetchPinterestBoards, createPin } from './pinterest';

dotenv.config(); // Load environment variables from .env file

async function testPinterestAPI() {
  try {
    // Step 1: Get the Pinterest Auth URL
    const authUrl = await getPinterestAuthUrl();
    console.log('Pinterest Auth URL:', authUrl);
    console.log('Please visit this URL and authorize the app. Then copy the code from the redirect URL.');

    // Simulating user input for the authorization code
    const mockAuthCode = 'mock_auth_code';
    console.log('Using mock authorization code:', mockAuthCode);

    // Step 2: Exchange the code for a token
    const tokenData = await exchangeCodeForToken(mockAuthCode);
    console.log('Token Data:', tokenData);

    // Step 3: Fetch Pinterest Boards
    const boards = await fetchPinterestBoards(tokenData.access_token);
    console.log('Fetched Boards:', boards);

    // Step 4: Create a Pin
    if (boards.items && boards.items.length > 0) {
      const mockPin = {
        title: 'Test Pin from Sandbox API',
        description: 'This is a test pin created using the Pinterest Sandbox API',
        link: 'https://example.com',
        imageUrl: 'https://example.com/image.jpg',
      };

      const createdPin = await createPin(tokenData.access_token, boards.items[0].id, mockPin);
      console.log('Created Pin:', createdPin);
    } else {
      console.log('No boards found to create a pin.');
    }

  } catch (error) {
    console.error('Error during API test:', error);
  }
}

testPinterestAPI();

