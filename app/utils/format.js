module.exports = {
  getDateValues: (currentDate) => {
    const weekDay = currentDate.getDay()
    const userLocalTime = currentDate.toLocaleString('en-GB', {
      timeZone: 'Africa/Lagos'
    })
    const time = userLocalTime.split(', ').pop()
    const hour = parseInt(time.split(':')[0], 10)
    return { weekDay, hour }
  }
}
