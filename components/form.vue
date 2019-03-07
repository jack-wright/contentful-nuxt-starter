<template>
    <div>
        <form
            :id="`${type}-form`"
            class="c-form"
            method="POST">
            <fieldset
                class="c-form__fieldset"
                name="name">
                <label
                    v-if="labels"
                    for="name"
                    class="c-form__label">
                    {{lang.forms.contact.fields.name}}
                    <span v-if="formInputs.name.required">
                        *
                    </span>
                </label>
                <input
                    id="name"
                    v-model="formInputs.name.value"
                    :class="['c-form__field c-form__field--input',
                             {'u-error--input': submit && !formInputs.name.value}]"
                    type="text"
                    name="name"
                    placeholder="Name"
                    :required="formInputs.name.required" />
                <small
                    v-if="submit && !formInputs.name.value"
                    class="u-error">
                    {{formInputs.name.error}}
                </small>
            </fieldset>
            <fieldset
                class="c-form__fieldset"
                name="email">
                <label
                    v-if="labels"
                    for="email"
                    class="c-form__label">
                    {{lang.forms.contact.fields.email}}
                    <span v-if="formInputs.email.required">
                        *
                    </span>
                </label>
                <input
                    id="email"
                    v-model="formInputs.email.value"
                    :class="['c-form__field c-form__field--input',
                             {'u-error--input': (submit && !formInputs.email.value) || formInputs.email.validation}]"
                    type="email"
                    name="email"
                    placeholder="Email address"
                    :required="formInputs.email.required"
                    @blur="emailValidation" />
                <small
                    v-if="formInputs.email.validation && formInputs.email.value"
                    class="u-error">
                    {{formInputs.email.validation}}
                </small>
                <small
                    v-if="submit && !formInputs.email.value"
                    class="u-error">
                    {{formInputs.email.error}}
                </small>
            </fieldset>
            <fieldset
                class="c-form__fieldset"
                name="subject">
                <label
                    v-if="labels && type === 'contact'"
                    for="subject"
                    class="c-form__label">
                    {{lang.forms.contact.fields.subject}}
                    <span v-if="formInputs.subject.required">
                        *
                    </span>
                </label>
                <input
                    id="subject"
                    v-model="formInputs.subject.value"
                    :class="['c-form__field c-form__field--input',
                             {'u-error--input': submit && !formInputs.subject.value}]"
                    :type="type === 'contact'
                        ? 'text'
                        : 'hidden'"
                    name="subject"
                    placeholder="Subject"
                    :required="formInputs.subject.required" />
                <small
                    v-if="submit && !formInputs.subject.value"
                    class="u-error">
                    {{formInputs.subject.error}}
                </small>
            </fieldset>
            <fieldset
                v-if="type === 'contact'"
                class="c-form__fieldset"
                name="message">
                <label
                    v-if="labels"
                    for="message"
                    class="c-form__label">
                    {{lang.forms.contact.fields.message}}
                    <span v-if="formInputs.message.required">
                        *
                    </span>
                </label>
                <textarea
                    id="message"
                    v-model="formInputs.message.value"
                    :class="['c-form__field c-form__field--textarea',
                             {'u-error--input': submit && !formInputs.message.value}]"
                    rows="6"
                    name="message"
                    placeholder="Your message"
                    :required="formInputs.message.required"></textarea>
                <small
                    v-if="submit && !formInputs.message.value"
                    class="u-error">
                    {{formInputs.message.error}}
                </small>
            </fieldset>
            <fieldset
                class="c-form__fieldset"
                name="recaptcha">
                <vue-recaptcha
                    ref="recaptcha"
                    class="c-form__field c-form__field--recaptcha"
                    :sitekey="settings.recaptchaSiteKey"
                    @verify="onVerify"
                    @expired="onExpired" />
                <small
                    v-if="submit && !formInputs.recaptcha.value"
                    class="u-error">
                    {{formInputs.recaptcha.error}}
                </small>
            </fieldset>
            <button
                :disabled="!isFormValid"
                :class="['u-button', {'u-button--disabled': !isFormValid}]"
                @click.prevent="submitForm">
                <span v-if="loading">
                    {{lang.forms.contact.sending}}
                </span>
                <span v-else>
                    {{lang.forms.contact.send}}
                </span>
            </button>
        </form>
        <div
            v-if="response.value"
            :class="['c-form__response', 'u-alert', [response.success ? 'u-alert--success u-success' : 'u-alert--error u-error']]"
            role="alert">
            <template v-if="response.success">
                {{response.successMessage}}
            </template>
            <template v-else>
                {{response.errorMessage}}
            </template>
            <button
                aria-label="close"
                :class="['u-alert__close',[response.success ? 'u-alert__close--success' : 'u-alert__close--error']]"
                @click="closeAlert">
                &times;
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import FormSubmitHandler from '@/plugins/gtm/form-submit-handler.js'
import VueRecaptcha from 'vue-recaptcha'

