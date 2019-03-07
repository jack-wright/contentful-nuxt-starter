<template>
	<div class="c-faq__section">
		<h2 class="c-faq__section-title">
			{{section.fields.section}}
		</h2>
		<hr class="c-faq__section-hr" />
		<faq-question
			v-for="(question, index) in section.fields.questions"
			:key="index"
			:question="question"
			:chevron=true />
	</div>
</template>

<script>
import FaqQuestion from './faq-question'

export default {
	components: {
		FaqQuestion
	},

	props: {
		section: {
			type: Object,
			required: true,
		}
	},
}
</script>
