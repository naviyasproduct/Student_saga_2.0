import path from "path";
import { promises as fs } from "fs";

function resolveDataPath(filename) {
  return path.join(process.cwd(), "data", filename);
}

export async function readJson(filename, fallbackValue) {
  const filePath = resolveDataPath(filename);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err && (err.code === "ENOENT" || err.code === "ENOTDIR")) {
      return fallbackValue;
    }
    throw err;
  }
}

export async function writeJsonAtomic(filename, value) {
  const filePath = resolveDataPath(filename);
  const tmpPath = `${filePath}.tmp`;
  const data = JSON.stringify(value, null, 2);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(tmpPath, data, "utf8");
  await fs.rename(tmpPath, filePath);
}

export async function getUserByEmail(email) {
  const users = await readJson("users.json", []);
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(userId) {
  const users = await readJson("users.json", []);
  return users.find((u) => u.id === userId) || null;
}

export async function createUser(user) {
  const users = await readJson("users.json", []);
  users.push(user);
  await writeJsonAtomic("users.json", users);
  return user;
}

export async function updateUser(userId, patch) {
  const users = await readJson("users.json", []);
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  await writeJsonAtomic("users.json", users);
  return users[idx];
}

export async function addTopup(entry) {
  const topups = await readJson("topups.json", []);
  topups.push(entry);
  await writeJsonAtomic("topups.json", topups);
  return entry;
}
