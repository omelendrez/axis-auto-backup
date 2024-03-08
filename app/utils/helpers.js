const { WORKING_TIME_RANGE, WORKING_WEEK_DAYS } = require('./constants')

module.exports = {
  isWorkingTime: (currentDate) => {
    const weekDay = currentDate.getDay()
    const userLocalTime = currentDate.toLocaleString('en-GB', {
      timeZone: 'Africa/Lagos'
    })
    const time = userLocalTime.split(', ').pop()
    const hour = parseInt(time.split(':')[0], 10)

    return (
      WORKING_WEEK_DAYS.includes(weekDay) &&
      hour >= WORKING_TIME_RANGE.FROM &&
      hour <= WORKING_TIME_RANGE.TO
    )
  }
}
