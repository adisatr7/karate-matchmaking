/**
 * User data type definition used to login
 */
export type User = {
  id: string,
  name: string,
  password: string
}

/**
 * SVG React Component type definition
 */
export type SVGComponent = React.SVGProps<SVGSVGElement>

/**
 * SVG Icon type definition
 */
export type SVGIcon = React.FunctionComponent<SVGComponent>