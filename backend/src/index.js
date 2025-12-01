import 'dotenv/config'
import app from './app.js'
import { PrismaClient } from '@prisma/client'

const port = process.env.PORT || 4000

// Test DB connection at startup so we can log connection status
const prisma = new PrismaClient()
;(async () => {
	try{
		await prisma.$connect()
		console.log('Prisma: successfully connected to the database')
	}catch(err){
		console.error('Prisma: failed to connect to database:', err.message || err)
		// Do not exit — allow server to start for debugging, but warn the user
	}
	app.listen(port, ()=> console.log(`Backend listening on http://localhost:${port}`))
})()

process.on('SIGINT', async () => {
	try { await prisma.$disconnect() } catch(e){}
	process.exit()
})
