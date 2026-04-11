type BackgroundComponentProps = {
  className?: string;
  glowColor?: string;
  opacity?: number;
  blendMode?: "multiply" | "screen" | "overlay" | "soft-light" | "normal";
};

function joinClasses(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

export const Component = ({
  className,
  glowColor = "rgba(255, 241, 130, 0.92)",
  opacity = 0.42,
  blendMode = "normal",
}: BackgroundComponentProps) => {
  return (
    <div
      aria-hidden="true"
      className={joinClasses("background-component", className)}
    >
      <div
        className="background-component__glow"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${glowColor} 0%, transparent 72%)`,
          opacity,
          mixBlendMode: blendMode,
        }}
      />
    </div>
  );
};

export default Component;
