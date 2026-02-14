// src/api/base44Client.js

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const db = {
  RefurbCertificate: load("RefurbCertificate", []),
  RefurbProcessRun: load("RefurbProcessRun", []),
  RefurbProcessTemplate: load("RefurbProcessTemplate", []),
  RefurbStepResult: load("RefurbStepResult", []),
}

const persist = (entity) => save(entity, db[entity])

const matchWhere = (row, where) => {
  if (!where) return true
  for (const [k, v] of Object.entries(where)) {
    if (v === undefined) continue
    if (row?.[k] !== v) return false
  }
  return true
}

const applyQuery = (rows, query) => {
  // Accept:
  // - function predicate
  // - { field: value } simple where
  // - { where: {...}, limit, orderBy: {field, direction} }
  if (!query) return rows

  if (typeof query === "function") return rows.filter(query)

  // Allow list('-created_date') shorthand used by some pages
  if (typeof query === 'string') {
    const str = query.trim()
    if (str.length > 0) {
      const desc = str.startsWith('-')
      const field = desc ? str.slice(1) : str
      return applyQuery(rows, { orderBy: { field, direction: desc ? 'desc' : 'asc' } })
    }
    return rows
  }

  const where = query.where ?? query
  let out = rows.filter((r) => matchWhere(r, where))

  const orderBy = query.orderBy
  if (orderBy?.field) {
    const dir = (orderBy.direction ?? "asc").toLowerCase()
    const f = orderBy.field
    out.sort((a, b) => {
      const av = a?.[f]
      const bv = b?.[f]
      if (av === bv) return 0
      if (av === undefined) return 1
      if (bv === undefined) return -1
      return dir === "desc" ? (av < bv ? 1 : -1) : (av < bv ? -1 : 1)
    })
  }

  if (typeof query.limit === "number") out = out.slice(0, query.limit)
  return out
}

const makeEntityApi = (entity) => ({
  async list(query) {
    return applyQuery([...db[entity]], query)
  },
  async filter(query) {
    return applyQuery([...db[entity]], query)
  },
  async first(query) {
    const out = applyQuery([...db[entity]], query)
    return out[0] ?? null
  },
  async count(query) {
    const out = applyQuery([...db[entity]], query)
    return out.length
  },
  async get(id) {
    return db[entity].find((x) => x.id === id) ?? null
  },
  async create(data) {
    const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...data }
    db[entity].unshift(row)
    persist(entity)
    return row
  },
  async update(id, patch) {
    const i = db[entity].findIndex((x) => x.id === id)
    if (i === -1) throw new Error(`${entity} not found`)
    db[entity][i] = { ...db[entity][i], ...patch, updated_at: new Date().toISOString() }
    persist(entity)
    return db[entity][i]
  },
  async remove(id) {
    const i = db[entity].findIndex((x) => x.id === id)
    if (i === -1) return true
    db[entity].splice(i, 1)
    persist(entity)
    return true
  },
  // alias for some pages that call `.delete`
  async delete(id) {
    return this.remove(id)
  },
})

export const base44 = {
  auth: {
    async me() {
      return { id: "static-user", name: "Static User" }
    },
  },
  entities: {
    RefurbCertificate: makeEntityApi("RefurbCertificate"),
    RefurbProcessRun: makeEntityApi("RefurbProcessRun"),
    RefurbProcessTemplate: makeEntityApi("RefurbProcessTemplate"),
    RefurbStepResult: makeEntityApi("RefurbStepResult"),
  },
}

export default base44
