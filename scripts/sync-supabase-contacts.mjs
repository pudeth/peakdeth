import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = 'sb_publishable_jUlsUiJWDne27I7z9sm0XA_GStfEDxE'
const supabase = createClient(url, key)

async function run() {
  console.log('Connecting to Supabase at:', url)
  const { data: contacts, error } = await supabase.from('contact_info').select('*').order('order', { ascending: true })
  if (error) {
    console.error('Error fetching contact_info:', error)
    return
  }
  console.log('Found', contacts?.length, 'contacts in Supabase.')

  // Update contact-1 (email) to peakmao007@gmail.com
  const emailItem = contacts.find((c) => c.type === 'email')
  if (emailItem) {
    const { error: err1 } = await supabase
      .from('contact_info')
      .update({ value: 'peakmao007@gmail.com', updated_at: new Date().toISOString() })
      .eq('id', emailItem.id)
    console.log('Updated email result:', err1 ? err1.message : 'SUCCESS')
  }

  // Update contact-5 (website) to https://peakdeth.vercel.app
  const siteItem = contacts.find((c) => c.type === 'website')
  if (siteItem) {
    const { error: err2 } = await supabase
      .from('contact_info')
      .update({ value: 'https://peakdeth.vercel.app', updated_at: new Date().toISOString() })
      .eq('id', siteItem.id)
    console.log('Updated website result:', err2 ? err2.message : 'SUCCESS')
  }

  const { data: updated } = await supabase.from('contact_info').select('*').order('order', { ascending: true })
  console.log('Updated contacts in Supabase:', updated)
}

run()
