import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'

export const server = {
    getForecast: defineAction({
        input: z.object({
            zip: z.string(),
        }),
        handler: async (input) => {
            //const geoData = await getCoordsFromZip(input.zip)
            //getForecast(geoData.latt,geoData.longt)

            return 'this is a zip test'
        }
        
    }),
    
}