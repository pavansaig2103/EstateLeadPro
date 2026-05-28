export const budgetScores = {
  below_25_lakhs: 10,
  '25_50_lakhs': 20,
  '50_lakhs_1_crore': 30,
  above_1_crore: 40
};

export const timelineScores = {
  immediately: 30,
  within_1_month: 25,
  within_3_months: 15,
  just_exploring: 5
};

export const purposeScores = {
  investment: 20,
  own_house: 15,
  commercial: 15,
  resale: 10
};

export const questionScores = {
  '0_1': 5,
  '2_4': 10,
  '5_plus': 15
};

export function calculateLeadScore(lead) {
  const budget = budgetScores[lead.budgetRange] || 0;
  const timeline = timelineScores[lead.timeline] || 0;
  const purpose = purposeScores[lead.purpose] || 0;
  const questions = questionScores[lead.questionsAsked] || 0;
  const siteVisit = lead.siteVisitInterest === 'yes' ? 25 : 0;
  const score = budget + timeline + purpose + questions + siteVisit;

  return {
    score,
    status: score >= 95 ? 'Hot' : score >= 60 ? 'Warm' : 'Cold',
    breakdown: { budget, timeline, purpose, questions, siteVisit }
  };
}

export function recommendedAction(lead) {
  if (lead.stage === 'converted') return 'Mark as closed and update payment tracking.';
  if (lead.stage === 'lost') return 'Archive lead with reason.';
  if (lead.status === 'Hot' && lead.siteVisitInterest === 'yes') return 'Call immediately and confirm site visit slot.';
  if (lead.status === 'Hot' && lead.siteVisitInterest !== 'yes') return 'Assign senior agent and offer site visit.';
  if (lead.status === 'Warm') return 'Send brochure and follow up within 48 hours.';
  return 'Add to nurture list and follow up next week.';
}
