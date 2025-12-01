import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function authMiddleware(req, res, next){
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Not authenticated' })
  const token = authHeader.split(' ')[1]
  try{
    const secret = process.env.JWT_SECRET || 'change-me'
    const payload = jwt.verify(token, secret)
    // attach userId to request
    req.userId = payload.userId
    // fetch the user once using shared prisma client and attach role
    try{
      const u = await prisma.user.findUnique({ where: { id: req.userId } })
      if (u) req.userRole = u.role
    }catch(dbErr){
      console.error('auth middleware DB error:', dbErr.message || dbErr)
      // If DB is temporarily unreachable, return a 503 so client can retry
      return res.status(503).json({ message: 'Service unavailable' })
    }
    return next()
  }catch(err){
    return res.status(401).json({ message: 'Invalid token' })
  }
}
