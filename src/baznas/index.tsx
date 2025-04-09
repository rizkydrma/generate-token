/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { authBaznas } from "../firebase";
// import { auth } from "./firebase-pqu";

const BaznasPage = () => {
  const [token, setToken] = useState("");

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const google_sso: { user: any } = await signInWithPopup(authBaznas, provider);

      setToken(google_sso?.user?.accessToken);
    } catch (error: any) {
      console.error(error);
      alert("Gagal");
    }
  };
  return (
    <div style={{ display: "grid", placeItems: "center", width: "100vw", height: "100vh" }}>
      <button onClick={signInWithGoogle}>Sign In With Google For Baznas</button>

      {token && <textarea style={{ display: "block" }} cols={150} rows={20} value={token}></textarea>}
    </div>
  );
};

export default BaznasPage;
