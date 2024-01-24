<template>
	<div v-if="!hasPermission" class="panel-error">
		<v-notice type="danger" icon="warning">You do not have permissions to {{ collection }}</v-notice>
	</div>
	<div v-else :class="['panel-internal-form', { small: width < 30, large: width >= 30, 'has-header': showHeader }]">
		<!-- Form goes here -->
		<v-form v-if="fieldData" v-model="formData" :fields="fieldData" />
		<v-button v-if="Object.keys(formData).length > 0" @click="submitForm()">Save</v-button>
		<v-button v-else secondary>Save</v-button>

		<v-dialog v-model="responseDialog" @esc="responseDialog = false">
			<v-sheet>
				<v-notice v-if="formResponse[primaryKeyField.field]" type="success" icon="done">Saved</v-notice>
				<v-notice v-else-if="formError" type="danger" icon="warning">An Error Occurred</v-notice>
				<v-notice v-else type="danger" icon="warning">No Response</v-notice>
				<blockquote v-if="formResponse" class="form-response">
					<!-- {{  formResponse }} -->
					<router-link :to="getLinkForItem(formResponse)">
						<render-template :collection="collection" :template="responseFormat" :item="formResponse" />
						<v-icon name="launch" small />
					</router-link>
				</blockquote>
				<blockquote v-else-if="formError" class="">
					{{ formError }}
				</blockquote>

				<v-button @click="responseDialog = false">Done</v-button>
			</v-sheet>
		</v-dialog>
	</div>
</template>

<script>
import { useApi, useCollection, useStores } from '@directus/extensions-sdk';
import { ref, watch } from 'vue';

export default {
	props: {
		showHeader: {
			type: Boolean,
			default: false,
		},
		collection: {
			type: String,
			default: '',
		},
		fields: {
			type: Array,
			default: () => [],
		},
		responseFormat: {
			type: String,
			default: '',
		},
		width: String,
		height: String,
	},
	setup(props) {
		const { useFieldsStore, usePermissionsStore } = useStores();
		const fieldsStore = useFieldsStore();
		const permissionsStore = usePermissionsStore();
		const hasPermission = permissionsStore(props.collection, 'create');
		const api = useApi();
		const { primaryKeyField } = useCollection(props.collection);

		const formData = ref({});
		const fieldData = ref([]);

		const formResponse = ref({});
		const formError = ref({});
		const responseDialog = ref(false);

		function getFields() {
			fieldData.value = [];

			props.fields.forEach((field) => {
				fieldData.value.push(fieldsStore.getField(props.collection, field));
			});
		}

		getFields();

		function submitForm() {
			api
				.post(`/items/${props.collection}`, formData.value)
				.then((response) => {
					formResponse.value = response.data.data;
					responseDialog.value = true;
					formData.value = {};
				})
				.catch((error) => {
					formError.value = error;
					responseDialog.value = true;
				});
		}

		watch([() => props.collection, () => props.fields, () => props.responseFormat], getFields);

		return {
			hasPermission,
			primaryKeyField,
			formData,
			fieldData,
			submitForm,
			formResponse,
			formError,
			responseDialog,
			getLinkForItem,
		};

		function getLinkForItem(item) {
			if (item === undefined) return;
			const primaryKey = item[primaryKeyField.value.field];
			return `/content/${props.collection}/${encodeURIComponent(primaryKey)}`;
		}
	},
};
</script>

<style scoped>
.panel-internal-form {
	padding: 12px;
}
.panel-internal-form.has-header {
	padding: 0 12px;
}
.panel-internal-form.small :deep(.field) {
	grid-column: start/fill;
}
.panel-internal-form :deep(.v-form) {
	margin-bottom: var(--theme--form--row-gap);
}
.form-response {
	border-radius: var(--theme--border-radius);
	border: var(--theme--border-width) solid var(--theme--form--field--input--border-color);
	margin: 1em 0;
	min-width: 300px;
}
.form-response a {
	position: relative;
	display: block;
	padding: var(--theme--form--field--input--padding);
}
.form-response a:hover {
	cursor: pointer;
	background-color: var(--v-list-item-background-color-hover);
}
.form-response a :deep(.v-icon) {
	position: absolute;
	right: var(--theme--form--field--input--padding);
	top: var(--theme--form--field--input--padding);
}
</style>