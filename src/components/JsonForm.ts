import { h, PropType, ref, defineComponent, toRaw, unref, Fragment } from "vue"
import type { DefineComponent } from "vue"
import { compDict } from "./dict"

type compKeys = keyof typeof compDict

type newableType = new (...args: any[]) => any

type PropsOf<C extends newableType> = InstanceType<C>["$props"]

type option = {
  [k in compKeys]?: { type?: k } & PropsOf<typeof compDict[k]>
}[compKeys] & {
  name: string
  label?: string
  itemProps?: PropsOf<typeof compDict.form.Item>
}

type button = PropsOf<typeof compDict.button> & {
  iconClass?: string
  text?: string
}

export interface IJsonFormProps {
  formProps?: PropsOf<typeof compDict.form>
  options?: option[]
  buttons?: (button | (() => button))[]
  defaultValues?: { [k: string]: unknown }
}

const ButtonItem = defineComponent({
  props: {
    button: {
      type: Object as PropType<button | (() => button)>,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    return () => {
      const button =
        typeof props.button === "function" ? props.button() : props.button

      const { text, icon, ...rest } = button
      return h(compDict.button, rest, {
        default: () => text,
        icon,
      })
    }
  },
})

const OptionItem = defineComponent({
  emits: ["update"] as string[],
  props: {
    option: {
      type: Object as PropType<option>,
    },
    value: {
      type: [Object, Array, String, Number, Boolean] as PropType<unknown>,
    },
  },
  setup(props, ctx) {
    return () => {
      const { type, name, label, itemProps, ...rest } = props.option || {
        name: "",
      }

      const setValue = (val: unknown) => ctx.emit("update", val)
      const children = () => {
        const comp = compDict[type || "input"] || compDict.input
        return h(comp as DefineComponent, {
          "onUpdate:value": setValue,
          value: props.value,
          ...rest,
        })
      }

      const defaultSlot = ctx.slots["default"]
      const slot = defaultSlot
        ? () =>
            defaultSlot({
              value: props.value,
              setValue,
            })
        : null

      return h(
        compDict.form.Item,
        { label: label || name, name, ...itemProps },
        slot || children
      )
    }
  },
})

export const JsonForm = defineComponent({
  emits: ["finish"],
  props: {
    formProps: {
      type: Object as PropType<IJsonFormProps["formProps"]>,
      default: () => ({}),
    },
    options: {
      type: Array as PropType<IJsonFormProps["options"]>,
      default: () => [],
    },
    buttons: {
      type: Array as PropType<IJsonFormProps["buttons"]>,
      default: () => [],
    },
    defaultValues: {
      type: Object as PropType<IJsonFormProps["defaultValues"]>,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const state = ref(props.defaultValues || {})
    const updateState = (key: string) => (value: unknown) => {
      state.value[key] = value
    }

    return () =>
      h(
        compDict.form,
        {
          onFinish: () => ctx.emit("finish", { ...unref(state) }),
          model: state,
          ...props.formProps,
        },
        () => [
          h(
            Fragment,
            null,
            props.options?.map((option) =>
              h(
                OptionItem,
                {
                  option,
                  value: state.value[option.name],
                  onUpdate: updateState(option.name),
                },
                ctx.slots[option.name]
              )
            )
          ),

          h(
            Fragment,
            null,
            props.buttons?.map((button) => h(ButtonItem, { button }))
          ),
        ]
      )
  },
})
