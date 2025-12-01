#!/usr/bin/env node
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
  const email = process.argv[2]
  const password = process.argv[3]
  if (!email || !password){
    console.error('Usage: node set_password.js <email> <newPassword>')
    process.exit(1)
  }
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user){
    console.error('User not found:', email)
    process.exit(1)
  }
  await prisma.user.update({ where: { email }, data: { password: hash } })
  console.log('Password updated for', email)
  await prisma.$disconnect()
}

main().catch(err => { console.error(err); process.exit(1) })
