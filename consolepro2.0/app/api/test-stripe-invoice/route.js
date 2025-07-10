export async function GET() {
    try {
      console.log('Testing Stripe invoice creation...');
      
      const gasUrl = 'https://script.google.com/macros/s/AKfycbzDAmRGhtgGj3e5z6E1tKdC67G4QCbvBxtdVECEGP3waQJFmYYGtq6KppuKj1WkAWFa/exec';
      
      const params = new URLSearchParams({
        action: 'createStripeInvoice',
        orderId: '8df61394-28f1-472a-97a0-fe5ced00ddb3',
        stripeKey: process.env.STRIPE_SECRET_KEY || 'test_no_key'
      });
      
      const testUrl = `${gasUrl}?${params}`;
      console.log('Calling:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Vercel-App/1.0)',
          'Accept': 'application/json'
        }
      });
      
      const responseText = await response.text();
      console.log('Response:', responseText.substring(0, 500));
      
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