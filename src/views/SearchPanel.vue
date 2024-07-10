<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { store } from '@/store/store'

import playersData from '@/db/PlayersData.json'

import type { IPlayer, IPlayerWithSelection } from '@/interfaces/IData'

//#region Props и Emits
const emits = defineEmits<{
  playerView: [value: IPlayer | null]
}>()
//#endregion Props и Emits

//#region Лоадер
const setLoadingTrue = () => {
  store.dispatch('toggleLoading', true)
}

const setLoadingFalse = () => {
  store.dispatch('toggleLoading', false)
}
//#endregion Лоадер

//#region Данные
/**
 * Данные пользователей.
 */
const dataToSearch: Ref<IPlayer[]> = ref<IPlayer[]>([])

/**
 * Вводимый запрос.
 */
const searchQuery: Ref<string> = ref<string>('')

/**
 * Подсказки для поиска.
 */
const searchPrompts: Ref<IPlayerWithSelection[]> = ref<IPlayerWithSelection[]>([])

/**
 * Результаты поиска.
 */
const searchResults: Ref<IPlayerWithSelection[]> = ref<IPlayerWithSelection[]>([])

/**
 * Имя выбранного игрока.
 */
let selectedPlayerName: string = ''
//#endregion Данные

//#region Методы
/**
 * Инициализировать данные.
 */
const initData = () => {
  setLoadingTrue()

  dataToSearch.value = playersData

  setLoadingFalse()
}

/**
 * Искать сотрудников по имени.
 */
const onSearch = async () => {
  console.log('onSearch')
  if (searchQuery.value.length < 3 || searchQuery.value === selectedPlayerName) {
    searchPrompts.value = []

    if (searchQuery.value.length === 0) {
      searchResults.value = []
      emits('playerView', null)
    }

    return
  }

  searchResults.value = []

  const ids: number[] = parseSearchQuery(searchQuery.value)

  searchPrompts.value = dataToSearch.value
    .filter((item) => ids.includes(item.id))
    .map((item) => ({ ...item, selected: false }))

  if (searchPrompts.value.length > 0) searchPrompts.value[0].selected = true
}

/**
 * Получить массив идентификаторов подсказок из строкового запроса.
 */
const parseSearchQuery = (str: string): number[] => {
  const query: string = str.trim()
  const result: number[] = []

  const containsSubstring = (mainString: string, subString: string): boolean => {
    return mainString.toLowerCase().includes(subString.toLowerCase())
  }

  for (const item of dataToSearch.value) {
    if (containsSubstring(item.name, query) && result.length < 10) {
      result.push(item.id)
    } else if (result.length >= 10) return result
  }
  return result
}

/**
 * Событие нажатия на кнопку "Поиск".
 */
const onSearchButtonClick = () => {
  let playerData: IPlayerWithSelection | null = {} as IPlayerWithSelection

  for (const item of searchPrompts.value) {
    if (searchQuery.value.toLowerCase().trim() === item.name.toLowerCase()) {
      playerData.id = item.id
      playerData.name = item.name
      playerData.info = item.info
      playerData.selected = true
      break
    }
  }

  if (playerData === undefined) playerData = {} as IPlayerWithSelection

  onSelectPrompt(playerData)
}

/**
 * Событие выбора подсказки.
 */
const onSelectPrompt = (player: IPlayerWithSelection) => {
  for (const item of searchPrompts.value) {
    if (player.id === item.id) {
      searchQuery.value = item.name
      break
    }
  }

  const playerData: IPlayer = {
    id: player.id,
    name: player.name,
    info: player.info
  }

  searchPrompts.value = []
  selectedPlayerName = playerData.name

  const resultIds: number[] = parseSearchQuery(searchQuery.value)
  searchResults.value = dataToSearch.value
    .filter((item) => resultIds.includes(item.id))
    .map((item) => ({ ...item, selected: false }))

  emits('playerView', playerData.id ? playerData : null)
}

/**
 * Событие выбора результата поиска.
 */
