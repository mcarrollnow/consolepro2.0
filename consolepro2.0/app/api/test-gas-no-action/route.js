export async function GET() {
    try {
      console.log('Testing Google Apps Script without action parameter...');
      
      // Test without any action parameter
      const gasUrl = 'https://script.google.com/macros/s/AKfycbzDAmRGhtgGj3e5z6E1tKdC67G4QCbvBxtdVECEGP3waQJFmYYGtq6KppuKj1WkAWFa/exec';
      
      console.log('Calling:', gasUrl);
      
      const response = await fetch(gasUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Vercel-App/1.0)',
          'Accept': 'application/json'
        }
      });
      
      const responseText = await response.text();
      console.log('Response:', responseText);
      
      try {
        const jsonResult = JSON.parse(responseText);
        return Response.json({
          success: true,
          result: jsonResult
        });
      } catch {
        return Response.json({
          success: false,
          error: 'Got HTML instead of JSON',
          response: responseText.substring(0, 200)
        });
      }
      
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }