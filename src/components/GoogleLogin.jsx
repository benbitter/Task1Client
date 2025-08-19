// GoogleLogin.jsx
import React from 'react'
import { useGoogleLogin } from "@react-oauth/google"
import axios from 'axios'

// const responseGoogle = async (authResult) => {
//     try {
//       setloading(true);
//       if (authResult["code"]) {
//         const res = await axios.get(
//           `http://localhost:3001/api/v1/auth/google?code=${authResult.code}`,
//           { withCredentials: true }
//         );

//         console.log("Google login successful:", res.data.user);
//         // Suppose backend sends { email, name, token, image }
//         // const { email, name } = res.data.user;
        
//         setUser(res.data?.user?.gmail);
//         setX(res.data.user);
//         setPic(res.data.user.pic);
//         setloading(false);
//         setIsLoginOpen(false);
//       } else {
//         setloading(false);
//         throw new Error("Google login failed");
//       }
//     } catch (e) {
//       console.log("Error while Google Login...", e);
//     }
//   };

//   useEffect(() => {
//   console.log("x updated:", x.pic);
// }, [x]);


//   const loginWithGoogle = useGoogleLogin({
//     onSuccess: responseGoogle,
//     onError: responseGoogle,
//     flow: "auth-code",
//   });

const GoogleLogin = ({ onLoginSuccess }) => {
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const res = await axios.get(
          `http://localhost:3001/api/v1/auth/google?code=${authResult.code}`,
          { withCredentials: true }
        );

        // Suppose backend sends { email, name, token, image }
        const { email, name } = res.data.user;

        // Save in localStorage (optional)
        localStorage.setItem("user-info", JSON.stringify(res.data.user));

        // Call parent to update state and close modal
        onLoginSuccess(email);

      } else {
        throw new Error("Google login failed");
      }
    } catch (e) {
      console.log("Error while Google Login...", e);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      className="w-full bg-red-500 py-2 rounded mb-3 hover:bg-red-600"
      onClick={() => loginWithGoogle()}
    >
      Login with Google
    </button>
  )
}

export default GoogleLogin
