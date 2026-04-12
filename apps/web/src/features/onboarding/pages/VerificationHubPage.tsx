import { useEffect, useState } from "react";

import { fetchVerificationSections, type VerificationSection } from "../api";
import { useWizardControls } from "../components/WizardLayout";

function statusTone(section: VerificationSection): string {
  if (section.status === "review") {
    return section.confidence === "low" ? "#b45309" : "#0369a1";
  }
  return "#166534";
}

export function VerificationHubPage() {
  const [sections, setSections] = useState<VerificationSection[]>([]);

  useEffect(() => {
    fetchVerificationSections().then(setSections);
  }, []);

  useWizardControls({
    continueTo: "/app/dashboard",
    continueLabel: "Go to dashboard",
    continueDisabled: false,
  });

  return (
    <section>
      <h1>Verification hub</h1>
      <p>Review sections flagged during import before finalizing your first publish.</p>
      <div style={{ display: "grid", gap: "var(--ar-space-3)", marginTop: "var(--ar-space-4)" }}>
        {sections.map((section) => (
          <article
            key={section.id}
            style={{
              border: "1px solid var(--ar-color-border)",
              borderRadius: "var(--ar-radius-sm)",
              display: "flex",
              justifyContent: "space-between",
              padding: "var(--ar-space-3)",
            }}
          >
            <strong>{section.label}</strong>
            <span style={{ color: statusTone(section) }}>
              {section.status === "ready"
                ? "Ready"
                : `Needs review (${section.confidence} confidence)`}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
