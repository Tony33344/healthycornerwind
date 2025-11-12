'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('success')
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-700 mb-4">CONTACT</p>
            <div className="w-16 h-1 bg-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900">Get in Touch</h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">Have questions? We&apos;d love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 pb-24">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div><strong>Address:</strong> Camp Menina, Slovenia</div>
              <div><strong>Email:</strong> info@healthycorner.si</div>
              <div><strong>Phone:</strong> +386 XX XXX XXX</div>
              <div><strong>Hours:</strong> Mon-Sun 7:00-20:00</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Name" required className="w-full p-3 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email" required className="w-full p-3 border rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="text" placeholder="Subject" required className="w-full p-3 border rounded-lg" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
            <textarea placeholder="Message" required rows={5} className="w-full p-3 border rounded-lg" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors">Send Message</button>
            {status === 'success' && <p className="text-green-600">Message sent successfully!</p>}
          </form>
        </div>
      </section>
    </main>
  )
}
