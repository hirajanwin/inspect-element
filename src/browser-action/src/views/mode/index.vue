<template lang="pug">
  v-list
    v-subheader Mode
    v-list-item
      v-radio-group.pl-3.mt-1( v-model="mode" hide-details="auto" )
        v-radio( label="Content" value="content" )
        v-radio( label="Margin" value="margin" )
</template>

<script>
export default {
  name: 'mode',

  data: () => ({
    mode: 'margin',
  }),

  watch: {
    mode() {
      console.log(this.mode)
      chrome.storage.sync.set({ mode: this.mode })
    },
  },

  created() {
    chrome.storage.sync.onChanged.addListener(this.handleStorageChange)

    chrome.storage.sync.get(['mode'], ({ mode }) => {
      if (mode) this.mode = mode

      // store default mode
      chrome.storage.sync.set({ mode: this.mode })
    })
  },

  beforeDestroy() {
    chrome.storage.sync.onChanged.removeListener(this.handleStorageChange)
  },

  methods: {
    handleStorageChange(changes) {
      if (changes.mode && changes.mode.newValue) this.mode = changes.mode.newValue
    },
  },
}
</script>
