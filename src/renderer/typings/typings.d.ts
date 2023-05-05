declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
