<template>
  <div
    v-show="tipShow"
    class="absolute bg-blue-100"
    :style="{ left: left + 'px', top: top + 90 + 'px' }"
  >
    <ul
      class="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 justify-center py-2"
    >
      <li class="mr-2" @click="handleGetGptResponse('translate')">
        <a
          href="#"
          class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active"
          aria-current="page"
          >翻译</a
        >
      </li>
      <li class="mr-2" @click="handleGetGptResponse('explanation')">
        <a
          href="#"
          class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active"
          aria-current="page"
          >解释</a
        >
      </li>

      <li class="mr-2" @click="handleGetGptResponse('summarize')">
        <a
          href="#"
          class="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active"
          aria-current="page"
          >总结</a
        >
      </li>
    </ul>

    <div
      class="border-blue-300 border rounded-lg h-80 bg-white w-80 p-4 overflow-auto"
    >
      <p v-if="isError">Error</p>
      <p v-else-if="loading">Loading....</p>
      <p v-else>{{ gptRes }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { tipShow, left, top, selectedContent } = useGptTip();

const loading = ref(false);
const gptRes = ref("");
const isError = ref(false);
const handleGetGptResponse = async (
  directive: "translate" | "summarize" | "explanation"
) => {
  try {
    isError.value = false;
    loading.value = true;
    const res = await $fetch("/api/gpt", {
      body: {
        content: selectedContent.value,
        directive,
      },
      method: "POST",
    });
    loading.value = false;
    gptRes.value = res;
  } catch (error) {
    isError.value = true;
    console.error(error);
  }
};
</script>
