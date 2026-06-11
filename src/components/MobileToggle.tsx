'use client'

export function MobileToggle() {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    const menu = document.getElementById('mobMenu')
    const backdrop = document.querySelector('.mob-backdrop') as HTMLElement | null
    const btn = e.currentTarget
    if (!menu) return
    if (menu.classList.contains('open')) {
      menu.classList.remove('open')
      backdrop?.classList.remove('open')
      btn.classList.remove('open')
      document.body.style.overflow = ''
    } else {
      menu.classList.add('open')
      backdrop?.classList.add('open')
      btn.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
  }

  return (
    <button
      className="mobile-toggle"
      id="mobileToggle"
      aria-label="Open menu"
      onClick={handleClick}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  )
}
