import jwt from 'jsonwebtoken'

export async function authMiddleware(req, res, next){
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Not authenticated' })
  const token = authHeader.split(' ')[1]
  try{
    const secret = process.env.JWT_SECRET || 'change-me'
    const payload = jwt.verify(token, secret)
    // attach userId to request
    req.userId = payload.userId
    // also fetch the user and attach role
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    const u = await prisma.user.findUnique({ where: { id: req.userId } })
    if (u) req.userRole = u.role
    next()
  }catch(err){
    res.status(401).json({ message: 'Invalid token' })
  }
}
