import { DSL } from "../../figma/types"

export function generateSVGCode(dsl: DSL) {
    return `
        <Svg
      width={${dsl.dimension.width}}
      height={${dsl.dimension.height}} 
      viewBox="0 0 ${dsl.dimension.width} ${dsl.dimension.height}"
      fill="none"
    >
      <Path
        d="${dsl.vectorData[0].data}"
        fill="${dsl.props.fill}"
      />
    </Svg>
    `
}