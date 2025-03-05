<script setup lang="ts">
import * as d3 from 'd3'
import { rendererMap } from './renderer'
const refContainer = ref<HTMLElement>()

onMounted(() => {
  const svg = d3.select(refContainer.value!).append('svg').attr('width', '100%').attr('height', '100%')
  rendererMap(svg)
})
</script>

<template>
  <div class="map-container" ref="refContainer"></div>
</template>

<style lang="scss"></style>
