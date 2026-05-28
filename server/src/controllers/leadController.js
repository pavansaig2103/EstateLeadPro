import { all, get, run } from '../db/database.js';
import { calculateLeadScore, recommendedAction } from '../utils/scoring.js';

const allowedBudgetRanges = ['below_25_lakhs', '25_50_lakhs', '50_lakhs_1_crore', 'above_1_crore'];
const allowedTimelines = ['immediately', 'within_1_month', 'within_3_months', 'just_exploring'];
const allowedPurposes = ['investment', 'own_house', 'resale', 'commercial'];
const allowedQuestions = ['0_1', '2_4', '5_plus'];
const allowedAgents = ['Ramesh', 'Priya', 'Arjun', 'Neha'];
const allowedStages = ['new', 'contacted', 'site_visit_scheduled', 'negotiation', 'converted', 'lost'];

function normalizeLeadPayload(body) {
  return {
    name: String(body.name || '').trim(),
    phone: String(body.phone || '').trim(),
    budgetRange: body.budgetRange,
    timeline: body.timeline,
    purpose: body.purpose,
    preferredLocation: String(body.preferredLocation || '').trim(),
    questionsAsked: body.questionsAsked,
    siteVisitInterest: body.siteVisitInterest === 'yes' ? 'yes' : 'no',
    assignedAgent: body.assignedAgent,
    followUpDate: String(body.followUpDate || '').trim(),
    stage: body.stage,
    notes: String(body.notes || '').trim()
  };
}

function validateLead(lead) {
  if (!lead.name || !lead.phone || !lead.preferredLocation) return 'Customer name, phone number, and preferred location are required.';
  if (!allowedBudgetRanges.includes(lead.budgetRange)) return 'A valid budget range is required.';
  if (!allowedTimelines.includes(lead.timeline)) return 'A valid buying timeline is required.';
  if (!allowedPurposes.includes(lead.purpose)) return 'A valid purpose is required.';
  if (!allowedQuestions.includes(lead.questionsAsked)) return 'A valid questions asked range is required.';
  if (!allowedAgents.includes(lead.assignedAgent)) return 'A valid assigned agent is required.';
  if (!allowedStages.includes(lead.stage)) return 'A valid lead stage is required.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lead.followUpDate)) return 'A valid follow-up date is required.';
  return null;
}

function withAction(lead) {
  return { ...lead, nextAction: recommendedAction(lead) };
}

export async function listLeads(req, res, next) {
  try {
    const { search, status, agent, stage, dueToday } = req.query;
    const where = [];
    const params = [];

    if (search) {
      where.push('(name LIKE ? OR phone LIKE ? OR preferredLocation LIKE ? OR assignedAgent LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (['Hot', 'Warm', 'Cold'].includes(status)) {
      where.push('status = ?');
      params.push(status);
    }
    if (allowedAgents.includes(agent)) {
      where.push('assignedAgent = ?');
      params.push(agent);
    }
    if (allowedStages.includes(stage)) {
      where.push('stage = ?');
      params.push(stage);
    }
    if (dueToday === 'true') {
      where.push("date(followUpDate) <= date('now', 'localtime')");
      where.push("stage NOT IN ('converted', 'lost')");
    }

    const sql = `SELECT * FROM leads ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY score DESC, date(followUpDate) ASC, datetime(createdAt) DESC`;
    const leads = await all(sql, params);
    return res.json({ leads: leads.map(withAction) });
  } catch (error) {
    return next(error);
  }
}

export async function getLead(req, res, next) {
  try {
    const lead = await get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    const scored = calculateLeadScore(lead);
    return res.json({ lead: withAction(lead), breakdown: scored.breakdown, recommendedAction: recommendedAction(lead) });
  } catch (error) {
    return next(error);
  }
}

export async function createLead(req, res, next) {
  try {
    const lead = normalizeLeadPayload(req.body);
    const validationError = validateLead(lead);
    if (validationError) return res.status(400).json({ message: validationError });

    const { score, status } = calculateLeadScore(lead);
    const result = await run(
      `INSERT INTO leads
       (name, phone, budgetRange, timeline, purpose, preferredLocation, questionsAsked, siteVisitInterest, assignedAgent, followUpDate, stage, notes, score, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [lead.name, lead.phone, lead.budgetRange, lead.timeline, lead.purpose, lead.preferredLocation, lead.questionsAsked, lead.siteVisitInterest, lead.assignedAgent, lead.followUpDate, lead.stage, lead.notes, score, status]
    );
    const created = await get('SELECT * FROM leads WHERE id = ?', [result.id]);
    return res.status(201).json({ lead: withAction(created) });
  } catch (error) {
    return next(error);
  }
}

export async function updateLead(req, res, next) {
  try {
    const existing = await get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Lead not found.' });

    const lead = normalizeLeadPayload({ ...existing, ...req.body });
    const validationError = validateLead(lead);
    if (validationError) return res.status(400).json({ message: validationError });

    const { score, status } = calculateLeadScore(lead);
    await run(
      `UPDATE leads SET
        name = ?, phone = ?, budgetRange = ?, timeline = ?, purpose = ?, preferredLocation = ?,
        questionsAsked = ?, siteVisitInterest = ?, assignedAgent = ?, followUpDate = ?, stage = ?,
        notes = ?, score = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [lead.name, lead.phone, lead.budgetRange, lead.timeline, lead.purpose, lead.preferredLocation, lead.questionsAsked, lead.siteVisitInterest, lead.assignedAgent, lead.followUpDate, lead.stage, lead.notes, score, status, req.params.id]
    );
    const updated = await get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    return res.json({ lead: withAction(updated) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteLead(req, res, next) {
  try {
    const existing = await get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Lead not found.' });
    await run('DELETE FROM leads WHERE id = ?', [req.params.id]);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
