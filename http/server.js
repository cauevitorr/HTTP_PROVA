import http from 'node:http'

const PORT = 3333

const participantes = []

const server = http.createServer((request, response) => {
 const { method, url } = request

 response.setHeader('Access-Control-Allow-Origin', '*')
 response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
 response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

 if (method === 'GET' && url === '/participantes') {
  response.writeHead(200, { "Content-Type": "application/json" })
  response.end(JSON.stringify(participantes))
 } else if (method === 'GET' && url.startsWith('/participantes/')) {
  const id = parseInt(url.split('/')[2])
  const participante = participantes.find((participante) => participante.id === id)
  if (!participante) {
   response.writeHead(404, { "Content-Type": "application/json" })
   response.end(JSON.stringify({ massage: 'Participante não existe' }))
   return
  }
  response.writeHead(200, { "Content-Type": "application/json" })
  response.end(JSON.stringify(participante))
 } else if (method === 'POST' && url === '/participantes') {
  let body = ''
  request.on('data', (chunk) => {
   body += chunk.toString()
  })
  request.on('end', () => {

   const novoParticipante = JSON.parse(body)

   if (novoParticipante.idade === 16 || novoParticipante.idade < 16) {
    response.writeHead(403, { "Content-Type": "application/json" })
    response.end(JSON.stringify({ massage: 'Participante sem a faixa etária exigida' }))
    return
   }
   novoParticipante.id = participantes.length + 1
   participantes.push(novoParticipante)
   response.writeHead(201, { "Content-Type": "application/json" })
   response.end(JSON.stringify(novoParticipante))
  })

 } else if (method === 'PUT' && url.startsWith('/participantes/')) {
  const id = parseInt(url.split('/')[2])
  let body = ''
  request.on('data', (chunk) =>
   body += chunk.toString())
  request.on('end', () => {
   const participanteAtulizado = JSON.parse(body)
   const indexParticipante = participantes.findIndex((participantes) => participantes.id === id)

   if (indexParticipante) {
    response.writeHead(404, { "Content-Type": "application/json" })
    response.end(JSON.stringify({ message: 'Participante não existe' }))
    return
   }

   participantes[indexParticipante] = { ...participantes[indexParticipante], ...participanteAtulizado }
   response.writeHead(200, { "Content-Type": "applicaton/json" })
   response.end(JSON.stringify(participantes[indexParticipante]))
  })
 } else if (method === 'DELETE' && url.startsWith("/participantes/")) {
  const id = parseInt(url.split('/')[2])
  const encontrarParicipante = participantes.findIndex((participante) => participante.id === id)
  if (encontrarParicipante === -1) {
   response.writeHead(404, { "Content-Type": "application/json" })
   response.end(JSON.stringify({ message: 'Participante não existe' }))
   return
  }
  participantes.splice(encontrarParicipante, 1)
  response.writeHead(200, { "Content-Type": "application/json" })
  response.end(JSON.stringify({ message: 'Participante Deletado' }))
 } else if (method === 'GET' && url === '/participantesNumeroTotal') {
  response.writeHead(200, { "Content-Type": "application/json" })
  response.end(JSON.stringify(`Total de participantes: ${participantes.length}`))
 } else if (method === 'GET' && url === '/participantesNumeroTotal18') {
  const maiores18 = participantes.filter((participante) => participante.idade === 18 || participante.idade > 18)
  response.writeHead(201, { "Content-Type": "application/json" })
  response.end(JSON.stringify(`Total de pessoas com 18 anos ou mais: ${maiores18.length}`))
 } else if(method === 'GET' && url === '/participantesCidade'){
 
  const cidade = participantes.find((participante)=>participante.cidade)
  console.log(cidade)
 } else {
  response.writeHead(404, { "content-Type": "application/json" })
  response.end(JSON.stringify({ message: 'Rota Não Existe' }))
 }

})

server.listen(PORT, () => {
 console.log(`Servidor on PORT ${PORT}👍`)
})
