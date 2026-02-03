import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect root "/" to the English locale homepage
  redirect('/en')
}
