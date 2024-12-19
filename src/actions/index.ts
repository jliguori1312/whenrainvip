import { defineAction } from 'astro:actions'
import { object, z } from 'astro:schema'

const getWhenRain = async (lat: number, long: number) => {
    const headers = {
        headers: {
            'User-Agent': 'whenrainvip'
        }
    }
    const pointsRes = await fetch(`https://api.weather.gov/points/${lat},${long}`, headers)
    const pointsData = await pointsRes.json()

    const url = pointsData.properties.forecast
    const forecastRes = await fetch(url, headers)
    const forecastData = await forecastRes.json()

    const periods = forecastData.properties.periods
    const nextRain = periods.find(period =>
        period.probabilityOfPrecipitation.value &&
        period.probabilityOfPrecipitation.value > 50
    )
    if (nextRain) {
        return {
            willRain: true,
            when: nextRain.name
        }
    }
    return {
        willRain: false,
        when: "none :("
    }
}

export const server = {
    getForecast: defineAction({
        input: z.discriminatedUnion('type', [
            z.object({
                type: z.literal('zip'),
                zip: z.string(),
            }),
            z.object({
                type: z.literal('coords'),
                coords: z.object({
                    lat: z.number(),
                    long: z.number()
                })
            })
        ]),
        handler: async (input) => {
            if (input.type === 'zip') {
                const geoRes = await fetch(`https://geocode.xyz/${input.zip},US?json=1`)
                const { latt: lat, longt: long } = await geoRes.json()
                return await getWhenRain(lat, long)
            }
            if (input.type === 'coords') {
                const { lat, long } = input.coords
                return await getWhenRain(lat, long)
            }

            return 'bad request'
        }
        
    }),
    
}