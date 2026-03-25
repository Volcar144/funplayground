import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { marked } from "marked"
import DOMPurify from 'dompurify';

const html = marked.use({
  async:true,
  gfm: true,
  breaks:true,
  
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
  chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function convertMarkdown(markdown: string){
  let parsed = await html.parse(markdown);
  const purified = DOMPurify.sanitize(parsed);

  return purified;
}