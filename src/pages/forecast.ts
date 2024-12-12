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