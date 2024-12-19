<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="showZipInput">
        <input type="text" v-model.number.trim="zip" placeholder="Enter zip code" />
    </div>
    <div v-else-if="willRain.data.willRain">
        <p>The next rain will be: {{ willRain.data.when }}</p>
    </div>
    <div v-else>No rain for atleast a week :(</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { actions } from 'astro:actions'

const loading = ref(true)
const error = ref(null)
const willRain = ref(null)
const showZipInput = ref(false)
const zip = ref('')

onMounted(() => {
    // Check if geolocation is available in browser
    if ("geolocation" in navigator) {
        console.log('exists')

        // Get user's current position coordinates
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude
            const long = position.coords.longitude
            const req = {
                type: 'coords',
                coords: {
                    lat,
                    long,
                }
            }
            willRain.value = await actions.getForecast(req)
            loading.value = false
            console.log(willRain.value.data.when)
        }, locateError)

    }
    else {
        // Fallback to zip code if geolocation not available
        rainFromZip()
    }

    async function rainFromZip() {
        loading.value = false
        showZipInput.value = true

        watch(zip, async (inputZip) => {
            if (inputZip.toString().length === 5) {
                console.log('zip', inputZip)
                showZipInput.value = false
                loading.value = true

                const req = {
                    type: 'zip',
                    zip: inputZip.toString()
                }
                willRain.value = await actions.getForecast(req)
                loading.value = false
                console.log(willRain.value.data.when)

            }
            else {
                console.log(inputZip)
            }
        })
    }
    function locateError() {
        rainFromZip()
    }
})
</script>