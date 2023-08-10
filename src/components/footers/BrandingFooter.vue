<script setup lang="ts">
import LogoSvg from "@/components/img/LogoSvg.vue";
import {GithubIcon, DiscordIcon} from "vue3-simple-icons";

</script>
<template>
  <div class="w-screen bg-space-blue p-10 flex flex-row justify-between">
    <div class="footer-element">
      <logo-svg class="footer-logo"></logo-svg>
      <div class="font-extralight">&copy; 2023 - LibreCharts and its contributors</div>
      <div class="prose mt-2 text-inherit font-thin"><slot></slot></div>

    </div>
    <div class="footer-element ">
      <ul class="space-y-5">
        <li><a href="">API Documentation</a></li>
        <li><a href="">Privacy Policy</a></li>
        <li><a href="">Terms and Conditions</a></li>
      </ul>

    </div>
    <div class="footer-element ">
      <ul class="space-y-5">
        <li><a href="">License</a></li>
        <li><a href="">Donate</a></li>
        <li><a href="">vACC Partners</a></li>
      </ul>

    </div>
    <div class="footer-element ">
      <span class="footer-title">Need help?</span>
      <p>Join our Discord or open an issue on Github.</p>
      <div class="flex flex-row gap-4 mt-4">
        <GithubIcon class="footer-icon"></GithubIcon>
        <DiscordIcon  class="footer-icon"></DiscordIcon>
      </div>
    </div>
  </div>

</template>