export default {
    components: {
        VueRecaptcha
    },

    props: {
        type: {
            type: String,
            default: 'contact'
        },
        eventName: {
            type: String,
            default: null,
        },
        labels: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            formInputs: {
                message: {
                    value: this.type === 'eventRegistration' ? `Registration for event: ${this.eventName}` : '',
                    error: 'You need to enter a message before you submit',
                    required: true,
                },
                subject: {
                    value: this.type === 'eventRegistration' ? `Registration for event: ${this.eventName}` : '',
                    error: 'Please enter a subject for your message',
                    required: true,
                },
                email: {
                    value: '',
                    error: 'Please enter your email',
                    required: true,
                    validation: '',
                },
                name: {
                    value: '',
                    error: 'Please enter your name',
                    required: true,
                },
                recaptcha: {
                    value: true,
                    error: 'Please check the box on the recaptcha field',
                    required: true,
                },
            },
            submit: false,
            loading: false,
            response: {
                value: false,
                success: false,
                errorMessage: 'Your message has not been sent',
                successMessage: 'Thank you, your message has been sent! Someone will be in touch soon',
            }
        }
    },

    computed: {
        lang() {
            return this.$store.state.lang
        },
        settings() {
            return this.$store.state.settings
        },
        /**
             * Check to see whether all fields have a value and that any validation rules pass
             */
        isFormValid() {
            // Filter form inputs to make sure all of the required field's values are set
            if (Object.keys(this.formInputs)
                .filter(key => this.formInputs[key].required && !this.formInputs[key].value).length) {
                return false
            }
            if (!this.formInputs.email.validation) {
                return true
            } else {
                return false
            }
        },
    },

    methods: {
        /**
             * Get the subject value dependant on what the form type is
             */
        subjectValue() {
            return this.type === 'eventRegistration'
                ? `Registration for event: ${this.eventName}`
                : ''
        },

        /**
             * Run through the process for submitting the form
             */
        submitForm() {
            this.submit = true

            if (this.isFormValid) {
                this.postData()
                this.submit = false
            }
        },

        /**
             * Post the form data to the forms endpoint
             */
        postData() {
            this.loading = true
            this.registerFormSubmit({
                'event': 'formSubmission'
            }, {
                'debug': false
            })

            const parameters = {
                type: this.type,
                name: this.formInputs.name.value,
                subject: this.formInputs.subject.value,
                email: this.formInputs.email.value,
                message: this.formInputs.message.value,
                recaptchaToken: this.formInputs.recaptcha.value
            }

            axios.post('/forms/', qs.stringify(parameters))
                .then(response => {
                    this.loading = false
                    this.response.value = response.data
                    if (response.data.success) {
                        this.response.success = true
                        this.resetForm()
                    }
                }).catch(error => {
                    console.log(error);
                    this.loading = false
                    this.response.value = true
                })
        },

        /**
             * Event handler for the recaptcha to check if verified
             * @param string - response is the token the recaptcha generates
             */
        onVerify(response) {
            this.formInputs.recaptcha.value = response
        },

        /**
             * Event handler for the recaptcha checking if the field has
             * expired due to timeout
             */
        onExpired() {
            this.$refs.recaptcha.reset()
        },

        /**
             * Reset all fields on the form so that it can be used again
             */
        resetForm() {
            // Reset the recaptcha field
            this.$refs.recaptcha.reset()

            // Reset the value of each input field
            const inputFields = Object.keys(this.formInputs)

            for (let i = 0; i < inputFields.length; i++) {
                this.formInputs[inputFields[i]].value = ''
            }
            this.loading = false
        },

        /**
             * Close the alert by resetting the response
             */
        closeAlert() {
            this.response.value = ''
            this.response.success = false
        },

        /**
             * Check whether or not the email entered is a valid email address
             */
        emailValidation() {
            if (this.formInputs.email.value.length > 0) {
                let emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                let validated = emailRegex.test(this.formInputs.email.value) ? true : false

                validated ? this.formInputs.email.validation = '' : this.formInputs.email.validation = 'You have entered an invalid email address'
            } else {
                this.formInputs.email.validation = ''
            }
        },

        /**
         * Push a form submit to the data layer for Google Tag Manager
         */
        registerFormSubmit(data, config) {
            new FormSubmitHandler(data, config)
        }
    }
}
</script>
