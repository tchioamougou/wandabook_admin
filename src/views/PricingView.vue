<template>
    <div class="">
        <h1 class="text-xl font-semibold mb-4">Subscription Management</h1>

        <div class="flex justify-end mb-4">
            <button @click="openCreateModal" class="bg-blue-500 text-white p-2 rounded">
                Add Subscription
            </button>
        </div>

        <ag-grid-vue :columnDefs="columnDefs" :rowData="subscriptions" :pagination="true" :domLayout="'autoHeight'"
            class="ag-theme-quartz" @row-clicked="onRowClicked" @cellClicked="onCellClicked"></ag-grid-vue>

        <!-- Create/Edit Modal -->
        <div v-if="isModalOpen"
            class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-99 shadow-lg">
            <div class="bg-white p-6 rounded-lg w-1/3">
                <h2 class="text-xl mb-4" v-if="isEditing">Edit Subscription Plan</h2>
                <h2 class="text-xl mb-4" v-else>New Subscription Plan</h2>
                <form @submit.prevent="saveSubscription">
                    <input v-model="formData.title" type="text" placeholder="Title" class="border p-2 w-full mb-4"
                        required />
                    <textarea v-model="formData.description" placeholder="Description" class="border p-2 w-full mb-4"
                        required></textarea>
                    <input v-model="formData.monthly_amount" type="number" placeholder="Monthly Amount"
                        class="border p-2 w-full mb-4" required />
                    <input v-model="formData.yearly_amount" type="number" placeholder="Yearly Amount"
                        class="border p-2 w-full mb-4" required />
                    <select v-model="formData.status" class="border p-2 w-full mb-4" required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <div class="flex justify-end space-x-5">
                        <button type="button" class="bg-red text-white p-2 rounded" @click="closeModal"
                            :disabled="isCreation">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-500 text-white p-2 rounded" :disabled="isCreation">
                            <Spinner v-if="isCreation" />

                            <span v-if="isEditing">Edit Subscription</span>
                            <span v-else>Save Subscription</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <confirmation-popup v-if="showPopup" :title="popupTitle" :message="popupMessage" :onConfirm="confirmAction"
        :onCancel="cancelAction" />
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import { defineComponent, ref } from 'vue';
import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { createDocumentGlobal, deleteDocumentGlobal, editDocumentGlobal, getDocumentsGlobal } from "../lib/appwrite";
import { subscriptionCollection } from "../components/Utilities/constants";
import Spinner from "../components/Utilities/Spinner.vue";
import Actions from "./Actions.vue";
import ConfirmationPopup from "@/components/Alerts/ConfirmPopup.vue"

defineComponent({
    components: { Actions, AgGridVue }
})
const isCreation = ref(false);
const isEditing = ref(false);
const subscriptions = ref();
const selectDocument = ref('');
const showPopup = ref(false);
const popupTitle = ref("");
const popupMessage = ref("");
const fetchSubscriptions = async () => {
    const result = await getDocumentsGlobal(subscriptionCollection);
    if (result.documents != null && result.documents.length > 0) {
        subscriptions.value = result.documents;
    } else {
        subscriptions.value = [];
    }
    console.log(result);
}
const openCreateModal = () => {
    formData.value = { title: '', description: '', monthly_amount: '', yearly_amount: '', status: 'active' };
    isModalOpen.value = true;
    currentSubscriptionId.value = null;
};
const openEditModal = (subscriptionId: string) => {
};
const onRowClicked = (e: any) => {

}
const saveSubscription = async () => {
    isCreation.value = true;
    if (isEditing.value) {
        editDocumentGlobal(subscriptionCollection, selectDocument.value, formData.value);
    } else {
        await createDocumentGlobal(subscriptionCollection, formData.value);
    }
    isCreation.value = false;
    isModalOpen.value = false;
    isEditing.value = false;
    fetchSubscriptions();

};
const deleteSubscription = async (subscriptionId: string) => {
    await deleteDocumentGlobal(subscriptionCollection, subscriptionId);
    fetchSubscriptions();

}
const confirmAction = () => {
    deleteSubscription(selectDocument.value)
    showPopup.value = false;
};

const cancelAction = () => {
    showPopup.value = false;
};
const closeModal = () => {
    isModalOpen.value = false;
    formData.value = { title: '', description: '', monthly_amount: '', yearly_amount: '', status: 'active' };
}
const onCellClicked = (e: any) => {
    const action = e.event.srcElement.dataset.action;
    selectDocument.value = e.data.$id;
    if (action === 'edit') {
        onEditPricing(e.data);
    } else if (action === 'delete') {
        popupTitle.value = "Delete Patron";
        popupMessage.value = "Are you sure you want to delete this patron? This action cannot be undone.";
        showPopup.value = true;
    }
}
const onEditPricing = (e: any) => {
    formData.value = { title: e.title, description: e.description, monthly_amount: e.monthly_amount, yearly_amount: e.yearly_amount, status: e.status };
    isModalOpen.value = true;
    isEditing.value = true;
}
const onDeletePricing = (data: any) => {
    console.log('this is the data to', data);
}
const columnDefs = [
    { headerName: "Title", field: "title", sortable: true },
    { headerName: "Description", field: "description" },
    { headerName: "Monthly Amount", field: "monthly_amount" },
    { headerName: "Yearly Amount", field: "yearly_amount" },
    { headerName: "Status", field: "status" },
    {
        field: "button",
        headerName: "Actions",
        cellRenderer: Actions,
        cellRendererParams: {
            'onEdit': onEditPricing,
            'onDelete': onDeletePricing
        },

    }
];
const formData = ref({
    title: '',
    description: '',
    monthly_amount: '',
    yearly_amount: '',
    status: 'active'
});
const isModalOpen = ref(false);
const currentSubscriptionId = ref(null);

fetchSubscriptions();
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
