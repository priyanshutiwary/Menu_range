export async function checkSubdomain(subdomain: string) {
    console.log("Checking subdomain:", subdomain);
  
    try {
      const response = await fetch(`/api/subdomainCheck?subdomain=${subdomain}`, {
        method: 'GET',
      });
      
      const result = await response.json();
      console.log("API response:", result);
  
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch subdomain');
      }
      
      return result.data; // Return the data instead of response
    } catch (error) {
      console.error("Subdomain check failed:", error);
      throw error;
    }
  }