<template>
	<div ref="rootEl" class="icon-picker-interface">
		<div class="icon-picker-input-row">
			<input
				ref="inputEl"
				type="text"
				class="icon-picker-input"
				:value="value"
				:disabled="disabled"
				placeholder="Icon name (e.g. Airplane)…"
				@input="onInput"
			/>
			<button
				type="button"
				class="icon-picker-toggle"
				:class="{ active: open }"
				:disabled="disabled"
				title="Choose icon"
				@click="open = !open"
			>
				<svg v-if="currentIcon" viewBox="0 0 256 256" class="icon-picker-svg" v-html="currentIcon.svg"></svg>
				<span v-else class="icon-picker-placeholder">—</span>
			</button>
		</div>

		<div v-if="open" class="icon-picker-panel">
			<div class="icon-picker-search-row">
				<input
					v-model="search"
					type="text"
					class="icon-picker-search"
					placeholder="Search icons…"
				/>
				<button type="button" class="icon-picker-close" title="Close" @click="open = false">✕</button>
			</div>

			<div v-if="!search" class="icon-picker-tabs">
				<button
					v-for="group in groups"
					:key="group.slug"
					type="button"
					class="icon-picker-tab"
					:class="{ active: activeGroup === group.slug }"
					:title="group.name"
					@click="activeGroup = group.slug"
				>
					<svg viewBox="0 0 256 256" v-html="group.icon"></svg>
				</button>
			</div>

			<div class="icon-picker-grid">
				<button
					v-for="item in displayedIcons"
					:key="item.n"
					type="button"
					class="icon-picker-icon"
					:class="{ active: item.n === value }"
					:title="item.n"
					@click="select(item.n)"
				>
					<svg viewBox="0 0 256 256" v-html="item.svg"></svg>
				</button>

				<div v-if="displayedIcons.length === 0" class="icon-picker-empty">No icons found</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import iconGroups from './icon-data.json';

const props = defineProps({
	value: {
		type: String,
		default: null,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['input']);

const open = ref(false);
const search = ref('');
const activeGroup = ref(iconGroups[0].slug);

const rootEl = ref(null);
const inputEl = ref(null);

const groups = iconGroups.map((group) => ({ slug: group.slug, name: group.name, icon: group.icon }));

const iconMap = (() => {
	const map = {};
	for (const group of iconGroups) {
		for (const item of group.items) {
			map[item.n] = item;
		}
	}
	return map;
})();

const currentIcon = computed(() => (props.value ? iconMap[props.value] : null));

const displayedIcons = computed(() => {
	const query = search.value.trim().toLowerCase();

	if (query) {
		const results = [];

		for (const group of iconGroups) {
			for (const item of group.items) {
				if (item.n.toLowerCase().includes(query) || item.s.includes(query)) {
					results.push(item);
					if (results.length >= 200) return results;
				}
			}
		}

		return results;
	}

	return iconGroups.find((group) => group.slug === activeGroup.value)?.items ?? [];
});

function onInput(event) {
	const next = event.target.value;
	emit('input', next === '' ? null : next);
}

function select(name) {
	emit('input', name);
}

function onClickOutside(event) {
	if (rootEl.value && !rootEl.value.contains(event.target)) {
		open.value = false;
	}
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside));
</script>

<style scoped>
.icon-picker-interface {
	position: relative;
	max-width: var(--theme--form--column--max-width, 600px);
}

.icon-picker-input-row {
	display: flex;
	gap: 8px;
}

.icon-picker-input {
	flex: 1;
	min-width: 0;
	height: var(--theme--form--field--input--height);
	padding: 0 12px;
	background-color: var(--theme--form--field--input--background);
	border: var(--theme-border-width, 1px) solid var(--theme--form--field--input--border-color);
	border-radius: var(--theme--border-radius);
	color: var(--theme--foreground);
	font-family: inherit;
	font-size: 14px;
	transition: border-color var(--fast, 0.25s) var(--transition, cubic-bezier(0.25, 0, 0.3, 1));
}

.icon-picker-input:hover {
	border-color: var(--theme--form--field--input--border-color-hover);
}

.icon-picker-input:focus {
	border-color: var(--theme--primary);
	outline: none;
}

.icon-picker-input:disabled {
	background-color: var(--theme--form--field--input--background-subdued);
	color: var(--theme--foreground-subdued);
	cursor: not-allowed;
}

.icon-picker-toggle {
	flex-shrink: 0;
	width: var(--theme--form--field--input--height);
	height: var(--theme--form--field--input--height);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--theme--foreground-subdued);
	background-color: var(--theme--form--field--input--background);
	border: var(--theme-border-width, 1px) solid var(--theme--form--field--input--border-color);
	border-radius: var(--theme--border-radius);
	cursor: pointer;
	transition: border-color var(--fast, 0.25s) var(--transition, cubic-bezier(0.25, 0, 0.3, 1));
}

