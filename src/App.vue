<script setup lang="ts">
import { JsonForm, IJsonFormProps } from "./components/JsonForm"

const formOption: IJsonFormProps = {
  formProps: { layout: "horizontal" },
  options: [
    {
      type: "select",
      name: "select",
      options: [
        { label: "选项1", value: "1" },
        { label: "选项2", value: "2" },
        { label: "选项3", value: "3" },
      ],
      style: { width: "300px" },
    },
    {
      type: "datePicker",
      name: "datePicker",
      class: "datePicker",
    },
    {
      name: "slot",
    },
    {
      name: "input",
    },
  ],
  buttons: [
    {
      type: "primary",
      text: "提交",
      htmlType: "submit",
      class: "submit",
    },
  ],
}

const handleFinish = (values: unknown) => {
  console.log(values)
}
</script>

<template>
  <JsonForm v-bind="formOption" @finish="handleFinish">
    <template #slot> slot </template>
  </JsonForm>
</template>
