import { Button, DatePicker, Form, Input, Select } from "ant-design-vue"
import "ant-design-vue/dist/antd.css"

export const compDict = {
  select: Select,
  input: Input,
  button: Button,
  form: Form,
  datePicker: DatePicker,
  rangePicker: DatePicker.RangePicker,
} as const
