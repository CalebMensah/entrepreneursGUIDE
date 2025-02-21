
export async function handler(event) {
    try {
        const scriptUrl = "https://script.google.com/macros/s/AKfycbxMxyDGHx5R8ySZ5XkSK6OoZo_qLk_UUpHFumpaPgzSzgJjRce90RFZpPW4FZXdEtQ3/exec";
    const {email} = JSON.parse(event.body);
  
    // Forward the request to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  
    return {
      statusCode: 200,
      body:JSON.stringify({success: true}),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
    } catch(error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Failed to process request."})
        }
    }
  }