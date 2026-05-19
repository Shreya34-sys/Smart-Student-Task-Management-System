export function passwordStrength(password) {
  const checks = [
    password.length >= 6,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z\d]/.test(password)
  ];
  const score = checks.filter(Boolean).length;

  if (score <= 2) return { score, label: "Weak", color: "bg-rose-500" };
  if (score <= 4) return { score, label: "Good", color: "bg-amber-500" };
  return { score, label: "Strong", color: "bg-teal-500" };
}
