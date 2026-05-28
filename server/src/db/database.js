import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { config } from '../config.js';
import { calculateLeadScore } from '../utils/scoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../', config.dbFile);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

sqlite3.verbose();
export const db = new sqlite3.Database(dbPath);

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

async function leadColumns() {
  return all('PRAGMA table_info(leads)');
}

function legacyBudgetRange(budget) {
  const value = Number(budget) || 0;
  if (value >= 10000000) return 'above_1_crore';
  if (value >= 5000000) return '50_lakhs_1_crore';
  if (value >= 2500000) return '25_50_lakhs';
  return 'below_25_lakhs';
}

function legacyQuestionsRange(questionsAsked) {
  const value = Number(questionsAsked) || 0;
  if (value >= 5) return '5_plus';
  if (value >= 2) return '2_4';
  return '0_1';
}

function legacyStage(followUpStatus) {
  return {
    pending: 'new',
    contacted: 'contacted',
    brochure_sent: 'contacted',
    site_visit_scheduled: 'site_visit_scheduled',
    converted: 'converted',
    lost: 'lost'
  }[followUpStatus] || 'new';
}

async function migrateLeadsTable() {
  const existing = await get("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'leads'");
  if (!existing) {
    await createLeadsTable('leads');
    return;
  }

  const columns = await leadColumns();
  const hasNewSchema = columns.some((column) => column.name === 'budgetRange') && columns.some((column) => column.name === 'assignedAgent');
  if (hasNewSchema) return;

  const legacyLeads = await all('SELECT * FROM leads ORDER BY id');
  await run('ALTER TABLE leads RENAME TO leads_legacy');
  await createLeadsTable('leads');

  for (const oldLead of legacyLeads) {
    const lead = {
      name: oldLead.name,
      phone: oldLead.phone,
      budgetRange: legacyBudgetRange(oldLead.budget),
      timeline: oldLead.urgency === 'immediate' ? 'immediately' : oldLead.urgency || 'within_1_month',
      purpose: 'investment',
      preferredLocation: oldLead.preferredLocation,
      questionsAsked: legacyQuestionsRange(oldLead.questionsAsked),
      siteVisitInterest: oldLead.siteVisitInterest === 'yes' ? 'yes' : 'no',
      assignedAgent: 'Ramesh',
      followUpDate: new Date().toISOString().slice(0, 10),
      stage: legacyStage(oldLead.followUpStatus),
      notes: oldLead.notes || ''
    };
    const { score, status } = calculateLeadScore(lead);
    await run(
      `INSERT INTO leads
       (name, phone, budgetRange, timeline, purpose, preferredLocation, questionsAsked, siteVisitInterest, assignedAgent, followUpDate, stage, notes, score, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), COALESCE(?, CURRENT_TIMESTAMP))`,
      [
        lead.name,
        lead.phone,
        lead.budgetRange,
        lead.timeline,
        lead.purpose,
        lead.preferredLocation,
        lead.questionsAsked,
        lead.siteVisitInterest,
        lead.assignedAgent,
        lead.followUpDate,
        lead.stage,
        lead.notes,
        score,
        status,
        oldLead.createdAt,
        oldLead.updatedAt
      ]
    );
  }

  await run('DROP TABLE leads_legacy');
}

async function createLeadsTable(tableName) {
  await run(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      budgetRange TEXT NOT NULL,
      timeline TEXT NOT NULL,
      purpose TEXT NOT NULL,
      preferredLocation TEXT NOT NULL,
      questionsAsked TEXT NOT NULL,
      siteVisitInterest TEXT NOT NULL DEFAULT 'no',
      assignedAgent TEXT NOT NULL,
      followUpDate TEXT NOT NULL,
      stage TEXT NOT NULL DEFAULT 'new',
      notes TEXT,
      score INTEGER NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function migrate() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await migrateLeadsTable();
}
