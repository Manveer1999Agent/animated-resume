import BackgroundComponent from "./background-components";

type DemoProps = {
  className?: string;
};

export const Component = ({ className }: DemoProps) => {
  return (
    <BackgroundComponent
      className={className}
      glowColor="#93c5fd"
      opacity={0.48}
      blendMode="screen"
    />
  );
};

export default Component;
