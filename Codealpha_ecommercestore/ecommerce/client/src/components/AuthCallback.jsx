import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const location = useLocation();

  useEffect(() => {
    // Parse the query parameters from the Google OAuth response
    const queryParams = new URLSearchParams(location.search);
    const credential = queryParams.get('credential');
    const clientId = queryParams.get('clientId');

    if (credential) {
      console.log("OAuth Callback Success:");
      console.log("Credential:", credential);
      console.log("Client ID:", clientId);

      // Proceed with handling the credential (e.g., verifying it or sending to your backend)
    } else {
      console.error("No credential received.");
    }
  }, [location]);

  return (
    <div>
      <h2>Processing Authentication...</h2>
    </div>
  );
};

export default AuthCallback;
