import { all, get } from '../db/database.js';
import { recommendedAction } from '../utils/scoring.js';

function withAction(lead) {
  return { ...lead, nextAction: recommendedAction(lead) };
}

export async function dashboardStats(req, res, next) {
  try {
    const summary = await get(`
      SELECT
        COUNT(*) AS totalLeads,
        SUM(CASE WHEN status = 'Hot' THEN 1 ELSE 0 END) AS hotLeads,
        SUM(CASE WHEN status = 'Warm' THEN 1 ELSE 0 END) AS warmLeads,
        SUM(CASE WHEN status = 'Cold' THEN 1 ELSE 0 END) AS coldLeads,
        SUM(CASE WHEN date(followUpDate) <= date('now', 'localtime') AND stage NOT IN ('converted', 'lost') THEN 1 ELSE 0 END) AS followUpsDueToday,
        SUM(CASE WHEN siteVisitInterest = 'yes' THEN 1 ELSE 0 END) AS siteVisitInterested,
        SUM(CASE WHEN stage IN ('negotiation', 'converted') OR score >= 95 THEN 1 ELSE 0 END) AS conversionReady
      FROM leads
    `);

    const priorityLeads = await all('SELECT * FROM leads WHERE stage NOT IN (\'converted\', \'lost\') ORDER BY score DESC, date(followUpDate) ASC LIMIT 5');
    const urgentFollowUps = await all(`
      SELECT *
      FROM leads
      WHERE date(followUpDate) <= date('now', 'localtime')
        AND stage NOT IN ('converted', 'lost')
      ORDER BY date(followUpDate) ASC, score DESC
      LIMIT 8
    `);
    const funnel = await all('SELECT stage, COUNT(*) AS count FROM leads GROUP BY stage');
    const agentWorkload = await all('SELECT assignedAgent AS agent, COUNT(*) AS count FROM leads GROUP BY assignedAgent ORDER BY count DESC, assignedAgent ASC');

    return res.json({
      summary: {
        totalLeads: summary.totalLeads || 0,
        hotLeads: summary.hotLeads || 0,
        warmLeads: summary.warmLeads || 0,
        coldLeads: summary.coldLeads || 0,
        followUpsDueToday: summary.followUpsDueToday || 0,
        siteVisitInterested: summary.siteVisitInterested || 0,
        conversionReady: summary.conversionReady || 0
      },
      priorityLeads: priorityLeads.map(withAction),
      urgentFollowUps: urgentFollowUps.map(withAction),
      funnel,
      agentWorkload
    });
  } catch (error) {
    return next(error);
  }
}
