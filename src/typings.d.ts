/** Let .glsl shader files be imported without Typescript errors */
declare module "*.glsl" {
  const value: string;
  export default value;
}
