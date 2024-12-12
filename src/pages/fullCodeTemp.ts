const zip = '90041,US'

// Check if geolocation is available in browser
if("geolocation" in navigator){
    console.log('exists')

    // Get user's current position coordinates
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const long = position.coords.longitude
      getForecast(lat,long)
    }, error)

  } else async () => {
    // Fallback to zip code if geolocation not available
    const geoData = await getCoordsFromZip(zip)
    getForecast(geoData.latt,geoData.longt)
  }


  
  // Convert zip code to coordinates using geocode.xyz API
  const getCoordsFromZip = async (zip) => {
    const res = await fetch(`https://geocode.xyz/${zip}?json=1`)
    const data = await res.json()
    return data
  }
  
  

  

  // Get weather forecast from weather.gov API using coordinates
  async function getForecast(lat,long) {
    const headers = {
      headers:
      {'User-Agent': 'whenrain'}
    }
    const res = await fetch(`https://api.weather.gov/points/${lat},${long}`, headers)
    const pointsData = await res.json()

    const url = pointsData.properties.forecast
    console.log(url)

    const forcast = await fetch(url, headers)
    const forcastData = await forcast.json()

    console.log(forcastData)
  }

  // Handle geolocation errors by falling back to zip code
  async function error(err) {
    console.log(err)
    if(err.code == 1) {
      const message = 'Location access denied. Enter zip code instead, or allow location access.'
    } else {
      const message = 'Something went wrong getting your location. Enter zip code instead.'
    }
    const geoData = await getCoordsFromZip(zip)
    getForecast(geoData.latt,geoData.longt)
  }