import { signIn } from "next-auth/react";
import { useState } from "react";
import { BiLoader } from "react-icons/bi";
import { GrGoogle } from "react-icons/gr";

const GoogleAuthButton = ({ callbackUrl }) => {
  const [state, setState] = useState({ loading: false });
  const handleGoogleSignIn = async () => {
    setState({ loading: true });
    await signIn("google", { callbackUrl: callbackUrl || "http://localhost:3000", redirect: false });
    setState({ loading: false });
  };
  return (
    <button
      type="button"
      className="w-full block bg-black border-2 hover:bg-white focus:text-black focus:bg-white text-white hover:text-black font-semibold rounded-lg px-4 py-3 border-white transition duration-300"
      onClick={handleGoogleSignIn}
    >
      <div className="flex items-center justify-center">
        {state.loading ? <BiLoader className="animate-spin h-5 w-5" /> : <GrGoogle className="h-4 w-4" />}
        <span className="ml-4 ">Log in with Google</span>
      </div>
    </button>
  );
};

export default GoogleAuthButton;