.icon-picker-toggle:hover,
.icon-picker-toggle.active {
	border-color: var(--theme--primary);
	background-color: var(--theme--primary-background);
	color: var(--theme--primary);
}

.icon-picker-toggle:disabled {
	cursor: not-allowed;
	opacity: 0.5;
}

.icon-picker-svg {
	width: 20px;
	height: 20px;
	fill: currentColor;
}

.icon-picker-placeholder {
	font-size: 16px;
	line-height: 1;
}

.icon-picker-panel {
	position: absolute;
	z-index: 10;
	top: calc(100% + 4px);
	left: 0;
	width: 320px;
	max-width: 90vw;
	background-color: var(--theme--background);
	border: var(--theme-border-width, 1px) solid var(--theme--border-color);
	border-radius: var(--theme--border-radius);
	box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
	padding: 12px;
}

.icon-picker-search-row {
	display: flex;
	gap: 8px;
	margin-bottom: 8px;
}

.icon-picker-search {
	flex: 1;
	min-width: 0;
	height: 36px;
	padding: 0 10px;
	background-color: var(--theme--form--field--input--background);
	border: var(--theme-border-width, 1px) solid var(--theme--form--field--input--border-color);
	border-radius: var(--theme--border-radius);
	color: var(--theme--foreground);
	font-family: inherit;
	font-size: 13px;
}

.icon-picker-search:focus {
	border-color: var(--theme--primary);
	outline: none;
}

.icon-picker-close {
	flex-shrink: 0;
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	color: var(--theme--foreground-subdued);
	cursor: pointer;
	border-radius: var(--theme--border-radius);
}

.icon-picker-close:hover {
	background-color: var(--theme--background-normal);
	color: var(--theme--foreground);
}

.icon-picker-tabs {
	display: flex;
	gap: 4px;
	margin-bottom: 8px;
	overflow-x: auto;
	padding-bottom: 4px;
}

.icon-picker-tab {
	flex-shrink: 0;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--theme--foreground-subdued);
	background: none;
	border: var(--theme-border-width, 1px) solid transparent;
	border-radius: var(--theme--border-radius);
	cursor: pointer;
}

.icon-picker-tab svg {
	width: 18px;
	height: 18px;
	fill: currentColor;
}

.icon-picker-tab:hover {
	background-color: var(--theme--background-normal);
	color: var(--theme--foreground);
}

.icon-picker-tab.active {
	background-color: var(--theme--primary-background);
	border-color: var(--theme--primary-subdued);
	color: var(--theme--primary);
}

.icon-picker-grid {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 2px;
	max-height: 220px;
	overflow-y: auto;
}

.icon-picker-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 36px;
	color: var(--theme--foreground);
	background: none;
	border: none;
	border-radius: var(--theme--border-radius);
	cursor: pointer;
	transition: background-color 0.1s;
}

.icon-picker-icon svg {
	width: 20px;
	height: 20px;
	fill: currentColor;
}

.icon-picker-icon:hover {
	background-color: var(--theme--background-normal);
}

.icon-picker-icon.active {
	background-color: var(--theme--primary-background);
	color: var(--theme--primary);
}

.icon-picker-empty {
	grid-column: 1 / -1;
	text-align: center;
	padding: 24px 0;
	color: var(--theme--foreground-subdued);
	font-size: 13px;
}
</style>
