export type Job = {
  id: number;
  title: string;
  company: string;
  category: string;
  budget: string;
  duration: string;
  skills: string[];
  match: number;
  color: string;
  summary: string;
  deliverables: string[];
};

export const jobs: Job[] = [
  {
    id: 1,
    title: 'Shape a new identity for climate tech',
    company: 'FLOE LABS',
    category: 'Brand',
    budget: '₹55k–₹70k',
    duration: '3 weeks',
    skills: ['Brand strategy', 'Identity'],
    match: 98,
    color: 'violet',
    summary: 'Create a clear, credible identity system for a climate intelligence company preparing for its seed launch.',
    deliverables: ['Brand direction and positioning', 'Core visual identity system', 'Launch-ready social and pitch assets'],
  },
  {
    id: 2,
    title: 'Design the calmest health dashboard',
    company: 'MEND HEALTH',
    category: 'Product',
    budget: '₹80k–₹1.1L',
    duration: '4–6 weeks',
    skills: ['Product design', 'Figma'],
    match: 94,
    color: 'lime',
    summary: 'Simplify a clinical monitoring dashboard so care teams can understand patient changes at a glance.',
    deliverables: ['Workflow audit and wireframes', 'High-fidelity responsive UI', 'Documented component library'],
  },
  {
    id: 3,
    title: 'Tell our launch story in sixty seconds',
    company: 'NORTHSTAR',
    category: 'Motion',
    budget: '₹42k–₹55k',
    duration: '2 weeks',
    skills: ['Motion', 'Storyboards'],
    match: 91,
    color: 'orange',
    summary: 'Turn a complex developer product into a sharp sixty-second launch film with a confident visual rhythm.',
    deliverables: ['Narrative and storyboard', 'Motion direction and animation', 'Final film with social cut-downs'],
  },
  {
    id: 4,
    title: 'Build a playful commerce experience',
    company: 'MELLOW GOODS',
    category: 'Development',
    budget: '₹1.2L–₹1.6L',
    duration: '6 weeks',
    skills: ['Next.js', 'Interaction'],
    match: 89,
    color: 'blue',
    summary: 'Build a fast, expressive storefront for an independent homeware brand with thoughtful interaction details.',
    deliverables: ['Responsive Next.js storefront', 'Product and cart interactions', 'Performance and accessibility pass'],
  },
];

export const categories = ['All', 'Brand', 'Product', 'Motion', 'Development'];
