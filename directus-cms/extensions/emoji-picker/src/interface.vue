<template>
	<div ref="rootEl" class="emoji-picker-interface">
		<div class="emoji-picker-input-row">
			<input
				ref="inputEl"
				type="text"
				class="emoji-picker-input"
				:value="value"
				:disabled="disabled"
				placeholder="Type, paste, or pick an emoji…"
				@input="onInput"
			/>
			<button
				type="button"
				class="emoji-picker-toggle"
				:class="{ active: open }"
				:disabled="disabled"
				title="Choose emoji"
				@click="open = !open"
			>
				🙂
			</button>
		</div>

		<div v-if="open" class="emoji-picker-panel">
			<div class="emoji-picker-search-row">
				<input
					v-model="search"
					type="text"
					class="emoji-picker-search"
					placeholder="Search emojis…"
				/>
				<button type="button" class="emoji-picker-close" title="Close" @click="open = false">✕</button>
			</div>

			<div v-if="!search" class="emoji-picker-tabs">
				<button
					v-for="group in groups"
					:key="group.slug"
					type="button"
					class="emoji-picker-tab"
					:class="{ active: activeGroup === group.slug }"
					:title="group.name"
					@click="activeGroup = group.slug"
				>
					{{ group.icon }}
				</button>
			</div>

			<div class="emoji-picker-grid">
				<button
					v-for="item in displayedEmojis"
					:key="item.n + item.e"
					type="button"
					class="emoji-picker-emoji"
					:title="item.n"
					@click="select(item.e)"
				>
					{{ item.e }}
				</button>

				<div v-if="displayedEmojis.length === 0" class="emoji-picker-empty">No emojis found</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import emojiGroups from './emoji-data.json';

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
const activeGroup = ref(emojiGroups[0].slug);

const rootEl = ref(null);
const inputEl = ref(null);

const groups = emojiGroups.map((group) => ({ slug: group.slug, name: group.name, icon: group.icon }));

const displayedEmojis = computed(() => {
	const query = search.value.trim().toLowerCase();

	if (query) {
		const results = [];

		for (const group of emojiGroups) {
			for (const item of group.emojis) {
				if (item.n.toLowerCase().includes(query)) {
					results.push(item);
					if (results.length >= 200) return results;
				}
			}
		}

		return results;
	}

	return emojiGroups.find((group) => group.slug === activeGroup.value)?.emojis ?? [];
});

function onInput(event) {
	const next = event.target.value;
	emit('input', next === '' ? null : next);
}

function select(emoji) {
	const current = props.value ?? '';
	const el = inputEl.value;
	const start = el?.selectionStart ?? current.length;
	const end = el?.selectionEnd ?? current.length;
	const next = current.slice(0, start) + emoji + current.slice(end);

	emit('input', next);

	nextTick(() => {
		if (!el) return;
		const pos = start + emoji.length;
		el.focus();
		el.setSelectionRange(pos, pos);
	});
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
.emoji-picker-interface {
	position: relative;
	max-width: var(--theme--form--column--max-width, 600px);
}

.emoji-picker-input-row {
	display: flex;
	gap: 8px;
}

.emoji-picker-input {
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

.emoji-picker-input:hover {
	border-color: var(--theme--form--field--input--border-color-hover);
}

.emoji-picker-input:focus {
	border-color: var(--theme--primary);
	outline: none;
}

.emoji-picker-input:disabled {
	background-color: var(--theme--form--field--input--background-subdued);
	color: var(--theme--foreground-subdued);
	cursor: not-allowed;
}

.emoji-picker-toggle {
	flex-shrink: 0;
	width: var(--theme--form--field--input--height);
	height: var(--theme--form--field--input--height);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	line-height: 1;
	background-color: var(--theme--form--field--input--background);
	border: var(--theme-border-width, 1px) solid var(--theme--form--field--input--border-color);
	border-radius: var(--theme--border-radius);
	cursor: pointer;
	transition: border-color var(--fast, 0.25s) var(--transition, cubic-bezier(0.25, 0, 0.3, 1));
}

.emoji-picker-toggle:hover,
.emoji-picker-toggle.active {
	border-color: var(--theme--primary);
	background-color: var(--theme--primary-background);
}

.emoji-picker-toggle:disabled {
	cursor: not-allowed;
	opacity: 0.5;
}

.emoji-picker-panel {
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

.emoji-picker-search-row {
	display: flex;
	gap: 8px;
	margin-bottom: 8px;
}

.emoji-picker-search {
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

.emoji-picker-search:focus {
	border-color: var(--theme--primary);
	outline: none;
}

.emoji-picker-close {
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

.emoji-picker-close:hover {
	background-color: var(--theme--background-normal);
	color: var(--theme--foreground);
}

.emoji-picker-tabs {
	display: flex;
	gap: 4px;
	margin-bottom: 8px;
	overflow-x: auto;
	padding-bottom: 4px;
}

.emoji-picker-tab {
	flex-shrink: 0;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	background: none;
	border: var(--theme-border-width, 1px) solid transparent;
	border-radius: var(--theme--border-radius);
	cursor: pointer;
}

.emoji-picker-tab:hover {
	background-color: var(--theme--background-normal);
}

.emoji-picker-tab.active {
	background-color: var(--theme--primary-background);
	border-color: var(--theme--primary-subdued);
}

.emoji-picker-grid {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 2px;
	max-height: 220px;
	overflow-y: auto;
}

.emoji-picker-emoji {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 36px;
	font-size: 20px;
	background: none;
	border: none;
	border-radius: var(--theme--border-radius);
	cursor: pointer;
	transition: background-color 0.1s;
}

.emoji-picker-emoji:hover {
	background-color: var(--theme--background-normal);
}

.emoji-picker-empty {
	grid-column: 1 / -1;
	text-align: center;
	padding: 24px 0;
	color: var(--theme--foreground-subdued);
	font-size: 13px;
}
</style>
