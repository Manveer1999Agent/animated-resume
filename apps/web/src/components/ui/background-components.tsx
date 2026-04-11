type BackgroundComponentProps = {
  className?: string;
  glowColor?: string;
  opacity?: number;
  blendMode?: "multiply" | "screen" | "overlay" | "soft-light";
};

function joinClasses(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(" ");
}

export const Component = ({
  className,
  glowColor = "#FFF991",
  opacity = 0.6,
  blendMode = "multiply",
}: BackgroundComponentProps) => {
  return (
    <div
      aria-hidden="true"
      className={joinClasses("background-component", className)}
    >
      <div
        className="background-component__glow"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          opacity,
          mixBlendMode: blendMode,
        }}
      />
    </div>
  );
};

export default Component;
