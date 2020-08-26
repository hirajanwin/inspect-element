<template lang="pug">
  v-list
    v-subheader.my-1.py-1 Colors
    v-list-item.py-1
      color-picker( label="Cover" v-model="coverColor" )
      v-tooltip( bottom open-on-click open-on-hover )
        template( v-slot:activator="{ on, attrs }" )
          v-icon.ml-1( small v-bind="attrs" v-on="on" ) mdi-help-circle
        span color of the content without padding and border
    v-list-item.py-1
      color-picker( label="Padding" v-model="paddingColor" )
    v-list-item.py-1
      color-picker( label="Border" v-model="borderColor" )
    v-list-item.py-1
      color-picker( label="Margin" v-model="marginColor" )
</template>

<script>
import ColorPicker from './color-picker'
import configs from '../../../../configs'

export default {
  name: 'color',

  components: {
    ColorPicker,
  },

  computed: {
    coverColor: {
      set(coverColor) {
        chrome.storage.sync.set({ coverColor })
      },
      get() {
        return configs.coverColor
      },
    },

    paddingColor: {
      set(paddingColor) {
        chrome.storage.sync.set({ paddingColor })
      },
      get() {
        return configs.paddingColor
      },
    },
    borderColor: {
      set(borderColor) {
        chrome.storage.sync.set({ borderColor })
      },
      get() {
        return configs.borderColor
      },
    },
    marginColor: {
      set(marginColor) {
        chrome.storage.sync.set({ marginColor })
      },
      get() {
        return configs.marginColor
      },
    },
  },
}
</script>
