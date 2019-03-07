<template>
	<div class="c-faq__container">
		<faq-section
			v-for="(section, index) in sections"
			:section="section"
			:key="`section-${index}`" />
	</div>
</template>

<script>
import FaqSection from './faq-section'

export default {
	components: {
		FaqSection
	},

	props: {
		sections: {
			type: Array,
			required: true,
		}
	},
}
</script>
