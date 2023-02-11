import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const GoogleAuthButton = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for the redirect from Google
    window.addEventListener("message", (event) => {
      const { accessToken } = event.data;
      console.log({ accessToken });
      handleGoogleRedirect(accessToken);
    });

    // Check if there's already an access token stored in local storage
    const storedAccessToken = localStorage.getItem("googleAccessToken");
    if (storedAccessToken) {
      setLoading(true);
      handleGoogleRedirect(storedAccessToken);
    }
  }, []);

  async function googleLogin() {
    try {
      // Redirect the user to the Google OAuth login page
      window.location.href = "http://localhost:3008/auth/googleLogin";
    } catch (error) {
      console.log("GoogleLogin function - ERROR: ", error);
    }
  }

  async function handleGoogleRedirect(accessToken) {
    try {
      // Store the access token in local storage for future sessions
      localStorage.setItem("googleAccessToken", accessToken);

      // Make an API call to the server to retrieve the user's data using the access token
      setLoading(true);

      // const response = await fetch(`http://localhost:3008/users/${accessToken._id}`, {
      //   method: "GET",
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });

      const response = await axios.get(`http://localhost:3008/users/${accessToken._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await response.json();
      console.log("usersData from fetch - USER: ", userData);

      // set the userData=user & loading=false
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.log("handleGoogleRedirect function - ERROR: ", error);
    }
  }

  return (
    <>
      <Button variant="warning" className="mt-3" onClick={googleLogin}>
        Login with Google
      </Button>
      {/* {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <p>Hello, {user.name}!</p>
      ) : (
        <button onClick={googleLogin}>Login with Google</button>
      )} */}
    </>
  );
};

export default GoogleAuthButton;
