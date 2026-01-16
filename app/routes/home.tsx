import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";

// 1. Feature detection: Check if the browser supports the new JSON convenience methods
const jsonWebAuthnSupport = typeof globalThis !== "undefined" && !!globalThis.PublicKeyCredential?.parseCreationOptionsFromJSON;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

  // 2. Handle Registration
  async function handleRegister() {
    if (!jsonWebAuthnSupport) {
      alert("WebAuthn JSON methods are not supported in this browser.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register/options', {
        method: 'POST'
      });
      const optionsFromBackend = await response.json();

      console.log("Starting Registration...");

      const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(optionsFromBackend);

      const credential = (await navigator.credentials.create({
        publicKey,
      })) as PublicKeyCredential;

      const responsePayload = credential.toJSON();

      console.log("Registration Successful, sending to backend:", responsePayload);
      // TODO: Send responsePayload back to your server for verification
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
      const response = await fetch('http://localhost:5000/login/options', {
        method: 'POST'
      });
      const optionsFromBackend = await response.json();

      console.log("Starting Authentication...");

      const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(optionsFromBackend);

      const credential = (await navigator.credentials.get({
        publicKey,
      })) as PublicKeyCredential;

      const responsePayload = credential.toJSON();

      console.log("Authentication Successful, sending to backend:", responsePayload);
      // TODO: Send responsePayload back to your server for verification
    } catch (error) {
      console.error("Authentication failed or cancelled:", error);
    }
  }

  return (
    <div className="flex flex-col gap-4 items-start p-4">
      <p>Welcome to Passwordless Login</p>

      {/* 4. Attach handlers to buttons */}
      <div className="flex gap-2">
        <Button onClick={handleRegister}>
          Register Passkey
        </Button>

        <Button onClick={handleLogin} variant="secondary">
          Login with Passkey
        </Button>
      </div>
    </div>
  );
}