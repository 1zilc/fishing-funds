declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.svg' {
  export default function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
}
