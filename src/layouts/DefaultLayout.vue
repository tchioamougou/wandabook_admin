<script setup lang="ts">
import HeaderArea from '@/components/Header/HeaderArea.vue'
import SidebarArea from '@/components/Sidebar/SidebarArea.vue'
import Toast from '@/components/Alerts/Toast.vue';
import { onBeforeMount, ref } from 'vue';
import EventBus from '@/EventBus';
import type ToastPayload from '@/types/Toast'

let toastVisible = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | undefined;
let toast = ref<ToastPayload>({ type: 'info', message: '' });

const handleShowToast = (payload: unknown) => {
  toast.value = payload as ToastPayload;
  toastVisible.value = true;
  hideToast();
}

const hideToast = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  // Set a new timeout
  timeoutId = setTimeout(() => {
    toastVisible.value = false;
  }, 4000);
}

EventBus.on('showToast', handleShowToast);
EventBus.on('hideToast', () => { toastVisible.value = false });

const init = async () => {
  try {

  } catch (err) {
    console.log("DefaultLayout.fetchMenu.error: " + err)
  }
};
onBeforeMount(init);
</script>

<template>
  <!-- ===== Page Wrapper Start ===== -->
  <div class="flex h-screen overflow-hidden">
    <!-- ===== Sidebar Start ===== -->
    <SidebarArea />
    <!-- ===== Sidebar End ===== -->

    <!-- ===== Content Area Start ===== -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- ===== Header Start ===== -->
      <HeaderArea />
      <!-- ===== Header End ===== -->

      <!-- ===== Main Content Start ===== -->
      <main>
        <div class="mx-auto max-w-screen-2xl p-0 md:p-6 2xl:p-10 md:pt-0 2xl:pt-0">
          <slot></slot>
        </div>
      </main>
      <!-- ===== Main Content End ===== -->
    </div>
    <!-- <Toast :type="'danger'" :message="'toast.message'" /> -->
    <transition name="fade">
      <Toast v-if="toastVisible" :type="toast.type" :message="toast.message" />
    </transition>
  </div>
  <!-- ===== Page Wrapper End ===== -->
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
