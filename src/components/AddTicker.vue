<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            v-on:keydown.enter="() => add()"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>

        <div
          v-if="alternativeCoins().length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
            v-for="coin of alternativeCoins()"
            :key="coin.id"
            @click="() => add(coin.Symbol)"
          >
            {{ coin.Symbol }}
          </span>
        </div>
        <div v-if="!isValid" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button @click="() => add()" type="button" class="my-4" />
  </section>
</template>

<script>
import AddButton from "./AddButton.vue";

export default {
  components: {
    AddButton,
  },

  props: {
    tickers: Array,
    coins: Array,
  },

  emits: {
    "add-ticker": (value) => typeof value === "string",
  },

  data() {
    return {
      ticker: "",
      isValid: true,
    };
  },

  methods: {
    isValidTicker(name) {
      return this.tickers.every((ticker) => ticker.name !== name);
    },

    add(name = "") {
      if (name) {
        this.ticker = name;
      }

      if (!this.isValidTicker(this.ticker)) {
        this.isValid = false;
        return;
      }

      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },

    alternativeCoins() {
      return this.coins
        .filter((coin) => this.ticker && coin.FullName.includes(this.ticker))
        .slice(0, 4);
    },
  },

  watch: {
    ticker() {
      this.isValid = true;
    },
  },
};
</script>
