import { Task } from "~~/server/models/task.model";
import moment from "moment"

/**
 * Check if has more previous records
 * 
 * @param {String|Moment} olderThan
 * @returns 
 */
async function hasPreviousRecords(olderThan){
  return await Task.find({
    deadline_on: {
      $lt: moment(olderThan).startOf('day').toDate()
    }
  }).count() > 0
}

export default defineEventHandler(async (event) => {
  const queries = getQuery(event)

  // Conditionals and sorting
  let conditional = {
    user: event.context.auth
  }
  
  let sorting = {deadline_on: 1}
  if( queries.from ){
    const d = moment(queries.from)
    if( !conditional['deadline_on'] ) conditional['deadline_on']  = {}

    conditional['deadline_on']['$gte'] = d.startOf('day').toDate()
  }

  if( queries.before ){
    const d = moment(queries.before)
    if( !conditional['deadline_on'] ) conditional['deadline_on']  = {}

    conditional['deadline_on']['$lt'] = d.startOf('day').toDate()
    sorting['deadline_on'] = -1
  }

  if( queries.to ){
    const d = moment(queries.to)
    if( !conditional['deadline_on'] ) conditional['deadline_on']  = {}

    conditional['deadline_on']['$lt'] = d.endOf('day').toDate()
  }

  if( queries.deadline_day ){
    if( !conditional['deadline_day'] ) conditional['deadline_day']  = {}

    conditional['deadline_day']['$eq'] = queries.deadline_day
  }

  // Query
  const query = Task.find(conditional).populate('habit', { strictPopulate: false }).sort(sorting)

  if( queries.limit ) query.limit( queries.limit )
  
  // Fetch 
  let data = await query.exec()

  if( queries.unique ){
    let titles = []
    data = data.filter(item => {
      if( !titles.includes(item.title) ){
        titles.push(item.title)
        return true
      }else{
        return false
      }
    })
  }

  return data;
});