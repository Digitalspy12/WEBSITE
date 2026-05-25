'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateSiteContent } from '@/app/actions'
import {
  LogOut,
  Save,
  Upload,
  Plus,
  Trash2,
  Layout,
  Rocket,
  Grid,
  FolderGit2,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Cpu,
  MessageSquare,
} from 'lucide-react'

// Tab definitions
const TABS = [
  { id: 'navbar', label: 'Navbar & Brand', Icon: Layout },
  { id: 'hero', label: 'Hero Section', Icon: Rocket },
  { id: 'testimonials', label: 'Testimonials', Icon: MessageSquare },
  { id: 'services', label: 'Services Catalog', Icon: Cpu },
  { id: 'bento', label: 'Bento Grid', Icon: Grid },
  { id: 'projects', label: 'Projects Showcase', Icon: FolderGit2 },
  { id: 'footer', label: 'Contact & Footer', Icon: Mail },
]

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  // State management
  const [activeTab, setActiveTab] = useState('navbar')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [content, setContent] = useState<any[]>([])
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)

  // Fetch all site content records
  const fetchContent = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('key', { ascending: true })

      if (error) throw error

      // Auto-seed missing keys for testimonials
      const requiredKeys = ['testimonials.section_badge', 'testimonials.title_lead', 'testimonials.list']
      const existingKeys = data ? data.map((item: any) => item.key) : []
      const missingKeys = requiredKeys.filter(k => !existingKeys.includes(k))

      if (missingKeys.length > 0) {
        console.log('Seeding missing testimonials keys on admin load...', missingKeys)
        const seedData = [
          {
            key: 'testimonials.section_badge',
            value: 'Reviews',
            type: 'text',
            label: 'Testimonials Section Badge',
            description: 'Small pill tag above section title'
          },
          {
            key: 'testimonials.title_lead',
            value: 'Customer Reviews',
            type: 'text',
            label: 'Testimonials Section Title',
            description: 'Main title for Customer Reviews'
          },
          {
            key: 'testimonials.list',
            value: [
              {
                id: 1,
                name: 'Edward Alexander',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop',
                rating: 4.9,
                date: '29 Aug, 2017',
                text: 'The entire process was seamless. They understood my technical requirements instantly and built a custom dashboard in 4 weeks. Their code ownership model gives me total peace of mind.'
              },
              {
                id: 2,
                name: 'Diana Johnston',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop',
                rating: 4.9,
                date: '29 Aug, 2017',
                text: 'Overall pleasurable experience.Pay a little first and Pay a little during the development of the app as milestones are achieved, which made me feel very confident and comfortable.Seamless and Easy process.'
              },
              {
                id: 3,
                name: 'Lauren Contreras',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&fit=crop',
                rating: 4.9,
                date: '29 Aug, 2017',
                text: 'I was skeptical about a \'done-for-you\' tech agency, but AK 0121 exceeded all expectations. They built our automated supply chain dashboard in record time. Absolute senior engineering caliber.'
              }
            ],
            type: 'list',
            label: 'Testimonials Reviews List',
            description: 'Reviews data containing avatar, name, rating, date, and review text.'
          }
        ]

        const toInsert = seedData.filter(item => missingKeys.includes(item.key))

        const { error: insertError } = await supabase
          .from('site_content')
          .insert(toInsert)

        if (insertError) {
          console.error('Failed to auto-seed testimonials keys:', insertError)
        } else {
          // Refetch to get the newly inserted records
          const { data: refetchedData, error: refetchError } = await supabase
            .from('site_content')
            .select('*')
            .order('key', { ascending: true })
          if (!refetchError && refetchedData) {
            setContent(refetchedData)
            return
          }
        }
      }

      setContent(data || [])
    } catch (e: any) {
      showStatus('error', e.message || 'Failed to fetch content data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  // Helper: Display floating status alerts
  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message })
    setTimeout(() => {
      setStatus(null)
    }, 4000)
  }

  // Handle Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Handle simple Key-Value Input update (local state state)
  const handleLocalValueChange = (key: string, value: any) => {
    setContent((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    )
  }

  // Save specific record to Database via Server Action
  const saveRecord = async (key: string, value: any) => {
    setSaving(key)
    try {
      const res = await updateSiteContent(key, value)
      if (res.success) {
        showStatus('success', `"${key}" saved successfully! Landing page is updated.`)
      } else {
        throw new Error(res.error)
      }
    } catch (e: any) {
      showStatus('error', e.message || `Failed to save "${key}".`)
    } finally {
      setSaving(null)
    }
  }

  // Upload Asset directly to Supabase Storage Bucket 'agency-assets'
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string, targetIndex?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(key + (targetIndex !== undefined ? `-${targetIndex}` : ''))
    try {
      // 1. Create clean unique filename
      const fileExt = file.name.split('.').pop()
      const cleanName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `uploads/${cleanName}`

      // 2. Upload file to Supabase Storage Bucket
      const { data, error: uploadError } = await supabase.storage
        .from('agency-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // 3. Get Public CDN URL
      const { data: { publicUrl } } = supabase.storage
        .from('agency-assets')
        .getPublicUrl(filePath)

      // 4. Update state and save
      if (targetIndex !== undefined) {
        // We are updating an image inside an array of objects
        const record = content.find((item) => item.key === key)
        if (record) {
          const list = [...record.value]
          const fieldName = key === 'testimonials.list' ? 'avatar' : 'img'
          list[targetIndex] = { ...list[targetIndex], [fieldName]: publicUrl }
          handleLocalValueChange(key, list)
          await saveRecord(key, list)
        }
      } else {
        // Simple top-level key value update
        handleLocalValueChange(key, publicUrl)
        await saveRecord(key, publicUrl)
      }

      showStatus('success', 'Image uploaded and linked successfully!')
    } catch (e: any) {
      console.error(e)
      showStatus('error', e.message || 'Image upload failed. Double-check bucket policies.')
    } finally {
      setUploadingImage(null)
    }
  }

  // Helpers for Lists & Arrays editing (e.g. tags cloud or words animation)
  const addArrayItem = (key: string, placeholder: string = 'New Item') => {
    const record = content.find((item) => item.key === key)
    if (record) {
      const currentList = Array.isArray(record.value) ? record.value : []
      const updatedList = [...currentList, placeholder]
      handleLocalValueChange(key, updatedList)
    }
  }

  const removeArrayItem = (key: string, index: number) => {
    const record = content.find((item) => item.key === key)
    if (record) {
      const updatedList = [...record.value]
      updatedList.splice(index, 1)
      handleLocalValueChange(key, updatedList)
    }
  }

  const updateArrayItem = (key: string, index: number, val: string) => {
    const record = content.find((item) => item.key === key)
    if (record) {
      const updatedList = [...record.value]
      updatedList[index] = val
      handleLocalValueChange(key, updatedList)
    }
  }

  // Helpers for Projects List management
  const addProject = () => {
    const key = 'projects.list'
    const record = content.find((item) => item.key === key)
    if (record) {
      const updatedList = [
        ...record.value,
        {
          id: Date.now(),
          img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600',
          title: 'New Agency Project',
          category: 'SaaS',
          tag: '100% Shipped',
          tagColor: '#ff6b2b',
          tagBg: 'rgba(255,107,43,0.12)',
          stat: 'Built in 4 weeks',
          year: '2026',
          desc: 'Brief description explaining what you built, how long it took, and what impact it delivered.',
        },
      ]
      handleLocalValueChange(key, updatedList)
    }
  }

  const removeProject = (index: number) => {
    const key = 'projects.list'
    const record = content.find((item) => item.key === key)
    if (record) {
      const updatedList = [...record.value]
      updatedList.splice(index, 1)
      handleLocalValueChange(key, updatedList)
    }
  }

  const updateProjectField = (index: number, field: string, value: any) => {
    const key = 'projects.list'
    const record = content.find((item) => item.key === key)
    if (record) {
      const updatedList = [...record.value]
      updatedList[index] = { ...updatedList[index], [field]: value }
      handleLocalValueChange(key, updatedList)
    }
  }

  // Helpers for Testimonials List management
  const addTestimonial = () => {
    const key = 'testimonials.list'
    const record = content.find((item) => item.key === key)
    if (record) {
      const updatedList = [
        ...record.value,
        {
          id: Date.now(),
          name: 'New Reviewer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop',
          rating: 4.9,
          date: '29 Aug, 2017',
          text: 'Overall pleasurable experience. Seamless and easy process.',
        },
      ]
      handleLocalValueChange(key, updatedList)
    }
  }

  const removeTestimonial = (index: number) => {
    const key = 'testimonials.list'
    const record = content.find((item) => item.key === key)
    if (record) {
      const updatedList = [...record.value]
      updatedList.splice(index, 1)
      handleLocalValueChange(key, updatedList)
    }
  }

  const updateTestimonialField = (index: number, field: string, value: any) => {
    const key = 'testimonials.list'
    const record = content.find((item) => item.key === key)
    if (record) {
      const updatedList = [...record.value]
      updatedList[index] = { ...updatedList[index], [field]: value }
      handleLocalValueChange(key, updatedList)
    }
  }

  // Filter keys by the active CMS tab
  const getTabRecords = () => {
    return content.filter((item) => item.key.startsWith(activeTab))
  }

  return (
    <main
      className="min-h-screen relative overflow-hidden flex flex-col grain"
      style={{ background: 'var(--background)' }}
    >
      {/* CMS Header */}
      <header
        className="px-6 py-4 flex items-center justify-between border-b sticky top-0 z-40 backdrop-blur-md"
        style={{ borderColor: 'var(--border)', background: 'rgba(10,10,10,0.85)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            AK
          </div>
          <div>
            <h1 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
              AK 0121 Agency CMS
            </h1>
            <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
              Supabase Powered Content Management Server
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-semibold cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all duration-200"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          <LogOut size={12} /> Sign Out
        </button>
      </header>

      {/* Floating Status Indicator */}
      {status && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce flex items-center gap-2.5 px-5 py-3.5 rounded-xl border text-sm font-medium shadow-2xl"
          style={{
            background: status.type === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
            borderColor: status.type === 'success' ? '#4ade8055' : '#ef444455',
            color: status.type === 'success' ? '#4ade80' : '#ef4444',
          }}
        >
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{status.message}</span>
        </div>
      )}

      {/* CMS Workspace Body */}
      <div className="max-w-7xl w-full mx-auto p-6 flex flex-col md:flex-row gap-6 flex-1">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold tracking-wide text-left cursor-pointer transition-all duration-200"
              style={{
                background: activeTab === id ? 'var(--secondary)' : 'transparent',
                color: activeTab === id ? 'var(--foreground)' : 'var(--muted-foreground)',
                border: activeTab === id ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              <Icon size={14} style={{ color: activeTab === id ? 'var(--primary)' : 'inherit' }} />
              {label}
            </button>
          ))}
        </aside>

        {/* CMS Editor Window */}
        <section className="flex-1 flex flex-col gap-6">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-[300px]">
              <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Loading CMS values from Supabase...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* SPECIAL CASE: PROJECTS SHOWCASE CUSTOM LIST EDITOR */}
              {activeTab === 'projects' && (
                <div className="p-6 rounded-2xl border flex flex-col gap-6"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                        Dynamic Projects Showcases
                      </h2>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        Manage individual cards inside the automatic scrolling infinite project gallery.
                      </p>
                    </div>
                    <button
                      onClick={addProject}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold transition-all hover:bg-primary/20"
                      style={{ color: 'var(--primary)' }}
                    >
                      <Plus size={12} /> Add Card
                    </button>
                  </div>

                  {content.find((i) => i.key === 'projects.list')?.value.map((project: any, index: number) => (
                    <div
                      key={project.id || index}
                      className="p-5 rounded-xl border flex flex-col lg:flex-row gap-5"
                      style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}
                    >
                      {/* Project Image Handler */}
                      <div className="w-full lg:w-48 flex flex-col gap-2">
                        <div className="relative h-28 w-full rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                          <img src={project.img} alt={project.title} className="object-cover w-full h-full" />
                        </div>
                        <label className="flex items-center justify-center gap-1.5 py-2 border rounded-lg text-[10px] font-mono font-bold cursor-pointer hover:bg-white/5 transition-all">
                          {uploadingImage === `projects.list-${index}` ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Upload size={10} />
                          )}
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'projects.list', index)}
                          />
                        </label>
                      </div>

                      {/* Fields editor grid */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => updateProjectField(index, 'title', e.target.value)}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                          <input
                            type="text"
                            value={project.category}
                            onChange={(e) => updateProjectField(index, 'category', e.target.value)}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Stat Tag (e.g. -60% response)</label>
                          <input
                            type="text"
                            value={project.stat}
                            onChange={(e) => updateProjectField(index, 'stat', e.target.value)}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Description Box</label>
                          <textarea
                            value={project.desc}
                            onChange={(e) => updateProjectField(index, 'desc', e.target.value)}
                            rows={2}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20 resize-none"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Pill Badge Text</label>
                          <input
                            type="text"
                            value={project.tag}
                            onChange={(e) => updateProjectField(index, 'tag', e.target.value)}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Completion Date (Year)</label>
                          <input
                            type="text"
                            value={project.year}
                            onChange={(e) => updateProjectField(index, 'year', e.target.value)}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>
                      </div>

                      <div className="flex lg:flex-col justify-end gap-2 shrink-0">
                        <button
                          onClick={() => removeProject(index)}
                          className="p-2 border border-red-500/20 text-red-500 rounded-lg bg-red-500/5 hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => saveRecord('projects.list', content.find((i) => i.key === 'projects.list')?.value)}
                    disabled={saving === 'projects.list'}
                    className="w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    {saving === 'projects.list' ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Save and Apply Projects Configuration
                  </button>
                </div>
              )}

              {/* SPECIAL CASE: TESTIMONIALS CUSTOM LIST EDITOR */}
              {activeTab === 'testimonials' && (
                <div className="p-6 rounded-2xl border flex flex-col gap-6"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                        Customer Testimonials
                      </h2>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        Manage reviewer profiles, names, ratings, and quotes displayed on the homepage curved arc layout.
                      </p>
                    </div>
                    <button
                      onClick={addTestimonial}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold transition-all hover:bg-primary/20"
                      style={{ color: 'var(--primary)' }}
                    >
                      <Plus size={12} /> Add Review
                    </button>
                  </div>

                  {content.find((i) => i.key === 'testimonials.list')?.value.map((testimonial: any, index: number) => (
                    <div
                      key={testimonial.id || index}
                      className="p-5 rounded-xl border flex flex-col lg:flex-row gap-5"
                      style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}
                    >
                      {/* Reviewer Avatar Image Handler */}
                      <div className="w-full lg:w-48 flex flex-col gap-2">
                        <div className="relative h-28 w-full rounded-lg overflow-hidden border bg-black/30" style={{ borderColor: 'var(--border)' }}>
                          {testimonial.avatar ? (
                            <img src={testimonial.avatar} alt={testimonial.name} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Photo</div>
                          )}
                        </div>
                        <label className="flex items-center justify-center gap-1.5 py-2 border rounded-lg text-[10px] font-mono font-bold cursor-pointer hover:bg-white/5 transition-all">
                          {uploadingImage === `testimonials.list-${index}` ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Upload size={10} />
                          )}
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'testimonials.list', index)}
                          />
                        </label>
                      </div>

                      {/* Fields editor grid */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                          <input
                            type="text"
                            value={testimonial.name}
                            onChange={(e) => updateTestimonialField(index, 'name', e.target.value)}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Rating Star Score (e.g. 4.9)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={testimonial.rating}
                            onChange={(e) => updateTestimonialField(index, 'rating', parseFloat(e.target.value) || 0)}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Review Date (e.g. 29 Aug, 2017)</label>
                          <input
                            type="text"
                            value={testimonial.date}
                            onChange={(e) => updateTestimonialField(index, 'date', e.target.value)}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>

                        <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Review Text Box</label>
                          <textarea
                            value={testimonial.text}
                            onChange={(e) => updateTestimonialField(index, 'text', e.target.value)}
                            rows={3}
                            className="px-3.5 py-2 border rounded-lg text-xs outline-none bg-black/20 resize-none"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        </div>
                      </div>

                      <div className="flex lg:flex-col justify-end gap-2 shrink-0">
                        <button
                          onClick={() => removeTestimonial(index)}
                          className="p-2 border border-red-500/20 text-red-500 rounded-lg bg-red-500/5 hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => saveRecord('testimonials.list', content.find((i) => i.key === 'testimonials.list')?.value)}
                    disabled={saving === 'testimonials.list'}
                    className="w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    {saving === 'testimonials.list' ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Save and Apply Testimonials List
                  </button>
                </div>
              )}

              {/* STANDARD EDITABLE FIELDS FORM LIST */}
              {getTabRecords()
                .filter((r) => r.key !== 'projects.list' && r.key !== 'testimonials.list')
                .map((record) => (
                  <div
                    key={record.key}
                    className="p-6 rounded-2xl border flex flex-col gap-4"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                  >
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-primary">
                        {record.key}
                      </span>
                      <h3 className="text-sm font-bold mt-0.5" style={{ color: 'var(--foreground)' }}>
                        {record.label}
                      </h3>
                      {record.description && (
                        <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                          {record.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      {/* TYPE: TEXT */}
                      {record.type === 'text' && (
                        <input
                          type="text"
                          value={record.value}
                          onChange={(e) => handleLocalValueChange(record.key, e.target.value)}
                          className="px-4 py-3 border rounded-xl text-xs outline-none bg-black/20"
                          style={{ borderColor: 'var(--border)' }}
                        />
                      )}

                      {/* TYPE: TEXTAREA */}
                      {record.type === 'textarea' && (
                        <textarea
                          value={record.value}
                          onChange={(e) => handleLocalValueChange(record.key, e.target.value)}
                          rows={4}
                          className="px-4 py-3 border rounded-xl text-xs outline-none bg-black/20"
                          style={{ borderColor: 'var(--border)' }}
                        />
                      )}

                      {/* TYPE: LIST/ARRAY OF STRINGS OR OBJECTS */}
                      {record.type === 'list' && Array.isArray(record.value) && (
                        <div className="flex flex-col gap-2">
                          {/* SPECIAL CASE: NAVBAR LINKS EDITOR */}
                          {record.key === 'navbar.links' ? (
                            <div className="flex flex-col gap-3">
                              {record.value.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-2 items-center p-3 rounded-lg border bg-black/20" style={{ borderColor: 'var(--border)' }}>
                                  <div className="flex-1 grid grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Label"
                                      value={item.label || ''}
                                      onChange={(e) => {
                                        const list = [...record.value]
                                        list[idx] = { ...list[idx], label: e.target.value }
                                        handleLocalValueChange(record.key, list)
                                      }}
                                      className="px-3 py-1.5 border rounded-lg text-xs outline-none bg-black/30 text-white"
                                      style={{ borderColor: 'var(--border)' }}
                                    />
                                    <input
                                      type="text"
                                      placeholder="Anchor Link (e.g. #work)"
                                      value={item.href || ''}
                                      onChange={(e) => {
                                        const list = [...record.value]
                                        list[idx] = { ...list[idx], href: e.target.value }
                                        handleLocalValueChange(record.key, list)
                                      }}
                                      className="px-3 py-1.5 border rounded-lg text-xs outline-none bg-black/30 text-white"
                                      style={{ borderColor: 'var(--border)' }}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = [...record.value]
                                      list.splice(idx, 1)
                                      handleLocalValueChange(record.key, list)
                                    }}
                                    className="p-1.5 text-red-500 border border-red-500/20 rounded hover:bg-red-500/10 cursor-pointer"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...record.value, { label: 'New Link', href: '#contact' }]
                                  handleLocalValueChange(record.key, list)
                                }}
                                className="w-fit flex items-center gap-1 px-3 py-1.5 border border-dashed rounded-full text-[10px] font-mono cursor-pointer hover:bg-white/5"
                                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                              >
                                <Plus size={10} /> Add Link
                              </button>
                            </div>
                          ) : record.key === 'footer.social_urls' ? (
                            /* SPECIAL CASE: FOOTER SOCIAL LINKS & EMAIL EDITOR */
                            <div className="flex flex-col gap-3">
                              {record.value.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-2 items-center p-3 rounded-lg border bg-black/20" style={{ borderColor: 'var(--border)' }}>
                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Social / Contact Name"
                                      value={item.label || ''}
                                      onChange={(e) => {
                                        const list = [...record.value]
                                        list[idx] = { ...list[idx], label: e.target.value }
                                        handleLocalValueChange(record.key, list)
                                      }}
                                      className="px-3 py-1.5 border rounded-lg text-xs outline-none bg-black/30 text-white"
                                      style={{ borderColor: 'var(--border)' }}
                                    />
                                    <input
                                      type="text"
                                      placeholder="URL (e.g. mailto:hello@ak.com)"
                                      value={item.href || ''}
                                      onChange={(e) => {
                                        const list = [...record.value]
                                        list[idx] = { ...list[idx], href: e.target.value }
                                        handleLocalValueChange(record.key, list)
                                      }}
                                      className="px-3 py-1.5 border rounded-lg text-xs outline-none bg-black/30 text-white"
                                      style={{ borderColor: 'var(--border)' }}
                                    />
                                    <select
                                      value={item.icon || 'Mail'}
                                      onChange={(e) => {
                                        const list = [...record.value]
                                        list[idx] = { ...list[idx], icon: e.target.value }
                                        handleLocalValueChange(record.key, list)
                                      }}
                                      className="px-3 py-1.5 border rounded-lg text-xs outline-none bg-black/30 text-white"
                                      style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                                    >
                                      <option value="Twitter">Twitter Icon</option>
                                      <option value="Github">GitHub Icon</option>
                                      <option value="Linkedin">LinkedIn Icon</option>
                                      <option value="Mail">Email Mail Icon</option>
                                    </select>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = [...record.value]
                                      list.splice(idx, 1)
                                      handleLocalValueChange(record.key, list)
                                    }}
                                    className="p-1.5 text-red-500 border border-red-500/20 rounded hover:bg-red-500/10 cursor-pointer"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...record.value, { label: 'Contact Email', href: 'mailto:hello@ak0121.agency', icon: 'Mail' }]
                                  handleLocalValueChange(record.key, list)
                                }}
                                className="w-fit flex items-center gap-1 px-3 py-1.5 border border-dashed rounded-full text-[10px] font-mono cursor-pointer hover:bg-white/5"
                                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                              >
                                <Plus size={10} /> Add Account/Email
                              </button>
                            </div>
                          ) : record.key === 'services.list' ? (
                            /* SPECIAL CASE: SERVICES ROW EDITOR */
                            <div className="flex flex-col gap-5 animate-fade-in">
                              {record.value.map((svc: any, idx: number) => (
                                <div key={idx} className="p-5 rounded-xl border flex flex-col gap-4 bg-black/20" style={{ borderColor: 'var(--border)' }}>
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div className="flex flex-col gap-1 sm:col-span-1">
                                      <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Index / No.</label>
                                      <input
                                        type="text"
                                        placeholder="01"
                                        value={svc.number || ''}
                                        onChange={(e) => {
                                          const list = [...record.value]
                                          list[idx] = { ...list[idx], number: e.target.value }
                                          handleLocalValueChange(record.key, list)
                                        }}
                                        className="px-3 py-1.5 border rounded-lg text-xs outline-none bg-black/30 text-white"
                                        style={{ borderColor: 'var(--border)' }}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1 sm:col-span-3">
                                      <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Service Title</label>
                                      <input
                                        type="text"
                                        placeholder="Custom Web Apps"
                                        value={svc.title || ''}
                                        onChange={(e) => {
                                          const list = [...record.value]
                                          list[idx] = { ...list[idx], title: e.target.value }
                                          handleLocalValueChange(record.key, list)
                                        }}
                                        className="px-3 py-1.5 border rounded-lg text-xs outline-none bg-black/30 text-white"
                                        style={{ borderColor: 'var(--border)' }}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                                    <textarea
                                      rows={2}
                                      placeholder="Brief service description..."
                                      value={svc.desc || ''}
                                      onChange={(e) => {
                                        const list = [...record.value]
                                        list[idx] = { ...list[idx], desc: e.target.value }
                                        handleLocalValueChange(record.key, list)
                                      }}
                                      className="px-3 py-1.5 border rounded-lg text-xs outline-none bg-black/30 text-white resize-none"
                                      style={{ borderColor: 'var(--border)' }}
                                    />
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">Technology Tags (Comma Separated)</label>
                                    <input
                                      type="text"
                                      placeholder="Next.js, Node.js, PostgreSQL"
                                      value={Array.isArray(svc.tags) ? svc.tags.join(', ') : svc.tags || ''}
                                      onChange={(e) => {
                                        const list = [...record.value]
                                        list[idx] = { ...list[idx], tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) }
                                        handleLocalValueChange(record.key, list)
                                      }}
                                      className="px-3 py-1.5 border rounded-lg text-xs outline-none bg-black/30 text-white"
                                      style={{ borderColor: 'var(--border)' }}
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = [...record.value]
                                      list.splice(idx, 1)
                                      handleLocalValueChange(record.key, list)
                                    }}
                                    className="w-fit self-end px-3 py-1.5 text-xs text-red-500 border border-red-500/20 rounded hover:bg-red-500/10 cursor-pointer flex items-center gap-1"
                                  >
                                    <Trash2 size={12} /> Remove Row
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...record.value, { number: `0${record.value.length + 1}`, title: 'New Service Capability', desc: 'Detailed outcomes delivered.', tags: ['React', 'API'] }]
                                  handleLocalValueChange(record.key, list)
                                }}
                                className="w-fit flex items-center gap-1 px-4 py-2 border border-dashed rounded-full text-xs font-mono cursor-pointer hover:bg-white/5"
                                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                              >
                                <Plus size={12} /> Add Service Row
                              </button>
                            </div>
                          ) : (
                            /* DEFAULT FALLBACK: SIMPLE STRINGS TAGS EDITOR */
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-wrap gap-2">
                                {record.value.map((item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium animate-fade-in"
                                    style={{
                                      background: 'var(--surface-raised)',
                                      borderColor: 'var(--border)',
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={item || ''}
                                      onChange={(e) => updateArrayItem(record.key, idx, e.target.value)}
                                      className="outline-none bg-transparent w-28 text-center text-xs text-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeArrayItem(record.key, idx)}
                                      className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => addArrayItem(record.key, 'New Item')}
                                className="w-fit flex items-center gap-1 px-3 py-1.5 border border-dashed rounded-full text-[10px] font-mono cursor-pointer hover:bg-white/5"
                                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                              >
                                <Plus size={10} /> Add Keyword
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TYPE: IMAGE URL UPLOADER */}
                      {record.type === 'image' && (
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                          <div className="relative h-20 w-32 border rounded-xl overflow-hidden bg-black/30 shrink-0" style={{ borderColor: 'var(--border)' }}>
                            <img src={record.value} alt={record.label} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1 flex flex-col gap-2">
                            <input
                              type="text"
                              value={record.value}
                              onChange={(e) => handleLocalValueChange(record.key, e.target.value)}
                              className="px-4 py-3 border rounded-xl text-xs outline-none bg-black/20 w-full"
                              style={{ borderColor: 'var(--border)' }}
                            />
                            <label className="flex items-center justify-center gap-2 py-2.5 border rounded-xl text-xs font-mono font-bold cursor-pointer hover:bg-white/5 transition-all">
                              {uploadingImage === record.key ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Upload size={12} />
                              )}
                              Upload Photo to Bucket
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, record.key)}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => saveRecord(record.key, record.value)}
                      disabled={saving === record.key}
                      className="w-fit px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 cursor-pointer transition-all self-end disabled:opacity-50"
                      style={{ background: 'rgba(255,107,43,0.12)', border: '1px solid rgba(255,107,43,0.2)', color: 'var(--primary)' }}
                    >
                      {saving === record.key ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Save size={12} />
                      )}
                      Save Item
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
