<template lang="pug">
  v-list
    v-subheader Mode
    v-list-item
      v-radio-group.pl-3.mt-1( v-model="mode" hide-details="auto" )
        v-radio( label="Content" value="content" )
        v-radio( label="Margin" value="margin" )
</template>

<script>
import configs from '../../../../configs'

export default {
  name: 'mode',

  computed: {
    mode: {
      set(mode) {
        chrome.storage.sync.set({ mode })
      },
      get() {
        return configs.mode
      },
    },
  },
}
</script>
