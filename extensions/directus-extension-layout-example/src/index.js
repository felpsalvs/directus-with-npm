import { toRefs } from 'vue';
import { useItems, useCollection } from '@directus/extensions-sdk';
import LayoutComponent from './layout.vue';

export default {
  id: 'timio23-custom-layout',
  name: 'Custom Layout',
  icon: 'box',
  component: LayoutComponent,
  slots: {
    options: () => null,
    sidebar: () => null,
    actions: () => null,
  },
  setup(props) {
    const { collection, filter, search } = toRefs(props);
    const { info, primaryKeyField, fields: fieldsInCollection } = useCollection(collection);

    const { items, loading, error, updateItem } = useItems(collection, {
      sort: primaryKeyField.field,
      limit: '-1',
      fields: ['name', 'email', 'facebook', 'instagram', 'twitter'],
      filter,
      search,
    });

    const socialMediaData = {
      facebook: '',
      instagram: '',
      twitter: '',
    };

    const saveSocialMedia = async () => {
      const currentItem = items[0]; // Assuming there is only one item in the result
      const updatedItem = {
        ...currentItem,
        facebook: socialMediaData.facebook,
        instagram: socialMediaData.instagram,
        twitter: socialMediaData.twitter,
      };

      await updateItem(currentItem.id, updatedItem);
    };

    return {
      info,
      primaryKeyField,
      items,
      loading,
      filter,
      search,
      fieldsInCollection,
      error,
      facebook: socialMediaData.facebook,
      instagram: socialMediaData.instagram,
      twitter: socialMediaData.twitter,
      saveSocialMedia,
    };
  },
};
