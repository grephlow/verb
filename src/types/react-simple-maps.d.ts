declare module 'react-simple-maps' {
  import React from 'react'

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: {
      scale?: number
      center?: [number, number]
      rotate?: [number, number, number]
    }
    width?: number
    height?: number
    style?: React.CSSProperties
    className?: string
    children?: React.ReactNode
  }

  export interface ZoomableGroupProps {
    zoom?: number
    center?: [number, number]
    minZoom?: number
    maxZoom?: number
    translateExtent?: [[number, number], [number, number]]
    onMoveStart?: (args: { coordinates: [number, number]; zoom: number }) => void
    onMove?: (args: { x: number; y: number; zoom: number; dragging: boolean }) => void
    onMoveEnd?: (args: { coordinates: [number, number]; zoom: number }) => void
    children?: React.ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (args: { geographies: Geography[] }) => React.ReactNode
  }

  export interface Geography {
    rsmKey: string
    type: string
    properties: Record<string, unknown>
    geometry: unknown
  }

  export interface GeographyProps {
    geography: Geography
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
    onClick?: (e: React.MouseEvent) => void
    onMouseEnter?: (e: React.MouseEvent) => void
    onMouseMove?: (e: React.MouseEvent) => void
    onMouseLeave?: (e: React.MouseEvent) => void
    className?: string
  }

  export interface MarkerProps {
    coordinates: [number, number]
    children?: React.ReactNode
    onMouseEnter?: (e: React.MouseEvent) => void
    onMouseLeave?: (e: React.MouseEvent) => void
    onClick?: (e: React.MouseEvent) => void
    style?: React.CSSProperties
  }

  export interface SphereProps {
    fill?: string
    stroke?: string
    strokeWidth?: number
  }

  export interface GraticuleProps {
    fill?: string
    stroke?: string
    strokeWidth?: number
  }

  export const ComposableMap: React.FC<ComposableMapProps>
  export const ZoomableGroup: React.FC<ZoomableGroupProps>
  export const Geographies: React.FC<GeographiesProps>
  export const Geography: React.FC<GeographyProps>
  export const Marker: React.FC<MarkerProps>
  export const Sphere: React.FC<SphereProps>
  export const Graticule: React.FC<GraticuleProps>
}
