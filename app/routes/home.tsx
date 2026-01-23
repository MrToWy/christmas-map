import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { useState } from "react";

// 1. Feature detection: Check if the browser supports the new JSON convenience methods
const jsonWebAuthnSupport = typeof globalThis !== "undefined" && !!globalThis.PublicKeyCredential?.parseCreationOptionsFromJSON;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [username, setUsername] = useState("testuser");

  // 2. Handle Registration
  async function handleRegister() {
    if (!jsonWebAuthnSupport) {
      alert("WebAuthn JSON methods are not supported in this browser.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5223/register/options', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username,
            displayName: username
        })
      });
      const optionsFromBackend = await response.json();

      console.log("Starting Registration...");

      const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(optionsFromBackend);

      const credential = (await navigator.credentials.create({
        publicKey,
      })) as PublicKeyCredential;

      const responsePayload = credential.toJSON();

      console.log("Registration Successful, sending to backend:", responsePayload);

      await fetch("http://localhost:5223/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(responsePayload),
      });
    } catch (error) {
      console.error("Registration failed or cancelled:", error);
    }
  }

  // 3. Handle Login (Authentication)
  async function handleLogin() {
    if (!jsonWebAuthnSupport) {
      alert("WebAuthn JSON methods are not supported in this browser.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5223/login/options', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username // Send the username from your state
        })
      });
      const optionsFromBackend = await response.json();

      console.log("Starting Authentication...");

      const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(optionsFromBackend);

      const credential = (await navigator.credentials.get({
        publicKey,
      })) as PublicKeyCredential;

      const responsePayload = credential.toJSON();

      console.log("Authentication Successful, sending to backend:", responsePayload);
      await fetch("http://localhost:5223/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(responsePayload),
      });
    } catch (error) {
      console.error("Authentication failed or cancelled:", error);
    }
  }

  async function handleTest() {
    try {
      const response = await fetch("http://localhost:5223/user/me", {
        method: "GET",
        headers: {
          "Accept": "application/json"
        },
        // IMPORTANT: This allows the browser to send the session cookie
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Logged in as: ${data.username}`);
        console.log("User data:", data);
      } else if (response.status === 401) {
        alert("Not logged in (401 Unauthorized)");
      } else {
        alert(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Test request failed:", error);
      alert("Failed to reach the server.");
    }
  }

  return (
    <div className="flex flex-col gap-4 items-start p-4">
      <p>Welcome to Passwordless Login</p>

      {/* 4. Add an input field for the user */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Username</label>
        <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded text-black"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleRegister}>
          Register Passkey
        </Button>

        <Button onClick={handleLogin} variant="secondary">
          Login with Passkey
        </Button>

        <Button onClick={handleTest} variant="secondary">
          Test logged in status
        </Button>
      </div>
    </div>
  );
}