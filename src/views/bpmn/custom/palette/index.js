import CustomContextPad from "./CustomContextPad";
import CustomPalette from "./CustomPalette";
import CustomRenderer from "./CustomRenderer";

//只保留自定义的组件
// export default {
//   __init__: ["customContextPad", "paletteProvider", "customRenderer"],
//   paletteProvider: ["type", CustomPalette],
//   customContextPad: ["type", CustomContextPad],
//   customRenderer: ["type", CustomRenderer]
// };

export default {
  __init__: ["customContextPad", "customPalette", "customRenderer"],
  customPalette: ["type", CustomPalette],
  customContextPad: ["type", CustomContextPad],
  customRenderer: ["type", CustomRenderer]
};