const onSelectResult = (player: IPlayerWithSelection) => {
  const playerData: IPlayer = {
    id: player.id,
    name: player.name,
    info: player.info
  }

  emits('playerView', playerData)
}

//#endregion Методы

//#region Управление стрелками
/**
 * Событие нажатия клавиши управления.
 */
const onKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      onArrowUp()
      break
    case 'ArrowDown':
      onArrowDown()
      break
    case 'Enter':
      onEnter()
      break
  }
}

/**
 * Событие нажатия кнопки вверх.
 */
const onArrowUp = () => {
  let nextIndex = 0

  for (const [index, item] of searchPrompts.value.entries()) {
    if (item.selected) {
      item.selected = false
      nextIndex = index - 1
      break
    }
  }

  if (nextIndex >= 0) searchPrompts.value[nextIndex].selected = true
  else searchPrompts.value[searchPrompts.value.length - 1].selected = true
}

/**
 * Событие нажатия кнопки вниз.
 */
const onArrowDown = () => {
  let nextIndex = 0

  for (const [index, item] of searchPrompts.value.entries()) {
    if (item.selected) {
      item.selected = false
      nextIndex = index + 1
      break
    }
  }

  if (nextIndex < searchPrompts.value.length) searchPrompts.value[nextIndex].selected = true
  else searchPrompts.value[0].selected = true
}

/**
 * Событие нажатия кнопки Enter.
 */
const onEnter = () => {
  let player: IPlayerWithSelection = {} as IPlayerWithSelection

  for (const item of searchPrompts.value) {
    if (item.selected === true) {
      player = item
      break
    }
  }

  onSelectPrompt(player)
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
//#endregion Управление стрелками

watch(
  () => searchQuery.value,
  () => onSearch()
)

//#region Инициализация
initData()
//#endregion Инициализация
</script>

<template>
  <main class="mt-5">
    <form @submit.prevent @keydown.enter.prevent>
      <div class="input-group p-2">
        <input
          type="text"
          class="form-control search-form"
          placeholder="Поиск игроков..."
          v-model="searchQuery"
        />
        <div class="input-group-append ml-1">
          <button @click="onSearchButtonClick()" class="btn btn-outline-secondary">Найти</button>
        </div>
      </div>
      <div
        @keydown="onKeyDown"
        v-if="searchPrompts.length > 0"
        class="dropdown cursor-pointer bg-white rounded p-3"
      >
        <p
          v-for="item in searchPrompts"
          :key="item.id"
          @click="onSelectPrompt(item)"
          :class="['dropdown-item m-1', item.selected ? 'selected-item' : '']"
        >
          {{ item.name }}
        </p>
      </div>
    </form>
    <div v-if="searchPrompts.length === 0">
      <p class="font-weight-bold mt-2">Результаты</p>
      <v-virtual-scroll
        class="scrollable-container"
        :items="searchResults"
        v-if="searchResults.length > 0"
      >
        <template v-slot:default="{ item }"
          ><p @click="onSelectResult(item)" class="border rounded mt-1 mb-1 p-3 player-item">
            {{ item.name }}
          </p></template
        >
      </v-virtual-scroll>
      <p v-else>Не найдено</p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
$font-family-main: 'Montserrat', sans-serif;
$transition-time: 0.2s;
$hover-background-color: lightskyblue;

main {
  font-family: $font-family-main;
  overflow: hidden;
  max-width: 100%;
}

.search-form {
  font-family: $font-family-main;
}

.player-item {
  margin: 0;
  padding: 0;
  background-color: white;
  &:hover {
    background-color: $hover-background-color;
    cursor: pointer;
    transition: $transition-time;
  }
}

.scrollable-container {
  height: calc(100vh - 250px);
}

.filter-btn {
  width: 150px;
}

.selected-item {
  background-color: lightblue;
}

.dropdown-item:hover {
  background-color: rgb(218, 246, 255);
}
/* XS */
@media (min-width: 320px) and (max-width: 575px) {
  .scrollable-container {
    height: calc(60vh - 150px);
  }
}
</style>
