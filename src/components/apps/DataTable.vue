<template>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items-length="totalItems"
      :items="itemsWithIndex"
      :item-key="'number'"
      :loading="loading"
      class="elevation-1"
      item-value="name"
      @update:options="loadItems"
      @click:row="rowClick"
    >
    </v-data-table-server>
</template>

<script>
export default {
  name: "DataTable",

  props: {
    headers: Array,
    api: Function,
  },

  methods: {
    loadItems({ page, itemsPerPage, sortBy }) {

      this.pageNumber = page;
      this.itemsPerPageNumber = itemsPerPage;

      this.loading = true;
      this.api(
        page - 1,
        itemsPerPage,
        sortBy[0] && `${sortBy[0].key},${sortBy[0].order}`
      ).then((res) => {
        this.serverItems = res.data.content;
        this.totalItems = res.data.totalElements;
        this.loading = false;
      });
    },
  },

  data() {
    return {
      serverItems: [],
      loading: true,
      totalItems: 0,
      page: 0,
      pageNumber: 0,
      itemsPerPage: 20,
      itemsPerPageNumber: 20,
    };
  },
};
</script>