<script setup lang="ts">
import { reactive, ref } from "vue"
import { JsonForm, IJsonFormProps } from "./components/JsonForm"

const loading = ref(false)

const formOption: IJsonFormProps = reactive({
  formProps: { layout: "horizontal", labelCol: { style: { width: "120px" } } },
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
      style: { marginLeft: "120px" },
    },
    {
      text: "取消",
      style: { marginLeft: "20px" },
      onClick: () => {},
    },
    () => ({
      text: "提交3",
      loading: loading.value,
      class: "submit",
      style: { marginLeft: "120px" },
      onClick: () => {
        loading.value = true
        setTimeout(() => {
          loading.value = false
        }, 2000)
      },
    }),
  ],
  defaultValues: {
    slot: 3,
  },
})

const handleFinish = (values: unknown) => {
  console.log(values)
}
</script>

<template>
  <JsonForm v-bind="formOption" @finish="handleFinish">
    <template #slot="{ value, setValue }">
      <button type="button" @click="() => setValue(value + 1)">
        {{ value }} ++
      </button>
    </template>
  </JsonForm>
</template>
