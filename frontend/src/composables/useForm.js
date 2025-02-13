import { ref, reactive } from 'vue'

export function useForm(initialValues = {}, validationRules = {}) {
  const form = reactive({ ...initialValues })
  const errors = ref({})
  const isSubmitting = ref(false)

  const validate = () => {
    errors.value = {}
    let isValid = true

    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field]
      const value = form[field]

      // Required validation
      if (rules.required && !value) {
        errors.value[field] = `${field} is required`
        isValid = false
      }

      // Email validation
      if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.value[field] = 'Please enter a valid email'
        isValid = false
      }

      // Min length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors.value[field] = `${field} must be at least ${rules.minLength} characters`
        isValid = false
      }

      // Custom validation
      if (rules.validate && !rules.validate(value)) {
        errors.value[field] = rules.message || `${field} is invalid`
        isValid = false
      }
    })

    return isValid
  }

  const resetForm = () => {
    Object.keys(form).forEach(key => {
      form[key] = initialValues[key]
    })
    errors.value = {}
  }

  return {
    form,
    errors,
    isSubmitting,
    validate,
    resetForm
  }
}