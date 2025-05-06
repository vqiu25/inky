import { useEffect } from "react";

interface GoogleSignInButtonProps {
  onSignInSuccess: (response: never) => void; // Function to handle successful sign-in
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

const GoogleSignInButton = ({ onSignInSuccess }: GoogleSignInButtonProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: onSignInSuccess,
          ux_mode: "popup",
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "signin_with",
            logo_alignment: "center",
            width: 250,
          },
        );
      }
    };
    document.body.appendChild(script);

    // Cleanup when component is unmounted
    return () => {
      const element = document.getElementById("google-signin-button");
      if (element) {
        element.innerHTML = "";
      }
    };
  }, [onSignInSuccess]);

  return <div id="google-signin-button"></div>;
};

export default GoogleSignInButton;
