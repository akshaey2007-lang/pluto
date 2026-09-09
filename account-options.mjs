export const SKILLS = ['Product design', 'UI/UX design', 'Graphic design', 'Figma', 'User research', 'HTML & CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Mobile development', 'Data analysis', 'Machine learning', 'SQL', 'Cloud computing', 'Cybersecurity', 'Content writing', 'Copywriting', 'Digital marketing', 'SEO', 'Video editing', 'Animation', 'Project management', 'Business analysis'];
export function validateProfile(input, now = new Date()) {
  const { dob, education, phone, skills } = input;
  if (typeof dob !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) throw new Error('Enter your date of birth.');
  const date = new Date(dob + 'T00:00:00Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== dob || date >= now || date.getUTCFullYear() < 1900) throw new Error('Enter a valid date of birth.');
  if (typeof education !== 'string' || education.trim().length < 2 || education.trim().length > 300) throw new Error('Enter your education (2–300 characters).');
  if (typeof phone !== 'string' || !/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('Use a phone number with country code, such as +919876543210.');
  if (!Array.isArray(skills) || skills.length < 1 || skills.length > 15 || skills.some(s => !SKILLS.includes(s)) || new Set(skills).size !== skills.length) throw new Error('Choose between 1 and 15 skills from the options.');
  return { dob, education: education.trim(), phone, skills };
}
