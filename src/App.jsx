import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import PaginationPage from "./pages/PaginationPage";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import { useGoogleLogin } from "@react-oauth/google";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dark Mode State
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Modal states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // ✅ Single user state (object)
  const [user, setUser] = useState(null);

  const [page, setPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(false);

  const params = new URLSearchParams(location.search);
  const currentSlNo = parseInt(params.get("sl_no")) || 1;

  const [reg, setReg] = useState({ userName: "", password: "", confirmPassword: "" });
  const [login, setLogin] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (newSlNo) => {
    params.set("sl_no", newSlNo);
    params.set("page", 1);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // ✅ Fetch user once (from cookie)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("https://task1authbackend.onrender.com/api/v1/auth/fetchUserData", {
          withCredentials: true,
        });
        console.log("User data fetched successfully:", res.data);
        setUser(res.data); // ✅ full user object
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, []);

const responseGoogle = async (authResult) => {
  try {
    if (authResult["code"]) {
      const res = await axios.get(
        `https://task1authbackend.onrender.com/api/v1/auth/google?code=${authResult.code}`,
        { withCredentials: true }
      );

      console.log("Google login successful:", res.data);

      // ✅ Save user and close login modal
      setUser(res.data.user); 
      setIsLoginOpen(false);
      navigate(0);
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


    const handleLogin = async () => {
      try {
        setLoading(true);
        const res = await axios.post("https://task1authbackend.onrender.com/api/v1/auth/login", login, {
          withCredentials: true,
        });
        setUser(res.data); // ✅ set full user object
        setIsLoginOpen(false);
      } catch (error) {
        console.log("error logging in user", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    const handleRegister = async () => {
      try {
        setLoading(true);
        const res = await axios.post("https://task1authbackend.onrender.com/api/v1/auth/register", reg);
        console.log("User registered successfully", res.data);
        setTimeout(() => {
        }, 5000);
        setLoading(false);
        setIsRegister(false);
        navigate(0)
      } catch (error) {
        console.log("error registering user", error);
        setLoading(false);
      }
    };

    const handleLogout = async () => {
      setUser(null);
      await axios.get("https://task1authbackend.onrender.com/api/v1/auth/logout", { withCredentials: true });
      navigate("/");
      setLogin({ userName: "", password: "" });
      console.log("User logged out");
    };

    // Loading animation
    const [dotSizes, setDotSizes] = useState([8, 8, 8, 8]);
    useEffect(() => {
      let direction = [true, true, true, true];
      const interval = setInterval(() => {
        setDotSizes((prev) =>
          prev.map((size, idx) => {
            let newSize = direction[idx] ? size + 1 : size - 1;
            if (newSize >= 20) direction[idx] = false;
            if (newSize <= 8) direction[idx] = true;
            return newSize;
          })
        );
      }, 80);
      return () => clearInterval(interval);
    }, []);

    const arr = [
      "Learn the basics",
      "Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]",
      "Recursion [PatternWise]",
      "Bit Manipulation [Concepts & Problems]",
      "Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implemen…",
      "Sliding Window & Two Pointer Combined Problems",
      "Heaps [Learning, Medium, Hard Problems]",
      "Greedy Algorithms [Easy, Medium/Hard]",
      "Binary Trees [Traversals, Medium and Hard Problems]",
      "Binary Search Trees [Concept and Problems]",
      "Graphs [Concepts & Problems]",
      "Dynamic Programming [Patterns and Problems]",
      "Tries",
      "Strings",
    ];

    return (
      <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} min-h-screen flex flex-col`}>
        {/* Navbar */}
        <nav className={`${theme === "dark" ? "bg-black text-neon-cyan" : "bg-gray-200 text-black"} p-4 flex flex-col md:flex-row justify-between items-center gap-4`}>
          <div className="gap-3 flex items-center">
            {user ? (
              <>
                {user?.user?.pic &&<img src={user?.user?.pic} alt="Profile" className="w-10 h-10 rounded-full" />}
                <p className="text-lg font-bold ">{user?.user?.userName || user?.user?.gmail}</p>
                <button
                  onClick={handleLogout}
                  className={`px-3 py-2 bg-neon-blue text-black rounded hover:bg-neon-blue/80 ${page !== 1 ? "hidden" : ""}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsRegister(false);
                }}
                className={`px-3 py-2 bg-neon-blue text-black rounded hover:bg-neon-blue/80 ${page !== 1 ? "hidden" : ""}`}
              >
                Login
              </button>
            )}
            <button
              onClick={() => {
                navigate("/");
                setPage(1);
              }}
              className={`px-3 py-2 bg-neon-blue text-red rounded hover: ${page === 1 ? "hidden" : "s"}`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setPage(3);
                navigate("/");
              }}
              className={`px-3 py-2 bg-neon-blue text-black rounded hover:bg-neon-blue/80 ${page === 3 ? "hidden" : ""}`}
            >
              Search
            </button>
          </div>

          {/* Right side */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {user && (
              <button
                onClick={() => setPage(2)}
                className={`px-3 py-2 bg-neon-blue rounded hover:bg-neon-blue/80 ${page === 2 ? "hidden" : ""} ${theme === "dark" ? "text-white" : "text-black"
                  }`}
              >
                Dashboard
              </button>
            )}
            <div className="relative">
              {page === 1 && (
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className={`px-3 py-2 rounded ${theme === "dark" ? "bg-black" : "bg-white"} text-neon-cyan border border-neon-blue w-40 text-left`}
                >
                  {arr[currentSlNo - 1]}
                </button>
              )}
              {openDropdown && (
                <ul
                  className="absolute mt-2 w-40 
                 bg-white dark:bg-black 
                 border border-neon-blue 
                 rounded max-h-[30vh] overflow-y-auto z-50"
                >
                  {Array.from({ length: 15 }, (_, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        handleCategoryChange(i + 1);
                        setOpenDropdown(false);
                      }}
                      className={`px-3 py-2 cursor-pointer 
                    text-black dark:text-white
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    ${currentSlNo === i + 1 ? "bg-neon-blue text-red" : ""}`}
                    >
                      {arr[i]}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded bg-yellow-400 text-black hover:bg-yellow-300"
            >
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1">
          {page === 1 && <PaginationPage user={user} theme={theme} />}
          {page === 2 && <Dashboard user={user} theme={theme} />}
          {page === 3 && <Search theme={theme} />}
        </main>

        {/* Login/Register Modal */}
        {isLoginOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg w-11/12 max-w-md relative">
              <h2 className="text-xl font-bold mb-4 text-center">{isRegister ? "Register" : "Login"}</h2>

              {!isRegister ? (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-3 rounded bg-black border border-gray-600 text-white"
                    onChange={(e) => setLogin({ ...login, userName: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-3 rounded bg-black border border-gray-600 text-white"
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                  />
                  <button
                    className="w-full bg-neon-blue text-black py-2 rounded mb-3 hover:bg-neon-blue/80"
                    onClick={handleLogin}
                  >
                    Sign In
                  </button>
                  <button
                    className="w-full bg-red-500 py-2 rounded mb-3 hover:bg-red-600"
                    onClick={() => loginWithGoogle()}
                  >
                    Login with Google
                  </button>
                  <p
                    className="text-sm text-center text-neon-cyan cursor-pointer hover:underline"
                    onClick={() => setIsRegister(true)}
                  >
                    Don’t have an account? Register
                  </p>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-3 rounded bg-black border border-gray-600 text-white"
                    value={reg.userName}
                    onChange={(e) => setReg({ ...reg, userName: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-3 rounded bg-black border border-gray-600 text-white"
                    value={reg.password}
                    onChange={(e) => setReg({ ...reg, password: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-2 mb-3 rounded bg-black border border-gray-600 text-white"
                    value={reg.confirmPassword}
                    onChange={(e) => setReg({ ...reg, confirmPassword: e.target.value })}
                  />
                  <button
                    onClick={handleRegister}
                    className="w-full bg-neon-blue text-black py-2 rounded mb-3 hover:bg-neon-blue/80"
                  >
                    Register
                  </button>
                  <p
                    className="text-sm text-center text-neon-cyan cursor-pointer hover:underline"
                    onClick={() => setIsRegister(false)}
                  >
                    Already have an account? Login
                  </p>
                </>
              )}

              {/* Close */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={() => setIsLoginOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div
            className={`fixed top-0 left-0 w-full h-full flex justify-center items-center ${theme === "dark" ? "bg-black/80" : "bg-white/80"
              } z-[9999]`}
          >
            <div className="flex gap-4">
              {dotSizes.map((size, idx) => (
                <div
                  key={idx}
                  style={{ width: size, height: size }}
                  className={`rounded-full ${idx % 2 ? "bg-green-500" : idx % 3 ? "bg-blue-500" : "bg-red-500"}`}
                ></div>
              ))}
            </div>
            <p className="text-gray-500">Loading might take a while...</p>
          </div>
        )}
      </div>
    );
  }
