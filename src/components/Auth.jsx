import { useState } from "react";
import { auth } from "../firebase/config";
import { sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");

  const sendLoginLink = async () => {
    const actionCodeSettings = {
      url: "http://localhost:5173/", // Ganti sesuai domain deploy kamu
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email); // simpan sementara
      alert("Login link dikirim! Cek email kamu.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-sm mx-auto mt-10 p-4 border rounded">
      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={sendLoginLink}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Kirim Link Login
      </button>
    </div>
  );
}
