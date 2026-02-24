"use client"

import Link from 'next/link'
import { Empty, Button } from '@cloudflare/kumo'
import { QuestionMarkIcon } from '@phosphor-icons/react'
 
export default function NotFound() {
  return (
    <div>
      <Empty
        title="404 - Isn't this page cool"
        description="The page you are looking for does not exist - now with kumo ui."
        icon={<QuestionMarkIcon size={48} className="kumo-text-inactive"/>}
        contents={
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => window.location.href = '/'}>Go Home</Button>
            <Button variant="secondary-destructive" onClick={() => window.location.reload}>Reload in the vain Attempt to do something</Button>
          </div>
        }
      />
    </div>
  )
}