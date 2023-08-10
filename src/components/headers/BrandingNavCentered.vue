<template>
  <div class="w-screen pl-10 grid grid-cols-3 content-between ">
    <div class="flex flex-row space-x-4 items-center">
      <ul  v-for="(route, index) in routes">
        <li class="nav-item" href="{{ route.url }}">
          <i class="{{ route.icon }}"></i>
          <span>{{ route.name }}</span>
        </li>
      </ul>
    </div>
    <router-link to="/"><LogoSvg class="nav-logo-long darken-hover"></LogoSvg></router-link>
  </div>

</template>
<script setup lang="ts">
import LogoSvg from "@/components/img/LogoSvg.vue";
import {ref} from "vue";
let routes = ref([])


</script>