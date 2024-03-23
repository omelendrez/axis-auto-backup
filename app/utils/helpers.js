const { WORKING_TIME_RANGE, WORKING_WEEK_DAYS } = require('./constants')
const { getDateValues } = require('./format')

module.exports = {
  isWorkingTime: (currentDate) => {
    const { weekDay, hour } = getDateValues(currentDate)

    return (
      WORKING_WEEK_DAYS.includes(weekDay) &&
      hour >= WORKING_TIME_RANGE.FROM &&
      hour <= WORKING_TIME_RANGE.TO
    )
  }
}
