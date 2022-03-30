import { h, PropType, ref, defineComponent, toRaw, unref } from "vue"
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
  buttons?: button[]
  defaultValues?: { [k: string]: unknown }
}

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
    const options: option[] = props.options || []
    const buttons = props.buttons || []
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
          ...options.map((option) => {
            const { type, name, label, itemProps, ...rest } = option
            const slots = ctx.slots[name]

            const comp = () => {
              const comp = compDict[type as compKeys] || compDict.input
              return h(comp as DefineComponent, {
                "onUpdate:value": updateState(name),
                value: state.value[name],
                ...rest,
              })
            }

            const children = slots || comp
            return h(
              compDict.form.Item,
              { label: label || name, name, ...itemProps },
              children
            )
          }),

          ...buttons.map((btn) => {
            const { text, icon, ...rest } = btn
            return h(compDict.button, rest, {
              default: () => text,
              icon,
            })
          }),
        ]
      )
  },
})
