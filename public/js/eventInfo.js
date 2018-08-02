const openEventInfo = (id) =>{
  hideAll()
  //Make a request for the info on this particular event using the id
  console.log('GET detailed event info ', id)
  $('#info').removeAttr('hidden')
}