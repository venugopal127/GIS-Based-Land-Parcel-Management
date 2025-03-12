import React, { useState, useEffect } from "react";
import * as sapi from "../../api/ServerAPI";

const Login = () => {
    const [file, setFile] = useState(null);
    const [sendRequest, setSendRequest] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        window.document.title = "Knuct Wallet - Login";
        return () => {
            window.document.title = "Knuct Wallet";
        };
    }, []);

    useEffect(() => {
        if (!sendRequest || !file) return;

        setLoading(true);
        setError("");
        setSuccess("");

        // Convert Image File to Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64Image = reader.result.split(",")[1]; // Remove header
            requestChallenge(base64Image);
        };
        reader.onerror = () => {
            setError("Failed to read file. Please try again.");
            setLoading(false);
        };
    }, [sendRequest]);

    const requestChallenge = (imageBase64) => {
      console.log("🔹 Sending Private Share to Challenge API...");
  
      sapi.authChallenge(imageBase64)
          .then((response) => {
              console.log("✅ Challenge Response:", response.data);
  
              if (!response.data || !response.data.data || !response.data.data.challenge) {
                  console.error("❌ Invalid server response:", response);
                  setError("Invalid server response.");
                  setLoading(false);
                  return;
              }
              sendResponse(response.data.data.challenge);
          })
          .catch((error) => {
              console.error("❌ authChallenge failed:", error);
              setError("Authentication failed. Try again.");
              setLoading(false);
          });
  };
  
  const sendResponse = (challenge) => {
      console.log("🔹 Sending Challenge Response to API...");
  
      sapi.authResponse({ challenge })
          .then((response) => {
              console.log("✅ Challenge Authenticated:", response.data);
              startNode();
          })
          .catch((error) => {
              console.error("❌ authResponse failed:", error);
              setError("Challenge response failed. Try again.");
              setLoading(false);
          });
  };
  

    const startNode = () => {
        sapi.startNode()
            .then(() => fetchWalletData())
            .catch(() => {
                setError("Error starting wallet node.");
                setLoading(false);
            });
    };

    const fetchWalletData = () => {
        sapi.walletData()
            .then((response) => {
                if (!response.data || !response.data.data || !response.data.data.did) {
                    setError("Invalid wallet data received.");
                    setLoading(false);
                    return;
                }
                setSuccess("Login Successful! Redirecting...");
                setLoading(false);
                setTimeout(() => {
                    window.location.href = "/dashboard"; // Redirect after login
                }, 2000);
            })
            .catch(() => {
                setError("Error fetching wallet data.");
                setLoading(false);
            });
    };

    return (
        <div className="login-container">
            <h2>Login with Private Share</h2>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
            <button onClick={() => setSendRequest(true)} disabled={loading || !file}>
                {loading ? "Processing..." : "Login"}
            </button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default Login;
