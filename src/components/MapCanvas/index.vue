<script setup lang="ts">
import { MapController } from '@/core'
const refWrap = ref<HTMLElement>()

onMounted(() => {
  nextTick(() => {
    const controller = new MapController(refWrap.value!)
    //@ts-ignore
    window.controller = controller
  })
})
</script>

<template>
  <div class="map-container h-screen w-screen all-center">
    <div
      class="map-wrap rounded shadow-xl overflow-hidden"
      :style="{ width: '700px', height: '500px' }"
      ref="refWrap"
    ></div>
  </div>
</template>

<style lang="scss"></style>
