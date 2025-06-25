import { defineStore } from 'pinia'

export const useHeaderStore = defineStore('header', {
  state: () => ({
    title: ''
  }),
  actions: {
    setTitle(newTitle) {
      this.title = newTitle
    }
  }
})
