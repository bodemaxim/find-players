<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'

import SpinningLoader from './SpinningLoader.vue'
import SearchPanel from './SearchPanel.vue'

import type { IPlayer } from '@/interfaces/IData'

const store = useStore()
const isLoading = computed(() => store.getters.isLoading)

/**
 * Данные вопроса.
 */
const player: Ref<IPlayer | null> = ref<IPlayer | null>(null)

/**
 * Событие изменения вопроса для отображения.
 */
const onPlayerViewChanged = (playerView: IPlayer | null) => {
  player.value = playerView
}
</script>

<template>
  <main class="d-flex flex-column">
    <SpinningLoader v-if="isLoading" />
    <div class="mx-7">
      <h1 class="website-title mr-1">Поиск игроков</h1>
    </div>
    <div class="search-view-container">
      <div class="search-panel">
        <SearchPanel @player-view="onPlayerViewChanged($event)" />
      </div>
      <div class="view-panel">
        <div v-if="player" class="view-panel-player">
          <h2>{{ player.name }}</h2>
          <p>{{ player.info }}</p>
          <hr />
        </div>
        <p v-else class="mt-7">Выберите игрока, чтобы просмотреть информацию о нем.</p>
      </div>
    </div>
    <button @click="console.log(player)">тест плеер</button>
  </main>
</template>

<style lang="scss" scoped>
main {
  height: 100vh;
  width: 100vw;
  overflow-y: hidden;
}

.search-panel,
.view-panel {
  display: flex;
  flex-grow: 1;
  border: 1px solid #dee2e6;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  margin: 1em;
  padding: 1em;
  max-height: calc(100% - 180px);
}

.search-panel {
  width: 30%;
  max-width: 30%;
  background-color: rgb(220, 220, 220);
}

.view-panel {
  margin-right: 2em;
}

.view-panel-player {
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.search-panel {
  margin-left: 2em;
}

.search-view-container {
  display: flex;
  flex-grow: 1;
}

hr {
  border: 2px solid gray;
}

/* XS */
@media (min-width: 320px) and (max-width: 575px) {
  main {
    font-size: 14px;
    overflow-y: auto;
  }

  .search-view-container {
    display: block;
  }

  .search-panel {
    display: block;
    width: 100%;
    max-width: calc(100% - 28px);
    height: auto;
    max-height: 60vh;
    margin: 1em;
  }

  .view-panel {
    margin: 1em;
  }

  .view-panel-player {
    height: auto;
  }
}

/* S */
@media (min-width: 576px) and (max-width: 767px) {
  main {
    font-size: 15px;
  }
}
</style>
