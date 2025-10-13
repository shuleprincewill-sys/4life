import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function createToken(userId: string, role: UserRole) {
  return jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      fullName: z.string().min(2),
      role: z.nativeEnum(UserRole),
      phone: z.string().optional(),
    });
    const body = bodySchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        fullName: body.fullName,
        role: body.role,
        phone: body.phone,
      },
    });

    if (body.role === 'PATIENT') {
      await prisma.patient.create({ data: { userId: user.id } });
    }

    const token = createToken(user.id, user.role);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid request' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const bodySchema = z.object({ email: z.string().email(), password: z.string() });
    const body = bodySchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = createToken(user.id, user.role);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid request' });
  }
});

// Drugs search
app.get('/api/drugs/search', async (req, res) => {
  try {
    const querySchema = z.object({ q: z.string().min(1), lat: z.string().optional(), lng: z.string().optional() });
    const q = querySchema.parse(req.query);

    const drugs = await prisma.drug.findMany({ where: { name: { contains: q.q, mode: 'insensitive' } }, take: 20 });
    res.json({ drugs });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid request' });
  }
});

// Inventory availability near coordinates
app.get('/api/inventory/nearby', async (req, res) => {
  try {
    const querySchema = z.object({ drugId: z.string(), lat: z.coerce.number(), lng: z.coerce.number(), radiusKm: z.coerce.number().default(10) });
    const q = querySchema.parse(req.query);

    // Simple distance calc on app side; production should use PostGIS earthdistance
    const inventories = await prisma.inventory.findMany({
      where: { drugId: q.drugId, stock: { gt: 0 } },
      include: { pharmacy: true, drug: true },
      take: 50,
    });

    function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
      const toRad = (v: number) => (v * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    const results = inventories
      .map((inv) => {
        const distanceKm = haversineKm(q.lat, q.lng, inv.pharmacy.latitude, inv.pharmacy.longitude);
        return { ...inv, distanceKm };
      })
      .filter((inv) => inv.distanceKm <= q.radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ results });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid request' });
  }
});

// Minimal orders endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const bodySchema = z.object({
      patientId: z.string(),
      pharmacyId: z.string(),
      items: z.array(z.object({ drugId: z.string(), quantity: z.number().int().positive(), priceCfa: z.number().int().positive() })),
      totalCfa: z.number().int().positive(),
    });
    const body = bodySchema.parse(req.body);

    const order = await prisma.order.create({
      data: {
        patientId: body.patientId,
        pharmacyId: body.pharmacyId,
        totalCfa: body.totalCfa,
        items: { createMany: { data: body.items } },
      },
      include: { items: true },
    });

    res.json({ order });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid request' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Camepharm backend running on http://localhost:${port}`);
});
