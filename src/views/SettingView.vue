<template>
    <div class="bg-gray-900 min-h-screen md:p-6 p-1">
        <!-- Header -->
        <div class="text-3xl font-bold mb-6">{{ $t('settings') }}</div>

        <!-- Navigation Tabs -->
        <CustomTabs :tabs="tabs" @tab-selected="changeTab"></CustomTabs>

        <!-- Users Section -->
        <div class=" p-6 rounded-lg bg-white ">
            <PricingView v-if="selectTab === 1" />
            <BooksNews v-if="selectTab === 2"></BooksNews>
            <CatalogueView v-if="selectTab === 3"></CatalogueView>
        </div>
    </div>
</template>

<script setup lang="ts">
import 'ag-grid-community/styles/ag-grid.css';
import PricingView from './PricingView.vue';
import BooksNews from './BooksNews.vue';
import { ref } from 'vue';
import CustomTabs from '../components/tabs/CustomTabs.vue';
import { useI18n } from "vue-i18n";
import CatalogueView from './CatalogueView.vue';
const { t } = useI18n({ useScope: "global" });
const selectTab = ref(1);
const tabs = [{ name: t('pricing') }, { name: t('books_new') }, { name: t('catalogue') }]
const changeTab = (tab: number) => {
    selectTab.value = tab;
}
</script>

<style scoped></style>
