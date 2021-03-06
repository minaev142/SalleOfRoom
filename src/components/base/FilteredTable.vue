<template>
  <v-layout column>
    <v-data-table
      :no-data-text="loading ? 'Данные загружаются' : 'Данных нет'"
      :server-items-length="serverItemsLength"
      :footer-props="footerProps"
      :headers="visibleHeaders"
      :show-all="showSelect"
      :items="filteredItems"
      :sort-desc="sortDesc"
      :loading="loading"
      :sort-by="sortBy"
      :search="search"
      :page.sync="page"
      @pagination="updatePagination"
    >
      <!-- :options.sync="options" -->
      <!-- hide-default-footer -->
      <template #header="{ props }" v-if="withFilter">
        <slot name="filter" :headers="props.headers">
          <tr class="grey lighten-3">
            <th v-for="header in props.headers" :key="header.text">
              <div v-if="header.isFilter">
                <refresh-select
                  v-model="filters[header.value]"
                  :items="columnValueList(header.value)"
                  with-select-all
                  multiple
                />
              </div>
            </th>
            <th v-if="withActions" />
          </tr>
        </slot>
      </template>

      <template #item="props">
        <tr>
          <slot
            :item="props.item"
            :index="props.index"
          >
            <td
              v-for="header in visibleHeaders"
              :key="header.value"
              :class="currentAlign(header.align)"
            >
              <slot
                :name="'item.' + header.value"
                :item="props.item"
              >{{ props.item[header.value] }}</slot>
            </td>
          </slot>

          <slot
            v-if="withActions"
            :item="props.item"
            :index="props.index"
            name="actions"
          />
        </tr>
      </template>

      <template #top v-if="customiseHeader">
        <footer-table :headers="headers" />
        <v-divider />
      </template>

      <template #body.append v-if="customiseHeader">
        <footer-table :headers="headers" />
      </template>
    </v-data-table>

    <!-- <footer-table :headers="headers" /> -->
  </v-layout>
</template>

<script>
import FooterTable from './ConfigurableTable/FooterTable';
import RefreshSelect from '../helper/RefreshSelect';

export default {
  name: 'FilteredTable',

  components: {
    RefreshSelect,
    FooterTable,
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    serverItemsLength: Number,
    customiseHeader: Boolean,
    withActions: Boolean,
    footerProps: Object,
    showSelect: Boolean,
    hideFooter: Boolean,
    sortDesc: Boolean,
    loading: Boolean,
    sortBy: String,
    search: String,
    page: Number,
  },

  created() {
    this.setFilters()
  },

  data: () => ({
    filters: {},
  }),

  computed: {
    selectedItems: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    withFilter() {
      return this.headers.some(h => h.isFilter);
    },

    visibleHeaders() {
      return this.customiseHeader
        ? this.headers.filter(h => h.isSelected)
        : this.headers;
    },

    filteredItems() {
      return this.filterItems(this.items);
    },

    itemsPerPage() {
      return this.$store.getters.getPerPage
    }
  },

  methods: {
    changeSort(column) {
      // if (this.paginationSync.sortBy === column) {
      //   this.paginationSync.descending = !this.paginationSync.descending;
      // } else {
      //   this.paginationSync.sortBy = column;
      //   this.paginationSync.descending = false;
      // }
    },
    columnValueList(val) {
      const values = [];
      if (!this.items) return;
      this.items.forEach(d => {
        if (!values.includes(d[val])) {
          values.push(d[val]);
        }
      });

      return values.filter(d => !!d && d !== 'null');
    },

    filterItems(items) {
      return items && items.filter(
        d => Object
          .keys(this.filters)
          .every(
            k => !this.filters[k].length
               || this.filters[k].includes(d[k])
          )
      );
    },

    currentAlign(align) {
      if (!align) return;
      return `text-${align}`;
    },

    setFilters() {
      this.headers.forEach(header => {
        if (!header.isFilter) return;
        this.$set(this.filters, header.value, []);
      });
    },

    updatePagination(pagination) {
      this.options = pagination;
      // console.log(pagination);
    }
  },
  watch: {
    headers() {
      this.setFilters();
    },
    options(newVal) {
      // console.log(newVal);
    }
  },
};
</script>
