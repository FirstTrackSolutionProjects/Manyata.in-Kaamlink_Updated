import { useEffect, useRef, useState } from "react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const mountRef = useRef(null);
  const callbackRef = useRef(onCredential);
  const [scriptReady, setScriptReady] = useState(Boolean(window.google?.accounts?.id));

  useEffect(() => { callbackRef.current = onCredential; }, [onCredential]);

  useEffect(() => {
    if (!clientId) return undefined;
    if (window.google?.accounts?.id) return undefined;
    let script = document.querySelector('script[data-google-identity="true"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      document.head.appendChild(script);
    }
    const ready = () => setScriptReady(true);
    script.addEventListener("load", ready);
    return () => script.removeEventListener("load", ready);
  }, []);

  useEffect(() => {
    if (!clientId || !scriptReady || !mountRef.current || !window.google?.accounts?.id) return;
    const googleIdentity = window.google.accounts.id;
    googleIdentity.initialize({
      client_id: clientId,
      callback: (response) => callbackRef.current(response.credential),
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    mountRef.current.replaceChildren();
    googleIdentity.renderButton(mountRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: Math.min(mountRef.current.clientWidth || 420, 420),
      logo_alignment: "left",
    });
  }, [scriptReady]);

  if (!clientId) return <p className="text-center text-xs text-slate-500">Google sign-in setup is required to enable this option.</p>;
  return <div ref={mountRef} aria-busy={disabled} className={disabled ? "pointer-events-none opacity-60" : "flex justify-center"} />;
}
