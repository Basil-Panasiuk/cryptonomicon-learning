<template>
  <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
    {{ ticker.name }} - USD
  </h3>
  <div
    ref="graph"
    class="flex items-end border-gray-600 border-b border-l h-64"
  >
    <div
      v-for="(bar, idx) of normalizedGraph"
      :key="idx"
      :style="{ height: `${bar}%` }"
      class="bg-purple-800 border w-10"
    ></div>
  </div>
  <remove-graph-btn />
</template>

<script>
import RemoveGraphBtn from "./RemoveGraphBtn.vue";

export default {
  components: {
    RemoveGraphBtn,
  },

  mounted() {
    console.log(this.ticker);
  },

  props: {
    ticker: Object,
    normalizedGraph: Array,
  },
};
</script>
