import { backendurl } from "../../constants";

// 1. login api
export const loginApi = async({email, password})=>{
  const res = await fetch(
    // "http://localhost:3000/auth/login", 
    `${backendurl}/auth/login`, 
    {
      method : 'POST',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({email, password}),
      credentials: "include",
    }
  );

  const data = await res.json();
  if(!data.success) {
    throw new Error(data.message)
  }
  return data; // this will become action.payload
  
}

// 2. signup api
export const signupApi = async ({ name, email, phoneNumber, password, confirmPassword }) => {
  // const res = await fetch("http://localhost:3000/auth/register", {
  const res = await fetch( `${backendurl}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, phoneNumber, password, confirmPassword }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Signup failed");
  }
  return data; // { message: "...Verification email sent..." }
};

// 3. verify-otp api
export const verifyOtpApi = async ({ email, otp }) => {
  const res = await fetch("${backendurl}/auth/register/verify-otp", {
    method: "POST",
    credentials: "include", // important for cookies
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data; // { message, user }
};


// 3. forget-password api
export const forgetPassword = async (email) => {
  const res = await fetch(`${backendurl}/auth/forget-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to resend OTP");
  }

  return data; // { success: true, message: "OTP resent" }
};

// 4. reset-password api
export const resetPasswordApi = async ({ id, token, password, confirmPassword }) => {
  const res = await fetch(`${backendurl}/auth/reset-password/${id}/${token}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, confirmPassword }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Password reset failed");
  }

  return data; // { success: true, message: "Password reset successful" }
};

// 5. resend-otp api
export const resendOtpApi = async (email) => {
  const res = await fetch(`${backendurl}/auth/resend-otp`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to resend OTP");
  }

  return data; // { success: true, message: "OTP resent" }
};


// 6. check user-exists api
export const checkLoginStatusApi = async () => {
  try {
    const res = await fetch(`${backendurl}/auth/status`, {
      credentials: "include",
    });

    if (!res.ok) {
      // Handle unauthorized or server errors
      return { success: false, status: res.status, user: null };
    }

    const data = await res.json();
    return { success: true, ...data };

  } catch (error) {
    console.error("checkLoginStatusApi error:", error);
    return { success: false, message: error.message };
  }
};


// 7. logout api
export const logoutApi = async()=>{
  const res = await fetch(`${backendurl}/auth/logout`, {
    method: "POST",
    credentials: "include", // sends cookie
  });
  return res
}