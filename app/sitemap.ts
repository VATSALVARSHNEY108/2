import { MetadataRoute } from 'next'
import { getSubjectsFromFS } from '@/lib/content-registry'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ctrl-alt-learn.vercel.app' // Replace with actual URL
  const subjects = await getSubjectsFromFS()
  
  const subjectUrls = subjects.map((sub) => ({
    url: `${baseUrl}/curriculum/${sub.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const lessonUrls = subjects.flatMap((sub) => 
    sub.topics.flatMap((topic) => 
      topic.lessons.map((lesson) => ({
        url: `${baseUrl}/curriculum/${sub.id}/${topic.id}/${lesson.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    )
  )

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/curriculum`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playground`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...subjectUrls,
    ...lessonUrls,
  ]
}
