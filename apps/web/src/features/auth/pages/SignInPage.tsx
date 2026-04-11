import { Link } from "react-router-dom";

export function SignInPage() {
  return (
    <section className="panel">
      <h1>Sign in</h1>
      <p>Access your workspace and continue editing your portfolio drafts.</p>
      <p>
        New here? <Link to="/auth/sign-up">Create an account</Link>.
      </p>
    </section>
  );
}
