<script setup lang="ts"></script>

<template>
  <main>
    <div class="loader"></div>
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  height: 100vh;
  position: absolute;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  position: absolute;
  left: calc(50% - 20px);
  top: calc(50% - 20px);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
