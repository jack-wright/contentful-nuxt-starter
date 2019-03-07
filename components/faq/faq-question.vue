<template>
	<div class="c-faq__question-container">
		<div
			class="c-faq__question" 
			@click="open = !open">
			<h3 class="c-faq__question-text">
				{{question.fields.question}}
			</h3>
			<template v-if="chevron">
				<svg :class="['c-faq__icon c-faq__icon--chevron', {'u-rotate--half' : open}]">
					<use xlink:href="#chevron-down" />
				</svg>
			</template>
			<template v-else>
				<span :class="['c-faq__icon c-faq__icon--cross', {'u-rotate--eigth' : open}]">+</span>
			</template>
		</div>
		<div
			class="c-faq__question-answer"
			v-if="open">
			<p class="c-faq__question-answer-text">
				{{question.fields.answer}}
			</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			open: this.expanded,
		}
	},

	props: {
		question: {
			type: Object,
			required: true,
		},
		expanded: {
			type: Boolean,
			default: false,
		},
		chevron: {
			type: Boolean,
			default: false,
		}
	},
}
</script>
