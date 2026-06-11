import React from 'react'
import configPromise from '@payload-config'
import { RootPage } from '@payloadcms/next/views'
import { generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export async function generateMetadata({ params, searchParams }: Args) {
  return generatePageMetadata({ config: configPromise, params, searchParams })
}

export default async function Page({ params, searchParams }: Args) {
  return (
    <RootPage
      config={configPromise}
      importMap={importMap}
      params={params}
      searchParams={searchParams}
    />
  )
}
