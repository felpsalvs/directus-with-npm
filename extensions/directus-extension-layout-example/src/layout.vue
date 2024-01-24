<template>
  <div v-if="!loading">
    <p>Collection: {{ collection }}</p>

    <label for="facebook">Facebook URL:</label>
    <VInput :fullWidth="true" type="text" v-model="socialMediaData.facebook"/>

    <label for="instagram">Instagram URL:</label>
    <VInput :fullWidth="true" type="text" v-model="socialMediaData.instagram"/>

    <label for="twitter">X URL:</label>
    <VInput :fullWidth="true" type="text" v-model="socialMediaData.twitter"/>

    <VButton @click="saveSocialMedia">Save</VButton>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    collection: {
      type: String,
      required: true,
    },
    items: Array,
    loading: Boolean,
    error: Array,
    search: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      socialMediaData: {
        facebook: '',
        instagram: '',
        twitter: '',
      },
    };
  },
  methods: {
    async saveSocialMedia() {
      const currentItem = this.items[0];
      
      if (currentItem) {
        const updatedItem = {
          ...currentItem,
          facebook: this.socialMediaData.facebook,
          instagram: this.socialMediaData.instagram,
          twitter: this.socialMediaData.twitter,
        };
        await this.updateItem(currentItem.id, updatedItem);
      }
    },
    async updateItem(itemId, updatedItem) {
      console.log('quantidade', itemId, 'de links:', updatedItem);
    },
  },
};
</script>
