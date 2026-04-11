import { Link } from "react-router-dom";

export function SignUpPage() {
  return (
    <section className="panel">
      <h1>Create account</h1>
      <p>Start from a guided resume import and publish your animated portfolio.</p>
      <p>
        Already have access? <Link to="/auth/sign-in">Sign in</Link>.
      </p>
    </section>
  );
}
