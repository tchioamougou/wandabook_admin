<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: String
    },
    type: String,
    required: Boolean,
    placeholder: String

});
const emits = defineEmits(['update:modelValue']);

const value = ref('');
const update = () => {
    emits('update:modelValue', value.value);
}
onMounted(() => {
    value.value = props.modelValue ?? '';
})
</script>
<template>
    <input v-model="value" :type="type" :required="required" :placeholder="placeholder" @change="update"
        :class="'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'">
</template>

<style></style>