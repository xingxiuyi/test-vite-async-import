<template>
  <div>async func execute: {{ example }}</div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import { asyncFunc } from "../src";

  export default defineComponent({
    name: "App",
    components: {},
    setup() {
      const example = ref("NULL");

      onMounted(async () => {
        const sf = await asyncFunc();
        example.value = `FINISH ${sf?.name}`;
      });
      return { example };
    },
  });
</script>
