import { interopDefault } from "../utils"
import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from "../types"
import { pluginAntfu } from "../plugins"

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: false,
}

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    indent,
    jsx,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  }

  const pluginStylistic = await interopDefault(import("@stylistic/eslint-plugin"))

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: "style",
    quotes,
    semi,
  })

  return [
    {
      name: "antfu/stylistic/rules",
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        "antfu/consistent-chaining": "error",
        "antfu/consistent-list-newline": "error",
        "antfu/curly": "error",
        "antfu/top-level-function": "error",
        "curly": "off",
        "style/brace-style": ["error", "1tbs"],

        ...overrides,
      },
    },
  ]
}
