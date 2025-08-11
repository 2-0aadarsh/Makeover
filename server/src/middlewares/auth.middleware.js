const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneNumberRegex = /^[6-9]\d{9}$/;

const validateSignup = (req, res, next) => {
  const { name, email, phoneNumber, password, confirmPassword } = req.body;

  if (!name || !email || !phoneNumber || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // validate password strength
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character." });
  }

  // validate email format
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // validate phone number format
  if (!phoneNumberRegex.test(phoneNumber)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }


  next();
}

export { validateSignup };