export type Member = {
  id: string
  name: string
  role: string
  disciplines: string[]
  bio: string
  email: string
  image: string
}

export type Work = {
  id: string
  title: string
  memberId: string
  memberName: string
  category: string
  status: 'approved' | 'pending'
  description: string
  image: string
}

export const members: Member[] = [
  { id: 'riley', name: 'Riley Van Heukelum', role: 'Website Manager', disciplines: ['Web Design', 'Motion Design', 'Graphic Design'], bio: 'A student designer interested in the intersection of technology, communication, and visual media.', email: 'member@example.edu', image: 'https://placehold.co/500x500?text=Riley' },
  { id: 'alex', name: 'Alex Morgan', role: 'President', disciplines: ['Illustration', 'Branding'], bio: 'Illustrator and designer focused on visual identity and editorial work.', email: 'member@example.edu', image: 'https://placehold.co/500x500?text=Alex' },
  { id: 'jamie', name: 'Jamie Lee', role: 'Creative Director', disciplines: ['Photography', 'Video', 'Motion Design'], bio: 'Visual storyteller working across photography, film, and motion graphics.', email: 'member@example.edu', image: 'https://placehold.co/500x500?text=Jamie' },
]

export const works: Work[] = [
  { id: '1', title: 'Campus Event Identity', memberId: 'alex', memberName: 'Alex Morgan', category: 'Graphic Design', status: 'approved', description: 'Identity system for a student event.', image: 'https://placehold.co/900x600?text=Graphic+Design' },
  { id: '2', title: 'Motion Study', memberId: 'riley', memberName: 'Riley Van Heukelum', category: 'Motion Design', status: 'approved', description: 'Experimental motion graphics study.', image: 'https://placehold.co/900x600?text=Motion+Design' },
  { id: '3', title: 'Portrait Series', memberId: 'jamie', memberName: 'Jamie Lee', category: 'Photography', status: 'approved', description: 'A small photographic portrait series.', image: 'https://placehold.co/900x600?text=Photography' },
  { id: '4', title: 'New Poster', memberId: 'riley', memberName: 'Riley Van Heukelum', category: 'Poster Design', status: 'pending', description: 'Awaiting leadership review.', image: 'https://placehold.co/900x600?text=Pending+Work' },
]
