import BackgroundComponent from "./background-components";

type DemoProps = {
  className?: string;
};

export const Component = ({ className }: DemoProps) => {
  return (
    <BackgroundComponent
      className={className}
      glowColor="rgba(147, 197, 253, 0.88)"
      opacity={0.3}
      blendMode="soft-light"
    />
  );
};

export default Component;
