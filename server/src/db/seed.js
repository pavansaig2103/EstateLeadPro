import bcrypt from 'bcrypt';
import { calculateLeadScore } from '../utils/scoring.js';
import { all, db, get, migrate, run } from './database.js';

const today = new Date();
const addDays = (days) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const leads = [
  ['Aarav Mehta', '+91 98765 40112', 'above_1_crore', 'immediately', 'investment', 'Jubilee Hills', '5_plus', 'yes', 'Ramesh', addDays(0), 'site_visit_scheduled', 'High-value buyer wants two premium units and asked for legal pack.'],
  ['Priya Nair', '+91 98765 40113', '50_lakhs_1_crore', 'within_1_month', 'own_house', 'Kokapet', '5_plus', 'yes', 'Priya', addDays(-1), 'contacted', 'Family buyer comparing possession timelines and clubhouse access.'],
  ['Vikram Reddy', '+91 98765 40114', '25_50_lakhs', 'within_3_months', 'investment', 'Shankarpally', '2_4', 'no', 'Arjun', addDays(2), 'new', 'Wants appreciation near ORR, needs brochure first.'],
  ['Sneha Kapoor', '+91 98765 40115', 'below_25_lakhs', 'just_exploring', 'resale', 'Adibatla', '0_1', 'no', 'Neha', addDays(6), 'new', 'Early research enquiry from campaign.'],
  ['Rahul Iyer', '+91 98765 40116', 'above_1_crore', 'immediately', 'own_house', 'Financial District', '5_plus', 'yes', 'Ramesh', addDays(-2), 'converted', 'Booked premium east-facing unit after site visit.'],
  ['Nisha Rao', '+91 98765 40117', '50_lakhs_1_crore', 'within_1_month', 'own_house', 'Tellapur', '2_4', 'yes', 'Priya', addDays(0), 'site_visit_scheduled', 'Needs loan guidance and weekend visit slot.'],
  ['Karan Malhotra', '+91 98765 40118', '25_50_lakhs', 'within_3_months', 'commercial', 'Tukkuguda', '2_4', 'no', 'Arjun', addDays(-3), 'contacted', 'Looking at airport corridor commercial potential.'],
  ['Meera Joshi', '+91 98765 40119', 'above_1_crore', 'immediately', 'investment', 'Banjara Hills', '5_plus', 'yes', 'Neha', addDays(0), 'negotiation', 'Asked for discount, payment schedule, and immediate allotment.'],
  ['Aditya Sharma', '+91 98765 40120', 'below_25_lakhs', 'just_exploring', 'own_house', 'Yadagirigutta', '2_4', 'no', 'Arjun', addDays(4), 'contacted', 'Requested pricing and route map only.'],
  ['Farah Khan', '+91 98765 40121', '50_lakhs_1_crore', 'within_1_month', 'investment', 'Mokila', '5_plus', 'yes', 'Ramesh', addDays(1), 'site_visit_scheduled', 'Investor evaluating larger plots for farmhouse use.'],
  ['Rohan Das', '+91 98765 40122', 'below_25_lakhs', 'just_exploring', 'resale', 'Ibrahimpatnam', '0_1', 'no', 'Priya', addDays(-4), 'lost', 'Budget mismatch; archive after reason update.'],
  ['Ananya Gupta', '+91 98765 40123', '50_lakhs_1_crore', 'within_3_months', 'resale', 'Narsingi', '5_plus', 'yes', 'Neha', addDays(3), 'contacted', 'Wants resale prospects and gated amenities.'],
  ['Siddharth Jain', '+91 98765 40124', '25_50_lakhs', 'within_1_month', 'own_house', 'Kompally', '2_4', 'yes', 'Arjun', addDays(0), 'site_visit_scheduled', 'Asked about registration charges and legal clearances.'],
  ['Ishita Sen', '+91 98765 40125', '25_50_lakhs', 'immediately', 'commercial', 'Gachibowli Extension', '5_plus', 'no', 'Priya', addDays(-1), 'negotiation', 'Ready for booking if premium shop unit is available.'],
  ['Dev Patel', '+91 98765 40126', '50_lakhs_1_crore', 'within_1_month', 'investment', 'Neopolis', '5_plus', 'yes', 'Ramesh', addDays(5), 'converted', 'Closed after portfolio purchase discussion.'],
  ['Maya Krishnan', '+91 98765 40127', 'above_1_crore', 'within_1_month', 'own_house', 'Madhapur', '2_4', 'yes', 'Neha', addDays(0), 'new', 'Relocation buyer with strong budget and visit interest.'],
  ['Kabir Sethi', '+91 98765 40128', '50_lakhs_1_crore', 'just_exploring', 'investment', 'Patancheru', '0_1', 'no', 'Arjun', addDays(7), 'new', 'Checking long-term investment options.'],
  ['Lakshmi Menon', '+91 98765 40129', '25_50_lakhs', 'within_1_month', 'own_house', 'Miyapur', '5_plus', 'yes', 'Priya', addDays(-2), 'contacted', 'Needs school access, loan estimate, and callback today.'],
  ['Omar Sheikh', '+91 98765 40130', 'above_1_crore', 'immediately', 'commercial', 'HITEC City', '5_plus', 'yes', 'Ramesh', addDays(1), 'negotiation', 'Commercial buyer negotiating two-floor office space.'],
  ['Tanvi Bansal', '+91 98765 40131', 'below_25_lakhs', 'within_3_months', 'investment', 'Bhongir', '2_4', 'no', 'Neha', addDays(2), 'lost', 'Dropped due to distance concerns.']
];

export async function seedDatabase() {
  const admin = await get('SELECT id FROM users WHERE email = ?', ['admin@estateleads.com']);
  if (!admin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await run('INSERT INTO users (name, email, passwordHash, role) VALUES (?, ?, ?, ?)', [
      'EstateLead Admin',
      'admin@estateleads.com',
      passwordHash,
      'admin'
    ]);
  }

  const existingLeads = await get('SELECT COUNT(*) AS count FROM leads');
  if ((existingLeads?.count || 0) < 20) {
    await run('DELETE FROM leads');
    for (const item of leads) {
      const [name, phone, budgetRange, timeline, purpose, preferredLocation, questionsAsked, siteVisitInterest, assignedAgent, followUpDate, stage, notes] = item;
      const lead = { budgetRange, timeline, purpose, questionsAsked, siteVisitInterest, stage };
      const { score, status } = calculateLeadScore(lead);
      await run(
        `INSERT INTO leads
         (name, phone, budgetRange, timeline, purpose, preferredLocation, questionsAsked, siteVisitInterest, assignedAgent, followUpDate, stage, notes, score, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, phone, budgetRange, timeline, purpose, preferredLocation, questionsAsked, siteVisitInterest, assignedAgent, followUpDate, stage, notes, score, status]
      );
    }
  }
}

if (process.argv[1]?.endsWith('seed.js')) {
  await migrate();
  await seedDatabase();
  const rows = await all('SELECT COUNT(*) AS leads FROM leads');
  console.log(`Seed complete. Leads: ${rows[0].leads}`);
  db.close();
}
